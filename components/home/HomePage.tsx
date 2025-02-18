'use client'

import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { DashboardOverview as BasePage } from "@/components/ai-cofounder/DashboardOverview"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function HomePage({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState('base');

  return (
    <DashboardLayout user={user}>
      {activeTab === 'base' && <BasePage user={user} />}
    </DashboardLayout>
  );
} 