'use client';

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { Send, Upload, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface AIChatProps {
  user: User;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

function formatResponseText(text: string): string {
  // Remove excessive newlines while preserving paragraph breaks
  return text
    .replace(/\n{3,}/g, '\n\n') // Replace 3 or more newlines with 2
    .trim();
}

function ChatLoading() {
  const { t } = useTranslations();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-3 mb-4 ml-12"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Brain className="w-4 h-4 text-primary animate-pulse" />
      </div>
      <div className="flex-1 rounded-lg p-4 bg-muted/50 space-y-2">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
      </div>
    </motion.div>
  );
}

export function AIChat({ user }: AIChatProps) {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your Co-founder AI. I'm here to help you with your startup journey. What would you like to discuss?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId: user.id,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok || data.error) {
        const errorMessage = data.userMessage || "Sorry, I couldn't process your message at this time.";
        
        const errorAssistantMessage: ChatMessage = {
          id: Date.now().toString(),
          content: errorMessage,
          role: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorAssistantMessage]);
        
        if (response.status >= 500) {
          toast({
            title: "System Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
        return;
      }
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: formatResponseText(data.responseText),
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        toast({ title: "Timeout", description: "AI response took too long" });
      }
      console.error('Error sending message:', error);
      
      const errorMessage = "I'm having trouble connecting to the server. Please check your internet connection and try again.";
      
      const errorAssistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorAssistantMessage]);
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 space-y-4">
      <Card className="flex-1 flex flex-col p-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-start space-x-3 mb-4 ${
                  message.role === 'assistant' ? 'mr-12' : 'ml-12'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`flex-1 rounded-lg p-4 ${
                    message.role === 'assistant'
                      ? 'bg-muted whitespace-pre-wrap'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-50 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && <ChatLoading />}
        </ScrollArea>
        
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => {/* TODO: Implement file upload */}}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Input
            placeholder={t('ai_cofounder.chat.input_placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4 mr-2" />
            {t('ai_cofounder.chat.send')}
          </Button>
        </div>
      </Card>
    </div>
  );
} 