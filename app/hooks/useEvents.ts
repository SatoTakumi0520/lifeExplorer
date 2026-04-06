"use client";

import { useState, useEffect } from 'react';
import { fetchEvents, EventItem } from '../lib/eventService';

export function useEvents(prefecture: string | null = null) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchEvents(prefecture)
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('イベント情報を取得できませんでした');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [prefecture]);

  return { events, loading, error };
}
