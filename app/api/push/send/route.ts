import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { endpoint, p256dh, auth, title, body, url } = await req.json();

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Missing subscription fields' }, { status: 400 });
    }

    await webpush.sendNotification(
      { endpoint, keys: { p256dh, auth } },
      JSON.stringify({
        title: title ?? 'Life Explorer',
        body: body ?? 'おはようございます！今日のルーティンを確認しましょう。',
        url: url ?? '/',
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
