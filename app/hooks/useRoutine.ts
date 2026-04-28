"use client";

import { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { RoutineTask, ScheduleType } from '../lib/types';
import { MOCK_MY_ROUTINE_WEEKDAY, MOCK_MY_ROUTINE_WEEKEND } from '../lib/mockData';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const DEMO_STORAGE_KEY = 'lifeExplorer_routines';

/** 今日が平日かどうかを判定 */
const getTodayScheduleType = (): ScheduleType => {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
};

/** デモモード用: localStorage からルーティンを読み込み */
const loadDemoRoutines = (): Record<ScheduleType, RoutineTask[]> => {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    weekday: MOCK_MY_ROUTINE_WEEKDAY,
    weekend: MOCK_MY_ROUTINE_WEEKEND,
  };
};

/** デモモード用: localStorage にルーティンを保存 */
const saveDemoRoutines = (routines: Record<ScheduleType, RoutineTask[]>) => {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(routines));
};

export const useRoutine = (session: Session | null) => {
  const [scheduleType, setScheduleType] = useState<ScheduleType>(getTodayScheduleType());
  const [routines, setRoutines] = useState<Record<ScheduleType, RoutineTask[]>>(() => {
    if (IS_DEMO) return loadDemoRoutines();
    return { weekday: [], weekend: [] };
  });
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);

  const myRoutine = routines[scheduleType];

  /** スケジュールタイプを切り替え */
  const toggleScheduleType = useCallback(() => {
    setScheduleType((prev) => (prev === 'weekday' ? 'weekend' : 'weekday'));
  }, []);

  /** DB からルーティンテンプレートを取得 */
  const fetchRoutineTemplates = useCallback(async (userId: string) => {
    if (IS_DEMO) return;
    setLoadingRoutine(true);
    setRoutineError(null);
    try {
      const { data, error } = await supabase
        .from('routine_templates')
        .select('*')
        .eq('user_id', userId)
        .order('start_time');
      if (error) throw error;

      const weekday: RoutineTask[] = [];
      const weekend: RoutineTask[] = [];

      if (data) {
        for (const row of data) {
          const task: RoutineTask = {
            id: row.id,
            time: row.start_time,
            endTime: row.end_time,
            title: row.title,
            thought: row.thought,
            type: row.type,
          };
          if (row.schedule_type === 'weekend') {
            weekend.push(task);
          } else {
            weekday.push(task);
          }
        }
      }

      setRoutines({ weekday, weekend });
    } catch {
      setRoutineError('ルーティンの読み込みに失敗しました。通信環境をご確認ください。');
    } finally {
      setLoadingRoutine(false);
    }
  }, []);

  /** ログイン時にルーティンを同期 */
  useEffect(() => {
    if (IS_DEMO) return;
    const userId = session?.user.id;
    if (userId) {
      fetchRoutineTemplates(userId);
    } else {
      setRoutines({ weekday: [], weekend: [] });
    }
  }, [session?.user.id, fetchRoutineTemplates]);

  /** タスク追加 */
  const handleAddTask = useCallback(
    async (task: RoutineTask) => {
      // デモモード
      if (IS_DEMO) {
        setRoutines((prev) => {
          const updated = {
            ...prev,
            [scheduleType]: [...prev[scheduleType], { ...task, id: `demo-${Date.now()}` }]
              .sort((a, b) => a.time.localeCompare(b.time)),
          };
          saveDemoRoutines(updated);
          return updated;
        });
        return;
      }

      if (!session?.user.id) return;
      const userId = session.user.id;

      // 楽観的更新
      setRoutines((prev) => ({
        ...prev,
        [scheduleType]: [...prev[scheduleType], { ...task, id: 'temp' }]
          .sort((a, b) => a.time.localeCompare(b.time)),
      }));

      const { error } = await supabase.from('routine_templates').insert({
        user_id: userId,
        schedule_type: scheduleType,
        title: task.title,
        thought: task.thought,
        type: task.type,
        start_time: task.time,
        end_time: task.endTime,
      });

      if (error) {
        setRoutineError('タスクの保存に失敗しました。再度お試しください。');
        setRoutines((prev) => ({
          ...prev,
          [scheduleType]: prev[scheduleType].filter((t) => t.id !== 'temp'),
        }));
        return;
      }

      fetchRoutineTemplates(userId);
    },
    [session?.user.id, scheduleType, fetchRoutineTemplates]
  );

  /** タスク削除 */
  const handleDeleteTask = useCallback(
    async (taskId: string | number) => {
      // デモモード
      if (IS_DEMO) {
        setRoutines((prev) => {
          const updated = {
            ...prev,
            [scheduleType]: prev[scheduleType].filter((t) => t.id !== taskId),
          };
          saveDemoRoutines(updated);
          return updated;
        });
        return;
      }

      setRoutines((prev) => ({
        ...prev,
        [scheduleType]: prev[scheduleType].filter((t) => t.id !== taskId),
      }));

      if (taskId !== 'temp') {
        const { error } = await supabase.from('routine_templates').delete().eq('id', taskId);
        if (error) {
          setRoutineError('タスクの削除に失敗しました。再度お試しください。');
        }
      }
    },
    [scheduleType]
  );

  /** テンプレートからコピー */
  const copyTaskFromTemplate = useCallback(
    (task: RoutineTask) => {
      if (!myRoutine.find((r) => r.time === task.time && r.title === task.title)) {
        handleAddTask(task);
      }
    },
    [myRoutine, handleAddTask]
  );

  /** コピーしたタスクを削除 */
  const removeCopiedTask = useCallback(
    (task: RoutineTask) => {
      const found = myRoutine.find((r) => r.time === task.time && r.title === task.title);
      if (found?.id !== undefined) handleDeleteTask(found.id);
    },
    [myRoutine, handleDeleteTask]
  );

  return {
    myRoutine,
    routineWeekday: routines.weekday,
    routineWeekend: routines.weekend,
    loadingRoutine,
    routineError,
    clearRoutineError: () => setRoutineError(null),
    scheduleType,
    toggleScheduleType,
    setScheduleType,
    handleAddTask,
    handleDeleteTask,
    copyTaskFromTemplate,
    removeCopiedTask,
  };
};
