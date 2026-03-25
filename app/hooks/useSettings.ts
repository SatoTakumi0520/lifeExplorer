"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export type AIProvider = 'anthropic' | 'openai';

export type UserSettings = {
  ai_provider: AIProvider;
  ai_api_key_encrypted: string | null;
  ai_model: string;
  display_name: string | null;
  timezone: string;
};

const DEFAULT_SETTINGS: UserSettings = {
  ai_provider: 'anthropic',
  ai_api_key_encrypted: null,
  ai_model: 'claude-sonnet-4-20250514',
  display_name: null,
  timezone: 'Asia/Tokyo',
};

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const useSettings = (session: Session | null) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 設定を取得
  useEffect(() => {
    if (IS_DEMO || !session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      const { data } = await supabase
        .from('user_settings')
        .select('ai_provider, ai_api_key_encrypted, ai_model, display_name, timezone')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setSettings({
          ai_provider: data.ai_provider || 'anthropic',
          ai_api_key_encrypted: data.ai_api_key_encrypted,
          ai_model: data.ai_model || 'claude-sonnet-4-20250514',
          display_name: data.display_name,
          timezone: data.timezone || 'Asia/Tokyo',
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, [session?.user?.id]);

  // 設定を保存（upsert）
  const saveSettings = useCallback(async (updates: Partial<UserSettings>) => {
    if (IS_DEMO || !session?.user?.id) return;

    setSaving(true);
    const merged = { ...settings, ...updates };

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: session.user.id,
        ai_provider: merged.ai_provider,
        ai_api_key_encrypted: merged.ai_api_key_encrypted,
        ai_model: merged.ai_model,
        display_name: merged.display_name,
        timezone: merged.timezone,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (!error) {
      setSettings(merged);
    } else {
      console.error('Failed to save settings:', error);
    }
    setSaving(false);
  }, [session?.user?.id, settings]);

  // APIキーが設定済みかどうか
  const hasApiKey = Boolean(settings.ai_api_key_encrypted);

  return { settings, loading, saving, saveSettings, hasApiKey };
};
