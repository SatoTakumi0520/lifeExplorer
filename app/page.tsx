"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AddTaskModal } from './components/AddTaskModal';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { ScreenBorrow } from './components/ScreenBorrow';
import { ScreenEdit } from './components/ScreenEdit';
import { ScreenProfile } from './components/ScreenProfile';
import { ScreenSettings } from './components/ScreenSettings';
import { ScreenSocial } from './components/ScreenSocial';
import { ScreenTimeline } from './components/ScreenTimeline';
import { ScreenTop } from './components/ScreenTop';
import { TaskDetailModal } from './components/TaskDetailModal';
import { INITIAL_TEMPLATES } from './lib/mockData';
import { RoutineTask, Screen, SocialPost } from './lib/types';
import { formatDate } from './lib/utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('TOP');
  const [targetDate, setTargetDate] = useState(new Date());
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const [personaTemplates, setPersonaTemplates] = useState(INITIAL_TEMPLATES);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>([]);
  const [myRoutine, setMyRoutine] = useState<RoutineTask[]>([]);
  const [loadingRoutine, setLoadingRoutine] = useState(false);

  const [selectedUser, setSelectedUser] = useState<SocialPost | null>(null);
  const [selectedTask, setSelectedTask] = useState<RoutineTask | null>(null);
  const [borrowingUser, setBorrowingUser] = useState<SocialPost | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession) fetchUserRoutine(currentSession.user.id, targetDate);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) fetchUserRoutine(nextSession.user.id, targetDate);
      else setMyRoutine([]);
    });
    fetchPublicData();
    return () => subscription.unsubscribe();
  }, []);

  const fetchPublicData = async () => {
    const { data: routines } = await supabase.from('routines').select(`*, routine_items(*)`);
    if (routines) {
      const format = (list: any[]) =>
        list.map((routine) => ({
          id: routine.id,
          name: routine.role_label,
          user: routine.role_label,
          title: routine.title,
          likes: routine.likes_count,
          avatar: '👤',
          color: routine.theme_color,
          routine: routine.routine_items
            .map((item: any) => ({
              time: item.start_time,
              endTime: item.end_time,
              title: item.title,
              thought: item.thought,
              type: item.type,
            }))
            .sort((a: any, b: any) => a.time.localeCompare(b.time)),
        }));
      const dbTemplates = format(routines.filter((routine) => routine.is_template));
      const dbFeed = format(routines.filter((routine) => !routine.is_template));
      if (dbTemplates.length > 0) setPersonaTemplates(dbTemplates);
      setSocialFeed(dbFeed);
    }
  };

  const fetchUserRoutine = async (userId: string, date: Date) => {
    setLoadingRoutine(true);
    const { data } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('target_date', formatDate(date).iso)
      .order('start_time');
    if (data)
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
    setLoadingRoutine(false);
  };

  const handleAddTask = async (task: RoutineTask) => {
    if (!session) return;
    const newTask = {
      user_id: session.user.id,
      target_date: formatDate(targetDate).iso,
      title: task.title,
      thought: task.thought,
      type: task.type,
      start_time: task.time,
      end_time: task.endTime,
    };
    setMyRoutine([...myRoutine, { ...task, id: 'temp' }].sort((a, b) => a.time.localeCompare(b.time)));
    setShowAddTask(false);
    await supabase.from('user_tasks').insert(newTask);
    fetchUserRoutine(session.user.id, targetDate);
  };

  const handleDeleteTask = async (index: number) => {
    const task = myRoutine[index];
    setMyRoutine(myRoutine.filter((_, i) => i !== index));
    if (task.id !== 'temp') await supabase.from('user_tasks').delete().eq('id', task.id);
  };

  const copyTaskFromTemplate = (task: RoutineTask) => {
    if (!myRoutine.find((routineTask) => routineTask.time === task.time && routineTask.title === task.title)) {
      handleAddTask(task);
    }
  };

  const removeCopiedTask = (task: RoutineTask) => {
    const idx = myRoutine.findIndex((routineTask) => routineTask.time === task.time && routineTask.title === task.title);
    if (idx !== -1) handleDeleteTask(idx);
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(targetDate);
    newDate.setDate(targetDate.getDate() + days);
    setTargetDate(newDate);
    if (session) fetchUserRoutine(session.user.id, newDate);
  };

  const go = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-[#FDFCF8] overflow-hidden relative font-sans antialiased shadow-2xl border-x border-stone-200">
      {currentScreen === 'TOP' && <ScreenTop go={go} session={session} setShowAuthModal={setShowAuthModal} />}
      {currentScreen === 'HOME' && (
        <ScreenTimeline
          go={go}
          targetDate={targetDate}
          shiftDate={shiftDate}
          myRoutine={myRoutine}
          loadingRoutine={loadingRoutine}
          setSelectedTask={setSelectedTask}
        />
      )}
      {currentScreen === 'OTHER_HOME' && (
        <ScreenTimeline
          go={go}
          targetDate={targetDate}
          shiftDate={shiftDate}
          myRoutine={myRoutine}
          isOther
          selectedUser={selectedUser}
          setBorrowingUser={setBorrowingUser}
          setSelectedTask={setSelectedTask}
        />
      )}
      {currentScreen === 'EDIT' && (
        <ScreenEdit
          go={go}
          myRoutine={myRoutine}
          personaTemplates={personaTemplates}
          copyTaskFromTemplate={copyTaskFromTemplate}
          removeCopiedTask={removeCopiedTask}
          deleteTaskFromRoutine={handleDeleteTask}
          setShowAddTask={setShowAddTask}
        />
      )}
      {currentScreen === 'SOCIAL' && <ScreenSocial go={go} setSelectedUser={setSelectedUser} socialFeed={socialFeed} />}
      {currentScreen === 'PROFILE' && <ScreenProfile go={go} />}
      {currentScreen === 'BORROW' && (
        <ScreenBorrow
          go={go}
          borrowingUser={borrowingUser}
          setBorrowingUser={setBorrowingUser}
          myRoutine={myRoutine}
          copyTaskFromTemplate={copyTaskFromTemplate}
          removeCopiedTask={removeCopiedTask}
        />
      )}
      {currentScreen === 'SETTINGS' && <ScreenSettings go={go} session={session} />}

      <BottomNav go={go} currentScreen={currentScreen} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={() => setShowAuthModal(false)} />}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={handleAddTask} />}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={() => {
            handleDeleteTask(myRoutine.indexOf(selectedTask));
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
