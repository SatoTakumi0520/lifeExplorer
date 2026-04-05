"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { RoutineTask } from '../lib/types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

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
    if (IS_DEMO) { setLoading(false); return; }

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
    if (!session?.user?.id || IS_DEMO) return;

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
