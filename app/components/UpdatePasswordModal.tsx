"use client";

import React, { useState } from 'react';

type UpdatePasswordModalProps = {
  onUpdate: (newPassword: string) => Promise<{ error: string | null }>;
  onClose: () => void;
};

/** Supabase の英語エラーメッセージを日本語に変換 */
function toJapaneseError(msg: string): string {
  if (msg.includes('Password should be at least')) return 'パスワードは6文字以上で入力してください。';
  if (msg.includes('same password'))               return '現在と同じパスワードは使用できません。新しいパスワードを入力してください。';
  if (msg.includes('session'))                     return 'セッションが無効です。もう一度リセットメールを送信してください。';
  return 'エラーが発生しました。もう一度お試しください。';
}

export const UpdatePasswordModal = ({ onUpdate, onClose }: UpdatePasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return;
    }

    setLoading(true);
    const { error: updateError } = await onUpdate(password);
    setLoading(false);

    if (updateError) {
      setError(toJapaneseError(updateError));
    } else {
      setDone(true);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
    >
      <div className="bg-[#FDFCF8] w-full max-w-sm mx-4 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-6 py-8">
          {done ? (
            <div className="text-center">
              <div className="text-3xl mb-3">🔑</div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">パスワードを更新しました</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                新しいパスワードでログインできるようになりました。
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all"
              >
                閉じる
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">新しいパスワードを設定</h3>
                <p className="text-stone-400 text-xs">6文字以上のパスワードを入力してください</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">新しいパスワード</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors"
                    required
                    minLength={6}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 tracking-wider mb-1.5 block">パスワードの確認</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? '更新中…' : 'パスワードを更新'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
