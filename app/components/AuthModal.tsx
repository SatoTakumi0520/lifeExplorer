"use client";

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthMode = 'signin' | 'signup' | 'reset';

type AuthModalProps = {
  onClose: () => void;
  onAuthSuccess: () => void;
  initialMode?: 'signin' | 'signup';
};

/** Supabase の英語エラーメッセージを日本語に変換 */
function toJapaneseError(msg: string): string {
  if (msg.includes('Invalid login credentials'))  return 'メールアドレスまたはパスワードが正しくありません。';
  if (msg.includes('Email not confirmed'))         return 'メールアドレスが確認されていません。確認メールをご確認ください。';
  if (msg.includes('User already registered'))     return 'このメールアドレスはすでに登録されています。';
  if (msg.includes('Password should be at least')) return 'パスワードは6文字以上で入力してください。';
  if (msg.includes('Unable to validate email'))    return 'メールアドレスの形式が正しくありません。';
  if (msg.includes('Email rate limit exceeded'))   return 'しばらく時間をおいてから再試行してください。';
  if (msg.includes('For security purposes'))       return 'セキュリティのため、しばらく時間をおいてから再試行してください。';
  return 'エラーが発生しました。もう一度お試しください。';
}

export const AuthModal = ({ onClose, onAuthSuccess, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (authError) {
        setError(toJapaneseError(authError.message));
      } else {
        setSignupDone(true);
      }
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(toJapaneseError(authError.message));
    } else {
      onAuthSuccess();
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    setLoading(false);
    if (resetError) {
      setError(toJapaneseError(resetError.message));
    } else {
      setResetDone(true);
    }
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

          {/* ─── サインアップ完了 ─── */}
          {signupDone ? (
            <div className="py-4 text-center">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">確認メールを送信しました</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                <strong>{email}</strong> に確認メールを送りました。<br />
                メール内のリンクをクリックしてアカウントを有効化してください。
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all"
              >
                閉じる
              </button>
            </div>
          ) : resetDone ? (
            /* ─── パスワードリセット完了 ─── */
            <div className="py-4 text-center">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">リセットメールを送信しました</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                <strong>{email}</strong> にパスワードリセット用のメールを送りました。<br />
                メール内のリンクからパスワードを再設定してください。
              </p>
              <button
                onClick={() => { setResetDone(false); setMode('signin'); }}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all"
              >
                ログイン画面に戻る
              </button>
            </div>
          ) : mode === 'reset' ? (
            /* ─── パスワードリセット入力 ─── */
            <>
              <button
                onClick={() => setMode('signin')}
                className="text-xs text-stone-400 mb-3 hover:text-stone-600 transition-colors flex items-center gap-1"
              >
                ← ログインに戻る
              </button>
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-1">パスワードをリセット</h3>
              <p className="text-stone-400 text-xs mb-6">登録済みのメールアドレスを入力してください</p>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">メールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all mt-2 disabled:opacity-50"
                >
                  {loading ? '送信中…' : 'リセットメールを送信'}
                </button>
              </form>
            </>
          ) : (
            /* ─── ログイン / アカウント作成 ─── */
            <>
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-1">
                {mode === 'signin' ? 'おかえりなさい' : 'Life Explorer をはじめよう'}
              </h3>
              <p className="text-stone-400 text-xs mb-6">
                {mode === 'signin' ? 'ルーティンを同期するにはログインしてください' : 'アカウントを作成してはじめましょう'}
              </p>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">メールアドレス</label>
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
                  <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">パスワード</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                    required
                    minLength={6}
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all mt-2 disabled:opacity-50"
                >
                  {loading ? '処理中…' : mode === 'signin' ? 'ログイン' : 'アカウント作成'}
                </button>
              </form>

              {mode === 'signin' && (
                <button
                  onClick={() => { setMode('reset'); setError(''); }}
                  className="w-full mt-3 py-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  パスワードをお忘れの方は{' '}
                  <span className="text-stone-600 underline underline-offset-2">リセット</span>
                </button>
              )}

              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                className="w-full mt-2 py-2 text-xs text-stone-400 hover:text-stone-700 transition-colors font-medium"
              >
                {mode === 'signin' ? 'アカウントをお持ちでない方は ' : 'すでにアカウントをお持ちの方は '}
                <span className="text-stone-700 font-bold underline underline-offset-2">
                  {mode === 'signin' ? 'アカウント作成' : 'ログイン'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
