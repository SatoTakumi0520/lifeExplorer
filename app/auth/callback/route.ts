import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth callback route for Supabase PKCE flow.
 * Handles:
 *  - Email confirmation after signup
 *  - Password recovery link click
 *
 * Exchanges the code for a session, then redirects to the app root.
 * For password recovery, appends ?type=recovery so the client can show
 * the password update form.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type'); // 'recovery' | 'signup' | 'email_change' etc.

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // For password recovery, redirect with query param so client shows update form
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/?type=recovery`);
      }
      // For other flows (signup confirmation), redirect to root
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // If code exchange fails, redirect to root anyway
  return NextResponse.redirect(`${origin}/`);
}
