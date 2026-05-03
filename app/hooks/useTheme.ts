"use client";

import { useState, useEffect, useCallback } from 'react';

export type AppTheme = 'classic' | 'vogue';

const STORAGE_KEY = 'lifeExplorer_theme';
const THEME_CLASSES: Record<AppTheme, string> = {
  classic: '',
  vogue: 'theme-vogue',
};

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>('classic');

  // 初期化: localStorage から復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
      if (saved && saved in THEME_CLASSES) {
        setTheme(saved);
        applyThemeClass(saved);
      }
    } catch {}
  }, []);

  const switchTheme = useCallback((next: AppTheme) => {
    setTheme(next);
    applyThemeClass(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }, []);

  return { theme, switchTheme };
}

function applyThemeClass(theme: AppTheme) {
  const html = document.documentElement;
  // 既存のテーマクラスをすべて除去
  Object.values(THEME_CLASSES).forEach((cls) => {
    if (cls) html.classList.remove(cls);
  });
  // 新しいテーマクラスを適用
  const cls = THEME_CLASSES[theme];
  if (cls) html.classList.add(cls);
}
