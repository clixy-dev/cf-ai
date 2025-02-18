import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { verifyAdminUser } from '@/utils/auth-helpers';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin');
  }

  // Verify admin status
  const isAdmin = await verifyAdminUser(supabase, user.id);
  if (!isAdmin) {
    return redirect('/admin');
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
        <p className="text-muted-foreground">
          This is a protected admin area.
        </p>
      </div>
    </AdminLayout>
  );
} 