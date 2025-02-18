'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  Briefcase,
  Plus
} from "lucide-react";
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockBusinesses = [
  { id: '1', name: 'Startup Alpha' },
  { id: '2', name: 'Tech Ventures' },
  { id: '3', name: 'Green Energy Co' },
];

export function BusinessSwitcher() {
  const { t } = useTranslations();
  const [selectedBusiness, setSelectedBusiness] = useState(mockBusinesses[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 hover:bg-accent/50"
        >
          <Briefcase className="h-4 w-4" />
          <span className="truncate max-w-[160px]">
            {selectedBusiness.name}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {t('business.switcher.title')}
        </div>
        {mockBusinesses.map((business) => (
          <DropdownMenuItem
            key={business.id}
            onSelect={() => setSelectedBusiness(business)}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            <span className="truncate">{business.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 mt-2"
            onClick={() => console.log('Create new business')}
          >
            <Plus className="h-4 w-4" />
            {t('business.switcher.create_new')}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 