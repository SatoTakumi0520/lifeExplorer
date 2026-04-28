"use client";

import { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ScheduledEvent, RoutineTask } from '../lib/types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const STORAGE_KEY = 'lifeExplorer_scheduledEvents';

/** デモ: localStorage 読み書き */
const loadDemo = (): ScheduledEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};
const saveDemo = (events: ScheduledEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

/** 日付文字列を YYYY-MM-DD に正規化 */
const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const useScheduledEvents = (session: Session | null) => {
  const [events, setEvents] = useState<ScheduledEvent[]>(() =>
    IS_DEMO ? loadDemo() : []
  );

  /** DB から取得 */
  const fetchEvents = useCallback(async (userId: string) => {
    if (IS_DEMO) return;
    const { data, error } = await supabase
      .from('scheduled_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date');
    if (error || !data) return;
    setEvents(data.map(row => ({
      id: row.id,
      title: row.title,
      date: row.event_date,
      time: row.start_time,
      endTime: row.end_time,
      location: row.location,
      url: row.url,
      category: row.category,
      source: row.source,
      thought: row.thought,
      type: row.type,
    })));
  }, []);

  useEffect(() => {
    if (IS_DEMO || !session?.user.id) return;
    fetchEvents(session.user.id);
  }, [session?.user.id, fetchEvents]);

  /** イベントを予定に追加 */
  const addEvent = useCallback(async (event: Omit<ScheduledEvent, 'id'>) => {
    const newEvent: ScheduledEvent = { ...event, id: `evt-${Date.now()}` };

    if (IS_DEMO) {
      setEvents(prev => {
        const updated = [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
        saveDemo(updated);
        return updated;
      });
      return;
    }

    if (!session?.user.id) return;

    // 楽観的更新
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)));

    const { error } = await supabase.from('scheduled_events').insert({
      user_id: session.user.id,
      title: event.title,
      event_date: event.date,
      start_time: event.time,
      end_time: event.endTime,
      location: event.location,
      url: event.url,
      category: event.category,
      source: event.source,
      thought: event.thought,
      type: event.type,
    });

    if (error) {
      setEvents(prev => prev.filter(e => e.id !== newEvent.id));
      return;
    }
    fetchEvents(session.user.id);
  }, [session?.user.id, fetchEvents]);

  /** イベントを削除 */
  const removeEvent = useCallback(async (eventId: string) => {
    if (IS_DEMO) {
      setEvents(prev => {
        const updated = prev.filter(e => e.id !== eventId);
        saveDemo(updated);
        return updated;
      });
      return;
    }

    if (!session?.user.id) return;
    setEvents(prev => prev.filter(e => e.id !== eventId));
    await supabase.from('scheduled_events').delete().eq('id', eventId);
  }, [session?.user.id]);

  /** 特定日のイベントを RoutineTask[] に変換 */
  const getTasksForDate = useCallback((date: Date): RoutineTask[] => {
    const key = toDateKey(date);
    return events
      .filter(e => e.date === key)
      .map(e => ({
        id: e.id,
        time: e.time,
        endTime: e.endTime,
        title: e.title,
        thought: e.thought || '',
        type: e.type,
        isOther: false,
        url: e.url,
      }));
  }, [events]);

  /** イベントがすでに予定に入っているか */
  const isScheduled = useCallback((eventTitle: string, eventDate: string): boolean => {
    return events.some(e => e.title === eventTitle && e.date === eventDate);
  }, [events]);

  /** 特定月にイベントがある日付セット */
  const getEventDatesForMonth = useCallback((year: number, month: number): Set<string> => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return new Set(events.filter(e => e.date.startsWith(prefix)).map(e => e.date));
  }, [events]);

  /** 未来のイベント一覧 */
  const upcomingEvents = events.filter(e => e.date >= toDateKey(new Date()));

  /** 過去のイベント一覧 */
  const pastEvents = events.filter(e => e.date < toDateKey(new Date()));

  return {
    events,
    upcomingEvents,
    pastEvents,
    addEvent,
    removeEvent,
    getTasksForDate,
    isScheduled,
    getEventDatesForMonth,
  };
};
