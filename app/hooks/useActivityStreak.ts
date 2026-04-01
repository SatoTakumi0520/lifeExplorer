"use client";

import { useState, useEffect, useCallback } from 'react';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const STORAGE_KEY = 'lifeExplorer_activeDays';

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function useActivityStreak() {
  const [activeDays, setActiveDays] = useState<string[]>([]);

  useEffect(() => {
    if (!IS_DEMO) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const days: string[] = stored ? JSON.parse(stored) : [];

      // Record today automatically
      const today = toDateStr(new Date());
      const next = days.includes(today) ? days : [...days, today];
      if (!days.includes(today)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      setActiveDays(next);
    } catch { /* ignore */ }
  }, []);

  const recordToday = useCallback(() => {
    if (!IS_DEMO) return;
    const today = toDateStr(new Date());
    setActiveDays((prev) => {
      if (prev.includes(today)) return prev;
      const next = [...prev, today];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Compute consecutive streak ending today
  const streak = (() => {
    if (activeDays.length === 0) return 1; // at least today
    const sorted = [...activeDays].sort();
    const today = new Date();
    let count = 0;
    let cursor = new Date(today);
    while (true) {
      const dateStr = toDateStr(cursor);
      if (sorted.includes(dateStr)) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return Math.max(count, 1);
  })();

  // Last 35 days activity grid (0-3 levels)
  const last35Days: number[] = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return activeDays.includes(toDateStr(d)) ? 3 : 0;
  });

  const totalActiveDays = activeDays.length;

  return { streak, last35Days, totalActiveDays, recordToday };
}
