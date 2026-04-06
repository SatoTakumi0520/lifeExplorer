"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const STORAGE_KEY = 'lifeExplorer_activeDays';

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function useActivityStreak(session: Session | null = null) {
  const [activeDays, setActiveDays] = useState<string[]>([]);

  useEffect(() => {
    const today = toDateStr(new Date());

    if (IS_DEMO) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const days: string[] = stored ? JSON.parse(stored) : [];
        const next = days.includes(today) ? days : [...days, today];
        if (!days.includes(today)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        setActiveDays(next);
      } catch { /* ignore */ }
      return;
    }

    if (!session?.user?.id) return;

    const load = async () => {
      // Fetch last 35+ days of activity
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 35);

      const [{ data: rows }] = await Promise.all([
        supabase
          .from('activity_logs')
          .select('active_date')
          .eq('user_id', session.user.id)
          .gte('active_date', toDateStr(cutoff)),
        // Record today (ignore duplicate error via unique constraint)
        supabase
          .from('activity_logs')
          .upsert({ user_id: session.user.id, active_date: today }, { onConflict: 'user_id,active_date', ignoreDuplicates: true }),
      ]);

      const days = (rows ?? []).map((r) => r.active_date as string);
      const withToday = days.includes(today) ? days : [...days, today];
      setActiveDays(withToday);
    };

    load();
  }, [session?.user?.id]);

  const recordToday = useCallback(() => {
    const today = toDateStr(new Date());

    if (IS_DEMO) {
      setActiveDays((prev) => {
        if (prev.includes(today)) return prev;
        const next = [...prev, today];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    if (!session?.user?.id) return;

    supabase
      .from('activity_logs')
      .upsert({ user_id: session.user.id, active_date: today }, { onConflict: 'user_id,active_date', ignoreDuplicates: true });

    setActiveDays((prev) => {
      if (prev.includes(today)) return prev;
      return [...prev, today];
    });
  }, [session?.user?.id]);

  // Compute consecutive streak ending today
  const streak = (() => {
    if (activeDays.length === 0) return 1;
    const sorted = [...activeDays].sort();
    const today = new Date();
    let count = 0;
    const cursor = new Date(today);
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
