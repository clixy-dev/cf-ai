'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import { Logo } from '../layout/Logo'
import { motion } from 'framer-motion'
import { useTranslations } from '@/utils/i18n/TranslationsContext';

// Update the component props to accept children
interface LoadingProps {
  children?: React.ReactNode;
}

export function Loading({ children }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
      <div className="flex flex-col items-center gap-4">
        <Logo iconOnly className="h-16 w-16 animate-pulse text-primary" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground/80 animate-pulse">
          Loading...
        </p>
      </div>
      
      {/* Optional: Add skeleton placeholders for different content areas */}
      <div className="space-y-4 w-full max-w-2xl mt-8">
        <Skeleton className="h-8 w-[200px] mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Existing content */}
      {children}
    </div>
  )
}

export function ChatLoadingIndicator() {
  const { t } = useTranslations();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center space-x-2 text-muted-foreground"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{t('ai_cofounder.chat.thinking')}</span>
    </motion.div>
  );
} 