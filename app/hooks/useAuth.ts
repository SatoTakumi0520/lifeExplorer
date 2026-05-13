"use client";

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * Supabase のセッションのうち「メール認証が完了していないもの」を弾く。
 * 認証未完了のまま漏れ出たセッションは即座にバックグラウンドで signOut し、
 * useAuth から見ると null セッションとして扱う。
 *
 * これにより以下のすべての経路で「メール認証が済むまでアプリに入れない」
 * という仕様が保証される:
 *  - signUp 直後（Supabase 側で confirmation 無効時に session が返ってくる場合）
 *  - 既存セッションでのページ再読み込み
 *  - signInWithPassword のレスポンス
 *  - /auth/callback からのリダイレクト後
 */
function isVerified(s: Session | null): boolean {
  return !!s?.user?.email_confirmed_at;
}

/**
 * localStorage の session を信用しすぎず、サーバ側で JWT を検証する。
 * - JWT が偽造/失効していたら getUser はエラーを返すので、その場合は false。
 * - 返ってきた user に email_confirmed_at が無ければ未認証なので false。
 * これで「Confirm email OFF 時代の残骸セッション」「壊れたトークン」を弾ける。
 */
async function verifyOnServer(): Promise<boolean> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.email_confirmed_at) return false;
  return true;
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // 最初のセッション取得
    (async () => {
      const { data: { session: s } } = await supabase.auth.getSession();

      if (!s) {
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      if (!isVerified(s)) {
        await supabase.auth.signOut();
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      // localStorage の email_confirmed_at だけでなくサーバ側でも検証する。
      // 偽造 JWT や Confirm email OFF 時代の残骸セッションをここで弾く。
      const ok = await verifyOnServer();
      if (!ok) {
        await supabase.auth.signOut();
        if (!cancelled) {
          setSession(null);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setSession(s);
        setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      // PASSWORD_RECOVERY は確認状態に関係なく検出する
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
      // 未認証セッションは弾く（バックグラウンドで signOut してから null セット）
      if (s && !isVerified(s)) {
        void supabase.auth.signOut();
        setSession(null);
        return;
      }
      // 認証済みに見えるセッションでもサーバ側で再検証する（捏造 JWT 対策）。
      if (s) {
        void verifyOnServer().then((ok) => {
          if (!ok) {
            void supabase.auth.signOut();
            setSession(null);
          } else {
            setSession(s);
          }
        });
        return;
      }
      setSession(s);
    });

    // URL クエリ経由でのリカバリーフラグ検出
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('type') === 'recovery') {
        setIsRecovery(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { error: error.message };
    }
    setIsRecovery(false);
    return { error: null };
  };

  const clearRecovery = () => setIsRecovery(false);

  return { session, loading, signOut, isRecovery, updatePassword, clearRecovery };
};
