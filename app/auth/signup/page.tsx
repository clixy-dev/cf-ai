import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/misc/AuthForm';
import React from 'react';

export default async function SignUp() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/');
  }

  return (
    <AuthForm state="signup" />
  );
} 