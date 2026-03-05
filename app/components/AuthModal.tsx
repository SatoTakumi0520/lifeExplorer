"use client";

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthModalProps = {
  onClose: () => void;
  onAuthSuccess: () => void;
  initialMode?: 'signin' | 'signup';
};

export const AuthModal = ({ onClose, onAuthSuccess, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: authError } =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (authError) setError(authError.message);
    else onAuthSuccess();
  };

  return (
    <div
      className="absolute inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#FDFCF8] w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* ドラッグハンドル */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        <div className="px-6 pb-10 pt-4">
          <h3 className="text-2xl font-serif font-bold text-stone-800 mb-1">
            {mode === 'signin' ? 'Welcome Back' : 'Join Life OS'}
          </h3>
          <p className="text-stone-400 text-xs mb-6">
            {mode === 'signin' ? 'Login to sync your routine' : 'Create an account to start'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all mt-2"
            >
              {mode === 'signin' ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full mt-4 py-2 text-xs text-stone-400 hover:text-stone-700 transition-colors font-medium"
          >
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <span className="text-stone-700 font-bold underline underline-offset-2">
              {mode === 'signin' ? 'Sign Up' : 'Log In'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
