'use client';

import { Button } from '@/components/ui/button';
import { Menu, Layout, Smartphone, Tablet, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { ModeToggle } from '../landing/mode-toggle';
import { LanguageSelector } from './LangugeSelector';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { SidebarPosition } from './DashboardLayout';
import { ContentLayout } from './DashboardLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontSizeSwitcher } from "@/components/ui/font-size-switcher";
import { BusinessSwitcher } from '@/components/ai-cofounder/BusinessSwitcher';

interface NavbarProps {
  user: User | null;
  onMenuClick: () => void;
  sidebarPosition?: SidebarPosition;
  onPositionChange?: (position: SidebarPosition) => void;
  contentLayout?: ContentLayout;
  onContentLayoutChange?: (layout: ContentLayout) => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export function Navbar({ 
  user, 
  onMenuClick, 
  sidebarPosition,
  onPositionChange,
  contentLayout,
  onContentLayoutChange,
  isCollapsed,
  onCollapse
}: NavbarProps) {
  const renderCollapseButton = () => {
    if (sidebarPosition === 'top' || !onCollapse) return null;

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onCollapse}
        className="h-8 w-8"
      >
        {sidebarPosition === 'right' ? (
          isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        ) : (
          isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border/40">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Collapse button for left sidebar - only show if sidebarPosition is provided */}
          {sidebarPosition === 'left' && onCollapse && (
            <div className="hidden lg:block">
              {renderCollapseButton()}
            </div>
          )}

          {/* Logo - hide on mobile when menu is shown */}
          <div className="hidden sm:block">
            <Logo iconOnly={false} />
          </div>

          {/* Add near the logo section */}
          <div className="hidden md:flex items-center gap-4">
            <BusinessSwitcher />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Language selector - hide on mobile */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* Theme toggle - hide on smallest screens */}
          <div className="hidden xs:block">
            <ModeToggle />
          </div>

          {/* Content Layout selector - only show if contentLayout is provided */}
          {contentLayout && onContentLayoutChange && (
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {contentLayout === 'mobile' ? (
                      <Smartphone className="h-4 w-4" />
                    ) : contentLayout === 'tablet' ? (
                      <Tablet className="h-4 w-4" />
                    ) : (
                      <Monitor className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup 
                    value={contentLayout} 
                    onValueChange={(value) => onContentLayoutChange(value as ContentLayout)}
                  >
                    <DropdownMenuRadioItem value="full">
                      <Monitor className="h-4 w-4 mr-2" />
                      Full Width
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="tablet">
                      <Tablet className="h-4 w-4 mr-2" />
                      Tablet View
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="mobile">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile View
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Sidebar Position selector - only show if sidebarPosition is provided */}
          {sidebarPosition && onPositionChange && (
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Layout className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup 
                    value={sidebarPosition} 
                    onValueChange={(value) => onPositionChange(value as SidebarPosition)}
                  >
                    <DropdownMenuRadioItem value="top">
                      Top Navigation
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="left">
                      Left Sidebar
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">
                      Right Sidebar
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Font size switcher */}
          {/* <div className="hidden lg:block">
            <FontSizeSwitcher />
          </div> */}

          {/* Collapse button for right sidebar - only show if sidebarPosition is provided */}
          {sidebarPosition === 'right' && onCollapse && (
            <div className="hidden lg:block">
              {renderCollapseButton()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 