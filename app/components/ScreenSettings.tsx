"use client";

import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, LogOut, X, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Screen, PersonaCategory, OnboardingPreferences } from '../lib/types';
import type { AIProvider, UserSettings } from '../hooks/useSettings';
import { PERSONA_CATEGORY_LABELS } from '../lib/mockData';
import { JAPAN_PREFECTURES } from '../lib/eventService';

type ScreenSettingsProps = {
  go: (screen: Screen) => void;
  session: Session | null;
  onSignOut: () => void;
  aiSettings?: UserSettings;
  aiSaving?: boolean;
  onSaveAISettings?: (updates: Partial<UserSettings>) => void;
  onboardingPrefs?: OnboardingPreferences;
  onSaveOnboarding?: (prefs: OnboardingPreferences) => void;
};

export const ScreenSettings = ({ go, session, onSignOut, aiSettings, aiSaving, onSaveAISettings, onboardingPrefs, onSaveOnboarding }: ScreenSettingsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showAISetup, setShowAISetup] = useState(false);
  const [morningReminder, setMorningReminder] = useState('07:00');
  const [darkMode, setDarkMode] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [profileName, setProfileName] = useState('My Garden');
  const [profileBio, setProfileBio] = useState('Life Explorer enthusiast');
  const [email] = useState(session?.user?.email || 'user@example.com');

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800 relative">
      <div className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => go('PROFILE')} className="flex items-center gap-1 text-stone-400 hover:text-stone-800 text-sm font-bold">
          <ChevronLeft size={18} /> 戻る
        </button>
        <h2 className="font-bold text-stone-800">設定</h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider mb-3">アカウント</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <button onClick={() => setShowEditProfile(true)} className="w-full p-4 flex items-center gap-4 border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl">🌱</div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-stone-800">{profileName}</h4>
                <p className="text-xs text-stone-400">プロフィールを編集</p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button onClick={() => setShowEditEmail(true)} className="w-full p-4 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <div className="text-left">
                <h4 className="font-bold text-sm text-stone-800">メールアドレス</h4>
                <p className="text-xs text-stone-400">{email}</p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <div className="p-4 flex items-center justify-between border-b border-stone-50">
              <div>
                <h4 className="font-bold text-sm text-stone-800">プロフィール公開</h4>
                <p className="text-xs text-stone-400">他のユーザーにルーティンを公開する</p>
              </div>
              <button
                onClick={() => setPublicProfile(!publicProfile)}
                className={`w-12 h-7 rounded-full transition-colors relative ${publicProfile ? 'bg-green-500' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${publicProfile ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <button
              onClick={onSignOut}
              className="w-full p-4 flex items-center gap-3 hover:bg-stone-50 transition-colors"
            >
              <LogOut size={16} className="text-stone-400" />
              <h4 className="font-bold text-sm text-stone-600">ログアウト</h4>
            </button>
          </div>
        </div>

        {/* ── 探索設定 ── */}
        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider mb-3">探索設定</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden p-4 space-y-4">
            {/* カテゴリ選択 */}
            <div>
              <h4 className="font-bold text-sm text-stone-800 mb-2">興味のあるカテゴリ</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PERSONA_CATEGORY_LABELS)
                  .filter(([key]) => key !== 'all' && key !== 'custom')
                  .map(([key, label]) => {
                    const isSelected = onboardingPrefs?.selectedCategories?.includes(key as PersonaCategory);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          if (!onboardingPrefs || !onSaveOnboarding) return;
                          const current = onboardingPrefs.selectedCategories ?? [];
                          const updated = isSelected
                            ? current.filter((c) => c !== key)
                            : [...current, key as PersonaCategory];
                          onSaveOnboarding({ ...onboardingPrefs, selectedCategories: updated });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-stone-800 text-white border-stone-800'
                            : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
              </div>
            </div>
            {/* 生活リズム */}
            <div>
              <h4 className="font-bold text-sm text-stone-800 mb-2">生活リズム</h4>
              <div className="flex gap-2">
                {([
                  { value: 'morning', label: '☀️ 朝型' },
                  { value: 'balanced', label: '⚖️ バランス型' },
                  { value: 'night', label: '🌙 夜型' },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      if (!onboardingPrefs || !onSaveOnboarding) return;
                      onSaveOnboarding({ ...onboardingPrefs, lifestyleRhythm: value });
                    }}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                      onboardingPrefs?.lifestyleRhythm === value
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* 都道府県 */}
            <div>
              <h4 className="font-bold text-sm text-stone-800 mb-1">お住まいの地域</h4>
              <p className="text-[11px] text-stone-400 mb-2">設定するとお近くのイベントが優先表示されます</p>
              <select
                value={onboardingPrefs?.prefecture ?? ''}
                onChange={(e) => {
                  if (!onboardingPrefs || !onSaveOnboarding) return;
                  onSaveOnboarding({ ...onboardingPrefs, prefecture: e.target.value || null });
                }}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-stone-400 transition-colors"
              >
                <option value="">未設定（全国のイベントを表示）</option>
                {JAPAN_PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── AI Settings ── */}
        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles size={12} className="text-orange-500" /> AI設定
          </h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            {/* Provider */}
            <div className="p-4 border-b border-stone-50">
              <h4 className="font-bold text-sm text-stone-800 mb-2">AIプロバイダー</h4>
              <div className="flex gap-2">
                {(['anthropic', 'openai'] as AIProvider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => onSaveAISettings?.({ ai_provider: p })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      aiSettings?.ai_provider === p
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {p === 'anthropic' ? 'Claude (Anthropic)' : 'OpenAI'}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <button
              onClick={() => setShowAISetup(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
              <div className="text-left">
                <h4 className="font-bold text-sm text-stone-800">APIキー</h4>
                <p className="text-xs text-stone-400">
                  {aiSettings?.ai_api_key_encrypted ? '✓ 設定済み' : '未設定 — タップして設定'}
                </p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
          </div>
          <p className="text-[10px] text-stone-300 mt-2 px-1">
            AIペルソナ生成にはAPIキーが必要です。キーはサーバー側で安全に管理されます。
          </p>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider mb-3">通知</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-stone-50">
              <div>
                <h4 className="font-bold text-sm text-stone-800">プッシュ通知</h4>
                <p className="text-xs text-stone-400">ルーティンのリマインダーを受け取る</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-500' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-800">朝のリマインダー</h4>
                <p className="text-xs text-stone-400">毎日のルーティン開始通知</p>
              </div>
              <input
                type="time"
                value={morningReminder}
                onChange={(e) => setMorningReminder(e.target.value)}
                className="text-sm font-mono text-green-700 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider mb-3">外観</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-800">ダークモード</h4>
                <p className="text-xs text-stone-400">ダークテーマを使用する</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-green-500' : 'bg-stone-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${darkMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider mb-3">データ</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <h4 className="font-bold text-sm text-stone-800">データをエクスポート</h4>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <h4 className="font-bold text-sm text-stone-800">全ルーティンを削除</h4>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-red-400 tracking-wider mb-3">危険な操作</h3>
          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
              <div>
                <h4 className="font-bold text-sm text-red-600">アカウントを削除</h4>
                <p className="text-xs text-red-400">アカウントとデータを完全に削除します</p>
              </div>
              <ChevronRight size={18} className="text-red-300" />
            </button>
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-stone-300">Life Explorer v1.0.0</p>
          <p className="text-xs text-stone-300 mt-1">丁寧につくりました</p>
        </div>
      </div>

      {showEditProfile && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">プロフィール編集</h3>
              <button onClick={() => setShowEditProfile(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl">🌱</div>
                <button className="text-xs text-green-700 font-bold">アバターを変更</button>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">表示名</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">自己紹介</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="あなたのことを教えてください..."
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm h-24 resize-none focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">タイムゾーン</label>
                <select className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors">
                  <option>Asia/Tokyo (GMT+9)</option>
                  <option>America/New_York (GMT-5)</option>
                  <option>Europe/London (GMT+0)</option>
                  <option>America/Los_Angeles (GMT-8)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowEditProfile(false)}
              className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors"
            >
              保存する
            </button>
          </div>
        </div>
      )}

      {showAISetup && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">APIキー設定</h3>
              <button onClick={() => setShowAISetup(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">
                  {aiSettings?.ai_provider === 'openai' ? 'OpenAI' : 'Anthropic'} APIキー
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={aiSettings?.ai_provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                    className="w-full p-3 pr-10 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm font-mono focus:outline-none focus:border-stone-400 transition-colors"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-bold mb-1">APIキーの取得方法</p>
                <p className="text-xs text-amber-600">
                  {aiSettings?.ai_provider === 'openai'
                    ? 'platform.openai.com → API Keys → Create new secret key'
                    : 'console.anthropic.com → API Keys → Create Key'}
                </p>
              </div>

              {aiSettings?.ai_api_key_encrypted && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <p className="text-xs text-green-700">✓ 現在APIキーが設定されています。新しいキーを入力すると上書きされます。</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (apiKeyInput.trim()) {
                  onSaveAISettings?.({ ai_api_key_encrypted: apiKeyInput.trim() });
                  setApiKeyInput('');
                }
                setShowAISetup(false);
              }}
              disabled={!apiKeyInput.trim() && !aiSettings?.ai_api_key_encrypted}
              className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {aiSaving ? '保存中...' : 'APIキーを保存'}
            </button>
          </div>
        </div>
      )}

      {showEditEmail && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">メールアドレス変更</h3>
              <button onClick={() => setShowEditEmail(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">現在のメールアドレス</label>
                <div className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500">{email}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">新しいメールアドレス</label>
                <input
                  type="email"
                  placeholder="新しいメールアドレスを入力"
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">パスワード確認</label>
                <input
                  type="password"
                  placeholder="パスワードを入力して確認"
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-xs text-orange-700">新しいアドレスに確認メールが送信されます。受信トレイを確認して変更を完了してください。</p>
              </div>
            </div>

            <button
              onClick={() => setShowEditEmail(false)}
              className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors"
            >
              メールアドレスを更新
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
