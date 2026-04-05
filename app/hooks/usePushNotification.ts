"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return buffer;
}

export type NotificationSettings = {
  enabled: boolean;
  reminderHour: number;   // 0-23 (local time)
  reminderMinute: number; // 0 or 30
};

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderHour: 7,
  reminderMinute: 0,
};

export function usePushNotification(session: Session | null) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window);
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    // Load saved settings from localStorage
    try {
      const saved = localStorage.getItem('lifeExplorer_notifSettings');
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);

  // Register service worker once
  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, [supported]);

  const subscribe = useCallback(async (newSettings: NotificationSettings): Promise<boolean> => {
    if (!supported || !session?.user?.id) return false;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return false;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };

      // Convert local reminder time to UTC hour for server-side matching
      const localDate = new Date();
      localDate.setHours(newSettings.reminderHour, newSettings.reminderMinute, 0, 0);
      const utcHour = localDate.getUTCHours();

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          subscription: subJson,
          reminderHour: utcHour,
          reminderMinute: localDate.getUTCMinutes(),
        }),
      });

      const updated = { ...newSettings, enabled: true };
      setSettings(updated);
      localStorage.setItem('lifeExplorer_notifSettings', JSON.stringify(updated));
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [supported, session?.user?.id]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (supported) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          if (session?.user?.id) {
            await fetch('/api/push/subscribe', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: session.user.id, endpoint: sub.endpoint }),
            });
          }
        }
      }
      const updated = { ...settings, enabled: false };
      setSettings(updated);
      localStorage.setItem('lifeExplorer_notifSettings', JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  }, [supported, session?.user?.id, settings]);

  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!supported || permission !== 'granted') return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    const { endpoint, keys } = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        title: '🌱 Life Explorer',
        body: 'テスト通知です。おはようございます！',
      }),
    });
  }, [supported, permission]);

  return { supported, permission, settings, loading, subscribe, unsubscribe, sendTestNotification };
}
