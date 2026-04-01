"use client";

import { useState, useEffect, useCallback } from 'react';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const STORAGE_KEY = 'lifeExplorer_favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (IS_DEMO) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setFavoriteIds(new Set(JSON.parse(stored)));
      } catch { /* ignore */ }
    }
    // 本番: Supabase favorites テーブルから取得（Phase 2で実装）
  }, []);

  const toggle = useCallback((id: string | number) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (IS_DEMO) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string | number) => favoriteIds.has(id), [favoriteIds]);

  return { favoriteIds, toggle, isFavorite };
}
