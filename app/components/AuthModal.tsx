"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthModalProps = {
  onClose: () => void;
  onAuthSuccess: () => void;
};

export const AuthModal = ({ onClose, onAuthSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
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
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
          {mode === 'signin' ? 'Welcome Back' : 'Join Life OS'}
        </h3>
        <p className="text-stone-400 text-xs mb-6">
          {mode === 'signin' ? 'Login to sync your routine' : 'Create an account to start'}
        </p>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full py-3 bg-stone-800 text-white rounded-xl font-bold">
            {mode === 'signin' ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="w-full mt-4 text-xs text-stone-400 hover:text-stone-600"
        >
          {mode === 'signin' ? 'No account? Sign up' : 'Have an account? Log in'}
        </button>
        <button onClick={onClose} className="w-full mt-2 text-xs text-stone-300">
          Close
        </button>
      </div>
    </div>
  );
};
