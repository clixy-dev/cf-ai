import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUser } from '@/utils/supabase/queries';
import { AIPersonalitySettings } from '@/components/ai-settings/AIPersonalitySettings';

export default async function AIPersonalityPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="h-screen">
      <DashboardLayout user={user}>
        <AIPersonalitySettings user={user} />
      </DashboardLayout>
    </div>
  );
} 