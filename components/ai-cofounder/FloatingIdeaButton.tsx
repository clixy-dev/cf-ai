'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, X } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { BUSINESS_IDEAS } from './DashboardOverview';

export function FloatingIdeaButton() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [idea] = useState(() => 
    BUSINESS_IDEAS[Math.floor(Math.random() * BUSINESS_IDEAS.length)]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-lg z-50 animate-bounce"
        >
          <Lightbulb className="h-6 w-6" />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="rounded-xl p-6 w-[320px] bg-background border border-border shadow-xl will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade"
          side="top"
          align="end"
          sideOffset={16}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {t('ai_cofounder.dashboard.random_idea_title')}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">{idea.title}</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  {idea.description}
                </p>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
} 