"use client";

import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, LogOut, X, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Screen } from '../lib/types';
import type { AIProvider, UserSettings } from '../hooks/useSettings';

type ScreenSettingsProps = {
  go: (screen: Screen) => void;
  session: Session | null;
  onSignOut: () => void;
  aiSettings?: UserSettings;
  aiSaving?: boolean;
  onSaveAISettings?: (updates: Partial<UserSettings>) => void;
};

export const ScreenSettings = ({ go, session, onSignOut, aiSettings, aiSaving, onSaveAISettings }: ScreenSettingsProps) => {
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
          <ChevronLeft size={18} /> Back
        </button>
        <h2 className="font-bold text-stone-800">Settings</h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Account</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <button onClick={() => setShowEditProfile(true)} className="w-full p-4 flex items-center gap-4 border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl">🌱</div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-stone-800">{profileName}</h4>
                <p className="text-xs text-stone-400">Edit profile</p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button onClick={() => setShowEditEmail(true)} className="w-full p-4 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <div className="text-left">
                <h4 className="font-bold text-sm text-stone-800">Email</h4>
                <p className="text-xs text-stone-400">{email}</p>
              </div>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <div className="p-4 flex items-center justify-between border-b border-stone-50">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Public Profile</h4>
                <p className="text-xs text-stone-400">Allow others to see your routine</p>
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
              <h4 className="font-bold text-sm text-stone-600">Sign Out</h4>
            </button>
          </div>
        </div>

        {/* ── AI Settings ── */}
        <div className="p-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles size={12} className="text-orange-500" /> AI Settings
          </h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            {/* Provider */}
            <div className="p-4 border-b border-stone-50">
              <h4 className="font-bold text-sm text-stone-800 mb-2">AI Provider</h4>
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
                <h4 className="font-bold text-sm text-stone-800">API Key</h4>
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
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Notifications</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-stone-50">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Push Notifications</h4>
                <p className="text-xs text-stone-400">Receive reminders for your routine</p>
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
                <h4 className="font-bold text-sm text-stone-800">Morning Reminder</h4>
                <p className="text-xs text-stone-400">Daily reminder to start your routine</p>
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
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Appearance</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Dark Mode</h4>
                <p className="text-xs text-stone-400">Use dark theme</p>
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
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Data</h3>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <h4 className="font-bold text-sm text-stone-800">Export My Data</h4>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <h4 className="font-bold text-sm text-stone-800">Clear All Routines</h4>
              <ChevronRight size={18} className="text-stone-300" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Danger Zone</h3>
          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
              <div>
                <h4 className="font-bold text-sm text-red-600">Delete Account</h4>
                <p className="text-xs text-red-400">Permanently delete your account and data</p>
              </div>
              <ChevronRight size={18} className="text-red-300" />
            </button>
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-stone-300">Life Explorer v1.0.0</p>
          <p className="text-xs text-stone-300 mt-1">Made with care</p>
        </div>
      </div>

      {showEditProfile && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl">🌱</div>
                <button className="text-xs text-green-700 font-bold">Change Avatar</button>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Bio</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm h-24 resize-none focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Timezone</label>
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
              Save Profile
            </button>
          </div>
        </div>
      )}

      {showAISetup && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">API Key Setup</h3>
              <button onClick={() => setShowAISetup(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">
                  {aiSettings?.ai_provider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key
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
              {aiSaving ? 'Saving...' : 'Save API Key'}
            </button>
          </div>
        </div>
      )}

      {showEditEmail && (
        <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-[#FDFCF8] w-full rounded-t-3xl border-t border-stone-100 shadow-2xl p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-800">Change Email</h3>
              <button onClick={() => setShowEditEmail(false)} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Current Email</label>
                <div className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-500">{email}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">New Email</label>
                <input
                  type="email"
                  placeholder="Enter new email address"
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <p className="text-xs text-orange-700">A verification email will be sent to your new address. Please check your inbox to complete the change.</p>
              </div>
            </div>

            <button
              onClick={() => setShowEditEmail(false)}
              className="w-full mt-6 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors"
            >
              Update Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
