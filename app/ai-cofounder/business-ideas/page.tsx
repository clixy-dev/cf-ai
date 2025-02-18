import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUser } from '@/utils/supabase/queries';
import { BusinessIdeasManager } from '@/components/ai-cofounder/BusinessIdeasManager';

export default async function BusinessIdeasPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="h-screen">
      <DashboardLayout user={user}>
        <BusinessIdeasManager user={user} />
      </DashboardLayout>
    </div>
  );
} 