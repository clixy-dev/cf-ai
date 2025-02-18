import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Determine the type of callback from the code
    const isPasswordReset = code.includes('recovery');
    const message = isPasswordReset
      ? 'Password has been reset successfully. Please sign in with your new password.'
      : 'Email confirmed successfully. You can now sign in.';

    // Redirect to sign in with appropriate message
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?message=${encodeURIComponent(message)}`
    );
  }

  // If no code, redirect to sign in
  return NextResponse.redirect(`${requestUrl.origin}/auth/signin`);
} 