'use client';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { User } from '@supabase/supabase-js';
import { useState, Suspense, useEffect } from 'react';
import { useLocalStorage } from '@/utils/use-local-storage';
import { Loading } from '@/components/misc/Loading'

export type SidebarPosition = 'top' | 'left' | 'right';
export type ContentLayout = 'full' | 'tablet' | 'mobile';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Add this effect to set mounted state
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Modify the localStorage hooks to use fallback values until mounted
  const [sidebarPosition, setSidebarPosition] = useLocalStorage<SidebarPosition>(
    'sidebar-position',
    'top'
  );
  const [contentLayout, setContentLayout] = useLocalStorage<ContentLayout>(
    'content-layout',
    'full'
  );

  // Update the resize handlers to check for window existence
  useEffect(() => {
    if (!hasMounted) return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setContentLayout('mobile');
      } else if (width < 1024) {
        setContentLayout('tablet');
      } else {
        setContentLayout('full');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMounted]); // Add hasMounted as dependency

  // Similarly update the other resize handler
  useEffect(() => {
    if (!hasMounted) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMounted]); // Add hasMounted as dependency

  // Wrap the return in a check for mounted state
  if (!hasMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      {sidebarPosition === 'left' && (
        <aside className={`
          hidden lg:block border-r border-border/40
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
        `}>
          <Sidebar 
            position="left" 
            user={user}
            isCollapsed={sidebarCollapsed}
            onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </aside>
      )}

      <div className={`
        flex-1 flex flex-col min-h-0
        transition-all duration-300 ease-in-out
      `}>
        {/* Top Navbar */}
        <Navbar 
          user={user} 
          onMenuClick={() => setSidebarOpen(true)}
          onPositionChange={setSidebarPosition}
          sidebarPosition={sidebarPosition}
          contentLayout={contentLayout}
          onContentLayoutChange={setContentLayout}
          isCollapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Top Sidebar - Only show on large screens */}
        {sidebarPosition === 'top' && (
          <div className="hidden lg:block border-b border-border/40">
            <Sidebar position="top" user={user} />
          </div>
        )}

        {/* Mobile sidebar */}
        <div 
          className={`
            fixed inset-y-0 ${sidebarPosition === 'right' ? 'right-0' : 'left-0'} z-50 w-[280px]
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : sidebarPosition === 'right' ? 'translate-x-full' : '-translate-x-full'}
            lg:hidden bg-background
          `}
        >
          {/* Always use vertical layout for mobile sidebar */}
          <Sidebar 
            isMobile
            position={sidebarPosition === 'top' ? 'left' : sidebarPosition}
            user={user}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/30">
          <div className={`
            mx-auto px-4 py-4
            transition-all duration-300 ease-in-out
            ${contentLayout === 'mobile' ? 'max-w-sm' : 
              contentLayout === 'tablet' ? 'max-w-2xl' : 
              'w-full max-w-none'
            }
          `}>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      {sidebarPosition === 'right' && (
        <aside className={`
          hidden lg:block border-l border-border/40
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
        `}>
          <Sidebar 
            position="right" 
            user={user}
            isCollapsed={sidebarCollapsed}
            onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </aside>
      )}
    </div>
  );
}