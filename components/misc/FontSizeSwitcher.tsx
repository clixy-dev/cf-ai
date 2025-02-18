'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFontSize } from '@/utils/font-size-context';
import { TextIcon } from '@radix-ui/react-icons';

export function FontSizeSwitcher() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Change font size"
        >
          <TextIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setFontSize('small')}
        >
          <span className="text-sm">Small</span>
          {fontSize === 'small' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setFontSize('medium')}
        >
          <span className="text-base">Medium</span>
          {fontSize === 'medium' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => setFontSize('large')}
        >
          <span className="text-lg">Large</span>
          {fontSize === 'large' && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 