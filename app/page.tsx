"use client";

import React, { useEffect, useState } from 'react';
import { AddTaskModal } from './components/AddTaskModal';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { ScreenBorrow } from './components/ScreenBorrow';
import { ScreenEdit } from './components/ScreenEdit';
import { ScreenProfile } from './components/ScreenProfile';
import { ScreenSettings } from './components/ScreenSettings';
import { ScreenExplore } from './components/ScreenExplore';
import { ScreenTimeline } from './components/ScreenTimeline';
import { ScreenTop } from './components/ScreenTop';
import { TaskDetailModal } from './components/TaskDetailModal';
import { useAuth } from './hooks/useAuth';
import { usePublicData } from './hooks/usePublicData';
import { useRoutine } from './hooks/useRoutine';
import { useSettings } from './hooks/useSettings';
import { Screen, SocialPost, RoutineTask } from './lib/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('TOP');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showAddTask, setShowAddTask] = useState(false);

  const [selectedUser, setSelectedUser] = useState<SocialPost | null>(null);
  const [selectedTask, setSelectedTask] = useState<RoutineTask | null>(null);
  const [borrowingUser, setBorrowingUser] = useState<SocialPost | null>(null);

  const { session, loading, signOut } = useAuth();
  const { personaTemplates, socialFeed } = usePublicData();
  const {
    myRoutine,
    loadingRoutine,
    targetDate,
    shiftDate,
    handleAddTask,
    handleDeleteTask,
    copyTaskFromTemplate,
    removeCopiedTask,
  } = useRoutine(session);
  const { settings: aiSettings, saving: aiSaving, saveSettings: saveAISettings } = useSettings(session);

  const go = (screen: Screen) => setCurrentScreen(screen);

  // ログイン済みユーザはTOP画面をスキップしてHOMEへ自動遷移
  // 開発環境では未ログインでもHOMEへ自動遷移（モックデータで動作確認可能）
  useEffect(() => {
    if (!loading && currentScreen === 'TOP') {
      if (session || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        setCurrentScreen('HOME');
      }
    }
  }, [session, loading]);

  // セッション確認中はスプラッシュ画面を表示
  if (loading) {
    return (
      <div className="h-[100dvh] w-full max-w-md mx-auto bg-[#FDFCF8] flex flex-col items-center justify-center shadow-2xl border-x border-stone-200">
        <div className="flex items-center gap-2 text-stone-500 mb-4">
          <div className="w-8 h-1 bg-stone-800" />
          <span className="font-bold tracking-widest text-xs uppercase">Life Explorer</span>
        </div>
        <p className="text-4xl font-serif font-bold text-stone-900">🌱</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-[#FDFCF8] overflow-hidden relative font-sans antialiased shadow-2xl border-x border-stone-200">
      {currentScreen === 'TOP' && (
        <ScreenTop
          onSignIn={() => { setAuthModalMode('signin'); setShowAuthModal(true); }}
          onSignUp={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}
        />
      )}
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
      {currentScreen === 'EXPLORE' && <ScreenExplore go={go} setSelectedUser={setSelectedUser} personaTemplates={personaTemplates} />}
      {currentScreen === 'PROFILE' && <ScreenProfile go={go} myRoutine={myRoutine} session={session} />}
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
      {currentScreen === 'SETTINGS' && (
        <ScreenSettings
          go={go}
          session={session}
          onSignOut={async () => { await signOut(); go('TOP'); }}
          aiSettings={aiSettings}
          aiSaving={aiSaving}
          onSaveAISettings={saveAISettings}
        />
      )}

      {currentScreen !== 'TOP' && <BottomNav go={go} currentScreen={currentScreen} />}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            go('HOME');
          }}
          initialMode={authModalMode}
        />
      )}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={(task) => {
            handleAddTask(task);
            setShowAddTask(false);
          }}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={() => {
            if (selectedTask.id !== undefined) handleDeleteTask(selectedTask.id);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
