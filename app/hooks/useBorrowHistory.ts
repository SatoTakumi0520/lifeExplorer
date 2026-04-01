"use client";

import { useState, useEffect, useCallback } from 'react';
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

export function useBorrowHistory() {
  const [history, setHistory] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    if (IS_DEMO) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setHistory(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const recordBorrow = useCallback((persona: {
    id: string | number;
    name: string;
    title: string;
    category?: PersonaCategory | string;
  }) => {
    const now = new Date().toISOString();
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
      if (IS_DEMO) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return { history, recordBorrow };
}
