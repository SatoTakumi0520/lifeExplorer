"use client";

import React, { useEffect, useState } from 'react';
import { AddTaskModal } from './components/AddTaskModal';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { ErrorBanner, useNetworkError } from './components/ErrorBanner';
import { ScreenBorrow } from './components/ScreenBorrow';
import { ScreenEdit } from './components/ScreenEdit';
import { ScreenProfile } from './components/ScreenProfile';
import { ScreenSettings } from './components/ScreenSettings';
import { ScreenExplore } from './components/ScreenExplore';
import { ScreenTimeline } from './components/ScreenTimeline';
import { ScreenTop } from './components/ScreenTop';
import { TimelineSkeleton, ExploreSkeleton, ProfileSkeleton } from './components/SkeletonLoaders';
import { TaskDetailModal } from './components/TaskDetailModal';
import { useAuth } from './hooks/useAuth';
import { usePublicData } from './hooks/usePublicData';
import { useRoutine } from './hooks/useRoutine';
import { useSettings } from './hooks/useSettings';
import { useOnboarding } from './hooks/useOnboarding';
import { useDarkMode } from './hooks/useDarkMode';
import { useBorrowHistory } from './hooks/useBorrowHistory';
import { useActivityStreak } from './hooks/useActivityStreak';
import { usePublicRoutines } from './hooks/usePublicRoutines';
import { useComments } from './hooks/useComments';
import { useFollows } from './hooks/useFollows';
import { ScreenOnboarding } from './components/ScreenOnboarding';
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
    routineError,
    clearRoutineError,
    targetDate,
    shiftDate,
    handleAddTask,
    handleDeleteTask,
    copyTaskFromTemplate,
    removeCopiedTask,
  } = useRoutine(session);
  const isOffline = useNetworkError();
  const { settings: aiSettings, saving: aiSaving, saveSettings: saveAISettings, hasApiKey } = useSettings(session);
  const { preferences: onboardingPrefs, isComplete: onboardingComplete, savePreferences: saveOnboarding, skipOnboarding, resetOnboarding, loading: onboardingLoading } = useOnboarding(session, loading);
  const { history: borrowHistory, recordBorrow } = useBorrowHistory();
  const { streak, last35Days, totalActiveDays } = useActivityStreak();
  useDarkMode(); // アプリ起動時にダークモード状態を復元
  const { publicRoutines, isPublished, publish: publishRoutine, unpublish: unpublishRoutine, toggleLike } = usePublicRoutines(session);
  const { commentsByRoutine, loadingRoutineId: loadingComments, postingRoutineId: postingComment, fetchComments, postComment, deleteComment } = useComments(session);
  const { isFollowing, toggleFollow } = useFollows(session);

  const go = (screen: Screen) => setCurrentScreen(screen);

  // ログイン済みユーザはTOP画面をスキップ
  // セッションが存在する場合のみ自動遷移（デモモードでも session or onboarding 完了が必要）
  // オンボーディング未完了 → ONBOARDING、完了済み → HOME
  const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  useEffect(() => {
    if (!loading && !onboardingLoading && currentScreen === 'TOP') {
      if (session) {
        // 本番: セッション有 → オンボーディング状態で分岐
        setCurrentScreen(onboardingComplete ? 'HOME' : 'ONBOARDING');
      } else if (IS_DEMO && onboardingComplete) {
        // デモモード: オンボーディング完了済みなら HOME へ
        setCurrentScreen('HOME');
      }
      // それ以外（未ログイン＆デモ未完了 or 非デモ）→ TOP に留まる
    }
  }, [session, loading, onboardingLoading, onboardingComplete, IS_DEMO]);

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
      {currentScreen === 'HOME' && (loadingRoutine ? <TimelineSkeleton /> : (
        <ScreenTimeline
          go={go}
          targetDate={targetDate}
          shiftDate={shiftDate}
          myRoutine={myRoutine}
          loadingRoutine={loadingRoutine}
          setSelectedTask={setSelectedTask}
        />
      ))}
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
      {currentScreen === 'ONBOARDING' && (
        <ScreenOnboarding
          onComplete={(prefs) => { saveOnboarding(prefs); go('HOME'); }}
          onSkip={() => { skipOnboarding(); go('HOME'); }}
        />
      )}
      {currentScreen === 'EXPLORE' && (personaTemplates.length === 0 ? <ExploreSkeleton /> : <ScreenExplore go={go} setSelectedUser={setSelectedUser} personaTemplates={personaTemplates} hasApiKey={hasApiKey} preferredCategories={onboardingPrefs.selectedCategories} lifestyleRhythm={onboardingPrefs.lifestyleRhythm} recordBorrow={recordBorrow} onAddEventToRoutine={handleAddTask} prefecture={onboardingPrefs.prefecture} publicRoutines={publicRoutines} onToggleLike={toggleLike} commentsByRoutine={commentsByRoutine} loadingComments={loadingComments} postingComment={postingComment} onFetchComments={fetchComments} onPostComment={postComment} onDeleteComment={deleteComment} currentUserId={session?.user?.id} isFollowing={isFollowing} onToggleFollow={toggleFollow} />)}
      {currentScreen === 'PROFILE' && <ScreenProfile go={go} myRoutine={myRoutine} session={session} borrowHistory={borrowHistory} streak={streak} last35Days={last35Days} totalActiveDays={totalActiveDays} isPublished={isPublished} onPublish={(title) => publishRoutine(myRoutine, session?.user?.email?.split('@')[0] ?? 'Explorer', title)} onUnpublish={unpublishRoutine} />}
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
          onboardingPrefs={onboardingPrefs}
          onSaveOnboarding={saveOnboarding}
          onResetOnboarding={async () => { await resetOnboarding(); go('ONBOARDING'); }}
        />
      )}

      {currentScreen !== 'TOP' && currentScreen !== 'ONBOARDING' && <BottomNav go={go} currentScreen={currentScreen} />}
      {isOffline && (
        <ErrorBanner
          message="オフラインです。インターネット接続を確認してください。"
          onDismiss={() => {}}
          autoDismissMs={999999}
        />
      )}
      {!isOffline && routineError && (
        <ErrorBanner message={routineError} onDismiss={clearRoutineError} />
      )}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            // TOP画面に戻し、useEffectでonboarding状態に応じてルーティング
            setCurrentScreen('TOP');
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
