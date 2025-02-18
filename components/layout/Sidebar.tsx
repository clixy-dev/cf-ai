'use client'

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { User } from '@supabase/supabase-js';
import { 
  Users, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  FileText, 
  Clock, 
  ClipboardList, 
  Search, 
  MessageSquare, 
  Package, 
  Settings,
  ChevronDown,
  Brain,
  Upload,
  Briefcase,
  Sparkles,
  History,
  Bot
} from "lucide-react";
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarPosition } from './DashboardLayout';
import { useTenant } from '@/utils/tenant-context';

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: NavItem[];
}

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  position?: SidebarPosition;
  user?: User | null;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: "nav.dashboard",
    href: "/dashboard",
    icon: Clock
  },
  {
    title: "nav.ai_cofounder",
    href: "/ai-cofounder",
    icon: Brain,
    children: [
      {
        title: "nav.ai_cofounder.chat",
        href: "/ai-cofounder/chat",
        icon: MessageSquare
      },
      {
        title: "nav.ai_cofounder.documents",
        href: "/ai-cofounder/documents",
        icon: Upload
      },
      {
        title: "nav.ai_cofounder.business_ideas",
        href: "/ai-cofounder/business-ideas",
        icon: Sparkles
      },
      {
        title: "nav.ai_cofounder.history",
        href: "/ai-cofounder/history",
        icon: History
      },
      {
        title: "nav.ai_cofounder.financial_analysis",
        href: "/ai-cofounder/financial-analysis",
        icon: Briefcase
      },
    ]
  },
  {
    title: "nav.ai_settings",
    href: "/ai-settings",
    icon: Bot,
    children: [
      {
        title: "nav.ai_settings.personality",
        href: "/ai-settings/personality",
        icon: Brain
      },
      {
        title: "nav.ai_settings.preferences",
        href: "/ai-settings/preferences",
        icon: Settings
      }
    ]
  },
  {
    title: "nav.settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ 
  onClose, 
  isMobile, 
  position = 'top', 
  user,
  isCollapsed,
  onCollapse 
}: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslations();
  const router = useRouter();
  const { currentTenant } = useTenant();

  const renderNavItem = (item: NavItem) => {
    const isActive = item.href === pathname;
    const hasActiveChild = item.children?.some(child => child.href === pathname);
    const Icon = item.icon;

    if (position !== 'top' && isCollapsed) {
      if (item.children) {
        return (
          <DropdownMenu key={item.title}>
            <DropdownMenuTrigger asChild>
              <button
                className={`
                  flex items-center justify-center w-full p-2 rounded-md transition-colors
                  hover:bg-accent/50
                  ${hasActiveChild ? 'text-primary' : ''}
                `}
                title={t(item.title)}
                onClick={() => onCollapse?.()}
              >
                <Icon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        );
      }

      return (
        <Link
          key={item.href}
          href={item.href || '#'}
          className={`
            flex items-center justify-center p-2 rounded-md transition-colors
            hover:bg-accent/50
            ${isActive ? 'text-primary' : ''}
          `}
          title={t(item.title)}
        >
          <Icon className="h-4 w-4" />
        </Link>
      );
    }

    if (item.children) {
      return (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger asChild>
            <button
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap
                hover:bg-accent/50 w-full
                ${hasActiveChild ? 'text-primary' : ''}
                ${position === 'right' ? 'flex-row-reverse justify-start' : ''}
              `}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{t(item.title)}</span>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 opacity-50 ${position === 'right' ? 'mr-auto' : 'ml-auto'}`} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={position === 'right' ? 'start' : 'end'}
            side={position === 'top' ? 'bottom' : 'right'}
            className="w-56"
          >
            {item.children.map(child => (
              <DropdownMenuItem key={child.href} asChild>
                <Link
                  href={child.href || '#'}
                  className={`
                    flex items-center gap-2 w-full
                    ${child.href === pathname ? 'text-primary' : ''}
                    ${position === 'right' ? 'flex-row-reverse' : ''}
                  `}
                >
                  <child.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{t(child.title)}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href || '#'}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap
          hover:bg-accent/50 ${position === 'top' ? '' : 'w-full'}
          ${isActive ? 'text-primary' : ''}
          ${position === 'right' ? 'flex-row-reverse justify-start' : ''}
        `}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium">{t(item.title)}</span>
      </Link>
    );
  };

  const renderUserSection = () => {
    if (!user) return null;

    return (
      <div className={`
        flex flex-col gap-2
        ${position === 'top' ? 'ml-auto' : 'mt-auto w-full'}
      `}>
        <div 
          onClick={() => router.push('/account')}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
            hover:bg-accent/50 transition-colors
            ${position === 'right' ? 'flex-row-reverse' : ''}
          `}
        >
          <div className={`flex items-center gap-2 min-w-0 ${position === 'right' ? 'flex-row-reverse' : ''}`}>
            {user.user_metadata.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar"
                className="h-6 w-6 rounded-full"
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {user.email}
              </span>
              {currentTenant && (
                <span className="text-xs text-muted-foreground truncate">
                  {currentTenant.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`
      bg-background relative
      ${position === 'top' ? 'h-14' : 'h-screen'}
      ${position !== 'top' ? 'w-full' : ''}
    `}>
      <div className={`
        ${position === 'top' 
          ? 'flex items-center h-full px-4 justify-between'
          : 'flex flex-col h-full py-4'
        }
      `}>
        {isMobile && (
          <div className="flex items-center justify-between w-full px-4 mb-4">
            <Logo iconOnly={false} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {position === 'top' ? (
          <>
            <div className="flex items-center gap-4 overflow-x-auto min-w-0">
              {NAVIGATION_ITEMS.map(renderNavItem)}
            </div>
            {renderUserSection()}
          </>
        ) : (
          <div className={`flex flex-col w-full px-2 gap-1 flex-1 ${position === 'right' ? 'items-end' : ''}`}>
            <div className={`flex flex-col gap-1 ${isCollapsed ? 'items-center' : position === 'right' ? 'items-end' : ''}`}>
              {NAVIGATION_ITEMS.map(item => renderNavItem(item))}
            </div>
            {!isCollapsed && renderUserSection()}
          </div>
        )}
      </div>
    </div>
  );
}