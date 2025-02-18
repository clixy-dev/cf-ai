'use client';

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { 
  Sparkles, 
  Target, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface BusinessIdeasManagerProps {
  user: User;
}

interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'analyzing' | 'analyzed';
  createdAt: Date;
  analysis?: {
    marketSize?: string;
    competition?: string;
    feasibility?: string;
    risks?: string[];
    opportunities?: string[];
    score: number;
  };
}

export function BusinessIdeasManager({ user }: BusinessIdeasManagerProps) {
  const { t } = useTranslations();
  const [ideas, setIdeas] = useState<BusinessIdea[]>([
    {
      id: '1',
      title: 'AI-Powered Personal Shopping Assistant',
      description: 'A mobile app that uses AI to provide personalized shopping recommendations based on user preferences and behavior.',
      status: 'analyzed',
      createdAt: new Date(),
      analysis: {
        marketSize: '$50B by 2025',
        competition: 'Medium - Several established players but room for innovation',
        feasibility: 'High - Technology is readily available',
        risks: [
          'Data privacy concerns',
          'High customer acquisition costs',
          'Dependency on retail partnerships'
        ],
        opportunities: [
          'Growing e-commerce market',
          'Increasing demand for personalization',
          'Potential for subscription model'
        ],
        score: 85
      }
    }
  ]);
  const [newIdea, setNewIdea] = useState({ title: '', description: '' });

  const handleSubmit = () => {
    if (!newIdea.title || !newIdea.description) return;

    const idea: BusinessIdea = {
      id: Date.now().toString(),
      title: newIdea.title,
      description: newIdea.description,
      status: 'analyzing',
      createdAt: new Date()
    };

    setIdeas(prev => [idea, ...prev]);
    setNewIdea({ title: '', description: '' });

    // TODO: Implement actual analysis
    setTimeout(() => {
      setIdeas(prev => prev.map(i => {
        if (i.id === idea.id) {
          return {
            ...i,
            status: 'analyzed',
            analysis: {
              marketSize: 'Mock market size',
              competition: 'Mock competition analysis',
              feasibility: 'Mock feasibility',
              risks: ['Mock risk 1', 'Mock risk 2'],
              opportunities: ['Mock opportunity 1', 'Mock opportunity 2'],
              score: 75
            }
          };
        }
        return i;
      }));
    }, 2000);
  };

  const renderAnalysis = (idea: BusinessIdea) => {
    if (!idea.analysis) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t('ai_cofounder.business_ideas.market_size')}
          </h4>
          <p className="text-sm text-muted-foreground">{idea.analysis.marketSize}</p>
        </Card>
        
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('ai_cofounder.business_ideas.competition')}
          </h4>
          <p className="text-sm text-muted-foreground">{idea.analysis.competition}</p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('ai_cofounder.business_ideas.opportunities')}
          </h4>
          <ul className="space-y-1">
            {idea.analysis.opportunities?.map((opp, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {opp}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t('ai_cofounder.business_ideas.risks')}
          </h4>
          <ul className="space-y-1">
            {idea.analysis.risks?.map((risk, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {risk}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-medium">
            {t('ai_cofounder.business_ideas.new_idea')}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder={t('ai_cofounder.business_ideas.title_placeholder')}
              value={newIdea.title}
              onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <Textarea
              placeholder={t('ai_cofounder.business_ideas.description_placeholder')}
              value={newIdea.description}
              onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!newIdea.title || !newIdea.description}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('ai_cofounder.business_ideas.analyze')}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              {t('ai_cofounder.business_ideas.tabs.all')}
            </TabsTrigger>
            <TabsTrigger value="analyzing">
              {t('ai_cofounder.business_ideas.tabs.analyzing')}
            </TabsTrigger>
            <TabsTrigger value="analyzed">
              {t('ai_cofounder.business_ideas.tabs.analyzed')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            <AnimatePresence initial={false}>
              {ideas.map((idea) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{idea.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {idea.description}
                        </p>
                      </div>
                      {idea.analysis && (
                        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <span className="text-sm font-medium">
                            {idea.analysis.score}/100
                          </span>
                        </div>
                      )}
                    </div>
                    {renderAnalysis(idea)}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="analyzing">
            {/* Similar to "all" but filtered */}
          </TabsContent>

          <TabsContent value="analyzed">
            {/* Similar to "all" but filtered */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 