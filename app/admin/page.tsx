import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminAuthForm from '@/components/admin/AdminAuthForm';
import React from 'react';

export default async function AdminLogin() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/admin/dashboard');
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
      style={{ backgroundImage: 'url(/bg.png)' }}
    >
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-[32px] p-8">
        <AdminAuthForm />
      </div>
    </div>
  );
} 