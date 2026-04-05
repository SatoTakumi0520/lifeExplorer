import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Vercel Cron calls this every hour on the hour (see vercel.json)
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const nowUTC = new Date();
  const hourUTC = nowUTC.getUTCHours();

  // Fetch subscriptions whose reminder_hour matches current UTC hour and are enabled
  // (Client-side converts local time → UTC before saving, or we store UTC hour)
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('reminder_hour', hourUTC)
    .eq('enabled', true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 });

  const payload = JSON.stringify({
    title: '🌱 Life Explorer',
    body: 'おはようございます！今日のルーティンを始めましょう。',
    url: '/',
  });

  const results = await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload),
    ),
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return NextResponse.json({ sent, failed });
}
