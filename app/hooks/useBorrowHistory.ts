"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { PersonaCategory } from '../lib/types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const STORAGE_KEY = 'lifeExplorer_borrowHistory';

export type BorrowRecord = {
  personaId: string | number;
  personaName: string;
  title: string;
  category: PersonaCategory | string;
  firstBorrowedAt: string; // ISO date string
  lastBorrowedAt: string;
  triedCount: number;
};

export function useBorrowHistory(session: Session | null = null) {
  const [history, setHistory] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    if (IS_DEMO) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setHistory(JSON.parse(stored));
      } catch { /* ignore */ }
      return;
    }

    if (!session?.user?.id) return;

    const load = async () => {
      const { data } = await supabase
        .from('borrow_history')
        .select('persona_name, source_title, tried_at')
        .eq('user_id', session.user.id)
        .order('tried_at', { ascending: false });

      if (!data) return;

      // Aggregate by source_title (persona name as key)
      const grouped = new Map<string, BorrowRecord>();
      for (const row of data) {
        const key = row.source_title ?? row.persona_name;
        const existing = grouped.get(key);
        if (!existing) {
          grouped.set(key, {
            personaId: key,
            personaName: row.persona_name,
            title: row.source_title ?? row.persona_name,
            category: 'custom',
            firstBorrowedAt: row.tried_at,
            lastBorrowedAt: row.tried_at,
            triedCount: 1,
          });
        } else {
          existing.triedCount++;
          if (row.tried_at < existing.firstBorrowedAt) existing.firstBorrowedAt = row.tried_at;
          if (row.tried_at > existing.lastBorrowedAt) existing.lastBorrowedAt = row.tried_at;
        }
      }
      setHistory([...grouped.values()]);
    };

    load();
  }, [session?.user?.id]);

  const recordBorrow = useCallback((persona: {
    id: string | number;
    name: string;
    title: string;
    category?: PersonaCategory | string;
  }) => {
    const now = new Date().toISOString();

    if (IS_DEMO) {
      setHistory((prev) => {
        const existing = prev.find((r) => r.personaId === persona.id);
        let next: BorrowRecord[];
        if (existing) {
          next = prev.map((r) =>
            r.personaId === persona.id
              ? { ...r, triedCount: r.triedCount + 1, lastBorrowedAt: now }
              : r
          );
        } else {
          const newRecord: BorrowRecord = {
            personaId: persona.id,
            personaName: persona.name,
            title: persona.title,
            category: persona.category ?? 'custom',
            firstBorrowedAt: now,
            lastBorrowedAt: now,
            triedCount: 1,
          };
          next = [newRecord, ...prev];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    if (!session?.user?.id) return;

    // Production: insert event row, update local state optimistically
    supabase.from('borrow_history').insert({
      user_id: session.user.id,
      persona_name: persona.name,
      source_type: 'persona',
      source_title: persona.title,
      tried_count: 1,
    });

    setHistory((prev) => {
      const existing = prev.find((r) => r.personaId === persona.id);
      if (existing) {
        return prev.map((r) =>
          r.personaId === persona.id
            ? { ...r, triedCount: r.triedCount + 1, lastBorrowedAt: now }
            : r
        );
      }
      return [{
        personaId: persona.id,
        personaName: persona.name,
        title: persona.title,
        category: persona.category ?? 'custom',
        firstBorrowedAt: now,
        lastBorrowedAt: now,
        triedCount: 1,
      }, ...prev];
    });
  }, [session?.user?.id]);

  return { history, recordBorrow };
}
