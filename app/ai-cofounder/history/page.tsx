import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUser } from '@/utils/supabase/queries';
import { ChatHistory } from '@/components/ai-cofounder/ChatHistory';

export default async function ChatHistoryPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  
  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="h-screen">
      <DashboardLayout user={user}>
        <ChatHistory user={user} />
      </DashboardLayout>
    </div>
  );
} 