"use client";

import { useState, useCallback, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { RoutineComment } from '../lib/types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const DEMO_COMMENTS: Record<string, RoutineComment[]> = {};
let demoIdCounter = 0;

const mapRow = (row: any): RoutineComment => ({
  id: row.id,
  routineId: row.routine_id,
  userId: row.user_id,
  displayName: row.display_name,
  body: row.body,
  createdAt: row.created_at,
});

export function useComments(session: Session | null) {
  // routineId → comments
  const [commentsByRoutine, setCommentsByRoutine] = useState<Record<string, RoutineComment[]>>({});
  const [loadingRoutineId, setLoadingRoutineId] = useState<string | null>(null);
  const [postingRoutineId, setPostingRoutineId] = useState<string | null>(null);
  const loadedIdsRef = useRef<Set<string>>(new Set());

  const fetchComments = useCallback(async (routineId: string) => {
    // Already loaded — ref で判定（stale closure 回避）
    if (loadedIdsRef.current.has(routineId)) return;

    setLoadingRoutineId(routineId);

    if (IS_DEMO) {
      setCommentsByRoutine(prev => ({ ...prev, [routineId]: DEMO_COMMENTS[routineId] ?? [] }));
      setLoadingRoutineId(null);
      return;
    }

    const { data, error } = await supabase
      .from('routine_comments')
      .select('*')
      .eq('routine_id', routineId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load comments:', error);
      setLoadingRoutineId(null);
      return;
    }

    loadedIdsRef.current.add(routineId);
    setCommentsByRoutine(prev => ({
      ...prev,
      [routineId]: (data ?? []).map(mapRow),
    }));
    setLoadingRoutineId(null);
  }, []);

  const postComment = useCallback(async (routineId: string, body: string) => {
    if (!body.trim()) return;
    setPostingRoutineId(routineId);

    if (IS_DEMO) {
      const newComment: RoutineComment = {
        id: `demo-${++demoIdCounter}`,
        routineId,
        userId: 'demo-user',
        displayName: 'あなた',
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };
      DEMO_COMMENTS[routineId] = [...(DEMO_COMMENTS[routineId] ?? []), newComment];
      setCommentsByRoutine(prev => ({
        ...prev,
        [routineId]: [...(prev[routineId] ?? []), newComment],
      }));
      setPostingRoutineId(null);
      return;
    }

    if (!session?.user?.id) { setPostingRoutineId(null); return; }

    const displayName = session.user.email?.split('@')[0] ?? 'Explorer';
    const { data } = await supabase
      .from('routine_comments')
      .insert({
        routine_id: routineId,
        user_id: session.user.id,
        display_name: displayName,
        body: body.trim(),
      })
      .select()
      .single();

    if (data) {
      setCommentsByRoutine(prev => ({
        ...prev,
        [routineId]: [...(prev[routineId] ?? []), mapRow(data)],
      }));
    }
    setPostingRoutineId(null);
  }, [session?.user?.id, session?.user?.email]);

  const deleteComment = useCallback(async (routineId: string, commentId: string) => {
    if (IS_DEMO) {
      DEMO_COMMENTS[routineId] = (DEMO_COMMENTS[routineId] ?? []).filter(c => c.id !== commentId);
      setCommentsByRoutine(prev => ({
        ...prev,
        [routineId]: (prev[routineId] ?? []).filter(c => c.id !== commentId),
      }));
      return;
    }

    if (!session?.user?.id) return;

    await supabase.from('routine_comments').delete().eq('id', commentId);
    setCommentsByRoutine(prev => ({
      ...prev,
      [routineId]: (prev[routineId] ?? []).filter(c => c.id !== commentId),
    }));
  }, [session?.user?.id]);

  return {
    commentsByRoutine,
    loadingRoutineId,
    postingRoutineId,
    fetchComments,
    postComment,
    deleteComment,
  };
}
