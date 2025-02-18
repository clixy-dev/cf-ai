'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFontSize } from "@/utils/font-size-context";
import { Type } from "lucide-react";
import { useTranslations } from "@/utils/i18n/TranslationsContext";

export function FontSizeSwitcher() {
  const { fontSize, setFontSize } = useFontSize();
  const { t } = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Type className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => setFontSize('small')}
          className="flex items-center justify-between"
        >
          <span className={`text-sm ${fontSize === 'small' ? 'text-primary font-medium' : ''}`}>A</span>
          <span className="text-xs text-muted-foreground ml-2">14px</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setFontSize('medium')}
          className="flex items-center justify-between"
        >
          <span className={`text-base ${fontSize === 'medium' ? 'text-primary font-medium' : ''}`}>A</span>
          <span className="text-xs text-muted-foreground ml-2">16px</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setFontSize('large')}
          className="flex items-center justify-between"
        >
          <span className={`text-lg ${fontSize === 'large' ? 'text-primary font-medium' : ''}`}>A</span>
          <span className="text-xs text-muted-foreground ml-2">18px</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
