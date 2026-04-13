"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { RoutineTask } from '../lib/types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const DEMO_PUBLIC_ROUTINES: PublicRoutine[] = [
  {
    id: 'demo-pub-1',
    userId: 'demo-user-a',
    displayName: 'Sakura',
    title: '朝ヨガと読書で始まる一日',
    category: 'wellness',
    routineTasks: [
      { time: '06:00', endTime: '06:30', title: 'Morning Yoga', thought: '太陽礼拝で体を目覚めさせる', type: 'nature' },
      { time: '06:30', endTime: '07:00', title: '読書タイム', thought: '好きな本を30分', type: 'mind' },
      { time: '09:00', endTime: '12:00', title: 'フォーカスワーク', thought: '午前中に集中タスクを片付ける', type: 'work' },
      { time: '12:30', endTime: '13:00', title: 'ランチ散歩', thought: '外の空気を吸って気分転換', type: 'nature' },
    ],
    likesCount: 12,
    createdAt: '2026-04-10T08:00:00Z',
    isLikedByMe: false,
  },
  {
    id: 'demo-pub-2',
    userId: 'demo-user-b',
    displayName: 'Kenji',
    title: 'エンジニアの生産性ルーティン',
    category: 'productivity',
    routineTasks: [
      { time: '07:00', endTime: '07:30', title: 'ジャーナリング', thought: '今日のゴールを3つ書き出す', type: 'mind' },
      { time: '08:00', endTime: '11:00', title: 'Deep Coding', thought: 'SlackオフでコードにDive', type: 'work' },
      { time: '11:00', endTime: '11:15', title: 'ストレッチ', thought: '肩と腰を伸ばす', type: 'nature' },
      { time: '14:00', endTime: '16:00', title: 'ペアプロ / レビュー', thought: 'チームの知識共有', type: 'work' },
    ],
    likesCount: 8,
    createdAt: '2026-04-11T10:00:00Z',
    isLikedByMe: true,
  },
  {
    id: 'demo-pub-3',
    userId: 'demo-user-c',
    displayName: 'Mika',
    title: '子育てしながら自分時間を確保',
    category: 'parenting',
    routineTasks: [
      { time: '05:30', endTime: '06:30', title: '自分時間', thought: '子供が起きる前の貴重な1時間', type: 'mind' },
      { time: '08:00', endTime: '09:00', title: '送り出し', thought: '朝ごはん→保育園', type: 'work' },
      { time: '10:00', endTime: '12:00', title: '在宅ワーク', thought: '集中できる午前中に重要タスク', type: 'work' },
      { time: '15:00', endTime: '16:00', title: '公園タイム', thought: 'お迎え後に外遊び', type: 'nature' },
    ],
    likesCount: 15,
    createdAt: '2026-04-09T06:00:00Z',
    isLikedByMe: false,
  },
];

export type PublicRoutine = {
  id: string;
  userId: string;
  displayName: string;
  title: string;
  category: string | null;
  routineTasks: RoutineTask[];
  likesCount: number;
  createdAt: string;
  isLikedByMe: boolean;
};

export function usePublicRoutines(session: Session | null) {
  const [publicRoutines, setPublicRoutines] = useState<PublicRoutine[]>([]);
  const [myPublishedId, setMyPublishedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mapRow = (row: any, myLikedIds: Set<string>): PublicRoutine => ({
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    title: row.title,
    category: row.category ?? null,
    routineTasks: (row.routine_tasks ?? []) as RoutineTask[],
    likesCount: row.likes_count ?? 0,
    createdAt: row.created_at,
    isLikedByMe: myLikedIds.has(row.id),
  });

  const load = useCallback(async () => {
    if (IS_DEMO) {
      setPublicRoutines(DEMO_PUBLIC_ROUTINES);
      setLoading(false);
      return;
    }

    const { data: rows } = await supabase
      .from('public_routines')
      .select('*')
      .order('likes_count', { ascending: false });

    let myLikedIds = new Set<string>();
    if (session?.user?.id) {
      const { data: likes } = await supabase
        .from('routine_likes')
        .select('routine_id')
        .eq('user_id', session.user.id);
      myLikedIds = new Set((likes ?? []).map((l: any) => l.routine_id));
    }

    const routines = (rows ?? []).map(r => mapRow(r, myLikedIds));
    setPublicRoutines(routines);

    if (session?.user?.id) {
      const mine = routines.find(r => r.userId === session.user.id);
      setMyPublishedId(mine?.id ?? null);
    }

    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => { load(); }, [load]);

  const publish = useCallback(async (
    myRoutine: RoutineTask[],
    displayName: string,
    title: string,
    category?: string,
  ) => {
    if (!session?.user?.id || IS_DEMO) return;

    const payload = {
      user_id: session.user.id,
      display_name: displayName || 'Explorer',
      title: title || '私の一日',
      category: category ?? null,
      routine_tasks: myRoutine,
      updated_at: new Date().toISOString(),
    };

    const { data } = await supabase
      .from('public_routines')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (data) {
      setMyPublishedId(data.id);
      await load();
    }
  }, [session?.user?.id, load]);

  const unpublish = useCallback(async () => {
    if (!session?.user?.id || IS_DEMO) return;

    await supabase
      .from('public_routines')
      .delete()
      .eq('user_id', session.user.id);

    setMyPublishedId(null);
    await load();
  }, [session?.user?.id, load]);

  const toggleLike = useCallback(async (routineId: string) => {
    if (IS_DEMO) {
      setPublicRoutines(prev => prev.map(r =>
        r.id === routineId
          ? { ...r, isLikedByMe: !r.isLikedByMe, likesCount: r.isLikedByMe ? r.likesCount - 1 : r.likesCount + 1 }
          : r
      ));
      return;
    }
    if (!session?.user?.id) return;

    const target = publicRoutines.find(r => r.id === routineId);
    if (!target) return;

    if (target.isLikedByMe) {
      await supabase.from('routine_likes').delete()
        .eq('routine_id', routineId).eq('user_id', session.user.id);
      await supabase.from('public_routines')
        .update({ likes_count: Math.max(0, target.likesCount - 1) })
        .eq('id', routineId);
    } else {
      await supabase.from('routine_likes').insert({
        routine_id: routineId, user_id: session.user.id,
      });
      await supabase.from('public_routines')
        .update({ likes_count: target.likesCount + 1 })
        .eq('id', routineId);
    }

    // Optimistic update
    setPublicRoutines(prev => prev.map(r =>
      r.id === routineId
        ? { ...r, isLikedByMe: !r.isLikedByMe, likesCount: r.isLikedByMe ? r.likesCount - 1 : r.likesCount + 1 }
        : r
    ));
  }, [session?.user?.id, publicRoutines]);

  return {
    publicRoutines,
    myPublishedId,
    isPublished: myPublishedId !== null,
    loading,
    publish,
    unpublish,
    toggleLike,
  };
}
