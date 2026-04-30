"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// デモ用のフォロー状態
const demoFollowing = new Set<string>();

export function useFollows(session: Session | null) {
  // 自分がフォローしている userId の Set
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (IS_DEMO) {
      setFollowingIds(new Set(demoFollowing));
      setLoading(false);
      return;
    }
    if (!session?.user?.id) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', session.user.id);

    if (error) {
      console.error('Failed to load follows:', error);
      setLoading(false);
      return;
    }

    setFollowingIds(new Set((data ?? []).map((r: any) => r.following_id)));
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => { load(); }, [load]);

  const follow = useCallback(async (userId: string) => {
    if (IS_DEMO) {
      demoFollowing.add(userId);
      setFollowingIds(new Set(demoFollowing));
      return;
    }
    if (!session?.user?.id) return;

    await supabase.from('user_follows').insert({
      follower_id: session.user.id,
      following_id: userId,
    });

    setFollowingIds(prev => new Set([...prev, userId]));
  }, [session?.user?.id]);

  const unfollow = useCallback(async (userId: string) => {
    if (IS_DEMO) {
      demoFollowing.delete(userId);
      setFollowingIds(new Set(demoFollowing));
      return;
    }
    if (!session?.user?.id) return;

    await supabase.from('user_follows').delete()
      .eq('follower_id', session.user.id)
      .eq('following_id', userId);

    setFollowingIds(prev => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  }, [session?.user?.id]);

  const toggleFollow = useCallback(async (userId: string) => {
    if (followingIds.has(userId)) {
      await unfollow(userId);
    } else {
      await follow(userId);
    }
  }, [followingIds, follow, unfollow]);

  const isFollowing = useCallback((userId: string) => followingIds.has(userId), [followingIds]);

  return {
    followingIds,
    loading,
    follow,
    unfollow,
    toggleFollow,
    isFollowing,
  };
}
