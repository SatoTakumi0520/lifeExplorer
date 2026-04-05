import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId, subscription, reminderHour, reminderMinute } = await req.json();

    if (!userId || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        reminder_hour: reminderHour ?? 7,
        reminder_minute: reminderMinute ?? 0,
        enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,endpoint' },
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, endpoint } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const query = supabase.from('push_subscriptions').delete().eq('user_id', userId);
    if (endpoint) query.eq('endpoint', endpoint);
    const { error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
