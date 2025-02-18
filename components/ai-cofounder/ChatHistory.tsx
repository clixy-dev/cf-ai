'use client';

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { 
  MessageSquare, 
  Calendar, 
  Search, 
  Download,
  Tag,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatHistoryProps {
  user: User;
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: Date;
  tags: string[];
  messageCount: number;
}

export function ChatHistory({ user }: ChatHistoryProps) {
  const { t } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Business Model Discussion',
      preview: 'We discussed various revenue models and market entry strategies...',
      date: new Date(),
      tags: ['Strategy', 'Revenue'],
      messageCount: 24
    },
    {
      id: '2',
      title: 'Marketing Plan Review',
      preview: 'Analyzed different marketing channels and target audience segments...',
      date: new Date(Date.now() - 86400000), // yesterday
      tags: ['Marketing', 'Growth'],
      messageCount: 18
    }
  ]);

  const tags = Array.from(new Set(sessions.flatMap(s => s.tags)));
  
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || session.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('ai_cofounder.history.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('ai_cofounder.history.yesterday');
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 space-y-4">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pl-10"
              placeholder={t('ai_cofounder.history.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('ai_cofounder.history.select_tag')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('ai_cofounder.history.all_tags')}
              </SelectItem>
              {tags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {filteredSessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <h3 className="font-medium">{session.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {session.preview}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {session.messageCount}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-1">
                      {session.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      {t('ai_cofounder.history.export')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 