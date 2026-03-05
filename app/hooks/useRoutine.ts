"use client";

import { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { RoutineTask } from '../lib/types';
import { formatDate } from '../lib/utils';

export const useRoutine = (session: Session | null) => {
  const [myRoutine, setMyRoutine] = useState<RoutineTask[]>([]);
  const [loadingRoutine, setLoadingRoutine] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date());

  const fetchUserRoutine = useCallback(async (userId: string, date: Date) => {
    setLoadingRoutine(true);
    const { data } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('target_date', formatDate(date).iso)
      .order('start_time');
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
    setLoadingRoutine(false);
  }, []);

  // セッションのユーザーIDが変化した時のみルーティンを同期
  // session オブジェクト自体は onAuthStateChange 毎に参照が変わるため
  // user.id（文字列）を依存配列にして不要な重複フェッチを防ぐ
  useEffect(() => {
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
      await supabase.from('user_tasks').insert(newTask);
      fetchUserRoutine(userId, targetDate);
    },
    [session?.user.id, targetDate, fetchUserRoutine]
  );

  const handleDeleteTask = useCallback(async (taskId: string | number) => {
    setMyRoutine((prev) => prev.filter((t) => t.id !== taskId));
    if (taskId !== 'temp') {
      await supabase.from('user_tasks').delete().eq('id', taskId);
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
    targetDate,
    fetchUserRoutine,
    shiftDate,
    handleAddTask,
    handleDeleteTask,
    copyTaskFromTemplate,
    removeCopiedTask,
  };
};
