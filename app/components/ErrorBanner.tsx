"use client";

import React, { useEffect, useState } from 'react';

type Props = {
  message: string;
  onDismiss: () => void;
  autoDismissMs?: number;
};

export function ErrorBanner({ message, onDismiss, autoDismissMs = 6000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [message, onDismiss, autoDismissMs]);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pt-3">
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-lg">
        <span className="text-red-500 text-lg mt-0.5">⚠</span>
        <p className="flex-1 text-sm text-red-800 leading-snug">{message}</p>
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 text-lg leading-none mt-0.5"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useNetworkError() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  return offline;
}
