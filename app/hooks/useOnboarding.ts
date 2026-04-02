"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { OnboardingPreferences, PersonaCategory } from '../lib/types';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const STORAGE_KEY = 'lifeExplorer_onboarding';

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  completed: false,
  selectedCategories: [],
  lifestyleRhythm: null,
  prefecture: null,
};

export function useOnboarding(session: Session | null) {
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load preferences
  useEffect(() => {
    const load = async () => {
      if (IS_DEMO) {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setPreferences(JSON.parse(stored));
        } catch { /* ignore parse errors */ }
        setLoading(false);
        return;
      }

      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_settings')
          .select('onboarding_completed, preferred_categories, lifestyle_rhythm')
          .eq('user_id', session.user.id)
          .single();

        if (data) {
          setPreferences({
            completed: data.onboarding_completed ?? false,
            selectedCategories: (data.preferred_categories ?? []) as PersonaCategory[],
            lifestyleRhythm: data.lifestyle_rhythm ?? null,
            prefecture: data.prefecture ?? null,
          });
        }
      } catch { /* no settings row yet */ }

      setLoading(false);
    };

    load();
  }, [session?.user?.id]);

  // Save preferences
  const savePreferences = useCallback(async (prefs: OnboardingPreferences) => {
    const completed = { ...prefs, completed: true };
    setPreferences(completed);

    if (IS_DEMO) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
      return;
    }

    if (!session?.user?.id) return;

    await supabase
      .from('user_settings')
      .upsert({
        user_id: session.user.id,
        onboarding_completed: true,
        preferred_categories: completed.selectedCategories,
        lifestyle_rhythm: completed.lifestyleRhythm,
        prefecture: completed.prefecture,
      }, { onConflict: 'user_id' });
  }, [session?.user?.id]);

  // Skip onboarding
  const skipOnboarding = useCallback(async () => {
    const skipped = { ...DEFAULT_PREFERENCES, completed: true };
    setPreferences(skipped);

    if (IS_DEMO) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skipped));
      return;
    }

    if (!session?.user?.id) return;

    await supabase
      .from('user_settings')
      .upsert({
        user_id: session.user.id,
        onboarding_completed: true,
        preferred_categories: [],
        lifestyle_rhythm: null,
      }, { onConflict: 'user_id' });
  }, [session?.user?.id]);

  // Reset for testing
  const resetOnboarding = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    if (IS_DEMO) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    preferences,
    loading,
    isComplete: preferences.completed,
    savePreferences,
    skipOnboarding,
    resetOnboarding,
  };
}
