"use client";

import { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { RoutineTask } from '../lib/types';
import { formatDate } from '../lib/utils';
import { MOCK_MY_ROUTINE } from '../lib/mockData';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const useRoutine = (session: Session | null) => {
  const [myRoutine, setMyRoutine] = useState<RoutineTask[]>(IS_DEMO ? MOCK_MY_ROUTINE : []);
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [routineError, setRoutineError] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState(new Date());

  const fetchUserRoutine = useCallback(async (userId: string, date: Date) => {
    if (IS_DEMO) return; // デモモード中はSupabaseフェッチをスキップ
    setLoadingRoutine(true);
    setRoutineError(null);
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('target_date', formatDate(date).iso)
        .order('start_time');
      if (error) throw error;
      if (data) {
        setMyRoutine(
          data.map((task) => ({
            id: task.id,
            time: task.start_time,
            endTime: task.end_time,
            title: task.title,
            thought: task.thought,
            type: task.type,
          }))
        );
      }
    } catch {
      setRoutineError('ルーティンの読み込みに失敗しました。通信環境をご確認ください。');
    } finally {
      setLoadingRoutine(false);
    }
  }, []);

  // セッションのユーザーIDが変化した時のみルーティンを同期
  // session オブジェクト自体は onAuthStateChange 毎に参照が変わるため
  // user.id（文字列）を依存配列にして不要な重複フェッチを防ぐ
  useEffect(() => {
    if (IS_DEMO) return; // デモモード中はモックデータを維持
    const userId = session?.user.id;
    if (userId) {
      fetchUserRoutine(userId, targetDate);
    } else {
      setMyRoutine([]);
    }
    // targetDate は意図的に依存配列から除外（ログイン時のみ再取得）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  const shiftDate = useCallback(
    (days: number) => {
      const userId = session?.user.id;
      setTargetDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + days);
        if (userId) fetchUserRoutine(userId, newDate);
        return newDate;
      });
    },
    [session?.user.id, fetchUserRoutine]
  );

  const handleAddTask = useCallback(
    async (task: RoutineTask) => {
      if (IS_DEMO) {
        setMyRoutine((prev) =>
          [...prev, { ...task, id: `demo-${Date.now()}` }].sort((a, b) => a.time.localeCompare(b.time))
        );
        return;
      }
      if (!session?.user.id) return;
      const userId = session.user.id;
      const newTask = {
        user_id: userId,
        target_date: formatDate(targetDate).iso,
        title: task.title,
        thought: task.thought,
        type: task.type,
        start_time: task.time,
        end_time: task.endTime,
      };
      setMyRoutine((prev) =>
        [...prev, { ...task, id: 'temp' }].sort((a, b) => a.time.localeCompare(b.time))
      );
      const { error } = await supabase.from('user_tasks').insert(newTask);
      if (error) {
        setRoutineError('タスクの保存に失敗しました。再度お試しください。');
        setMyRoutine((prev) => prev.filter((t) => t.id !== 'temp'));
        return;
      }
      fetchUserRoutine(userId, targetDate);
    },
    [session?.user.id, targetDate, fetchUserRoutine]
  );

  const handleDeleteTask = useCallback(async (taskId: string | number) => {
    setMyRoutine((prev) => prev.filter((t) => t.id !== taskId));
    if (!IS_DEMO && taskId !== 'temp') {
      const { error } = await supabase.from('user_tasks').delete().eq('id', taskId);
      if (error) {
        setRoutineError('タスクの削除に失敗しました。再度お試しください。');
      }
    }
  }, []);

  const copyTaskFromTemplate = useCallback(
    (task: RoutineTask) => {
      if (!myRoutine.find((r) => r.time === task.time && r.title === task.title)) {
        handleAddTask(task);
      }
    },
    [myRoutine, handleAddTask]
  );

  const removeCopiedTask = useCallback(
    (task: RoutineTask) => {
      const found = myRoutine.find((r) => r.time === task.time && r.title === task.title);
      if (found?.id !== undefined) handleDeleteTask(found.id);
    },
    [myRoutine, handleDeleteTask]
  );

  return {
    myRoutine,
    loadingRoutine,
    routineError,
    clearRoutineError: () => setRoutineError(null),
    targetDate,
    fetchUserRoutine,
    shiftDate,
    handleAddTask,
    handleDeleteTask,
    copyTaskFromTemplate,
    removeCopiedTask,
  };
};
