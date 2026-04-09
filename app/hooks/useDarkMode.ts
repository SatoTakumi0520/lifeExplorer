"use client";

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lifeExplorer_darkMode';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  return { darkMode, toggle };
}
