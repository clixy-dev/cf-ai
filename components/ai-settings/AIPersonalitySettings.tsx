'use client';

import { User } from '@supabase/supabase-js';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Brain, MessageSquare, Sparkles, Target } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIPersonalitySettingsProps {
  user: User;
}

interface PersonalitySettings {
  aiName: string;
  communicationStyle: string;
  expertise: string[];
  tone: string;
  formality: number;
  creativity: number;
  detailLevel: number;
  customInstructions: string;
  useIndustryContext: boolean;
  useMarketContext: boolean;
  useCompanyContext: boolean;
}

export function AIPersonalitySettings({ user }: AIPersonalitySettingsProps) {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<PersonalitySettings>({
    aiName: 'FounderAI',
    communicationStyle: 'balanced',
    expertise: ['business', 'strategy'],
    tone: 'professional',
    formality: 70,
    creativity: 60,
    detailLevel: 80,
    customInstructions: '',
    useIndustryContext: true,
    useMarketContext: true,
    useCompanyContext: true
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: t('common.success'),
        description: t('ai_settings.personality.saved'),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: t('common.error'),
        description: t('ai_settings.personality.save_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('ai_settings.personality.title')}</h1>
        <p className="text-muted-foreground">
          {t('ai_settings.personality.subtitle')}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Communication Style */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.personality.communication_style')}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4">
              <Label>{t('ai_settings.personality.style')}</Label>
              <Select
                value={settings.communicationStyle}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, communicationStyle: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">
                    {t('ai_settings.personality.style_direct')}
                  </SelectItem>
                  <SelectItem value="balanced">
                    {t('ai_settings.personality.style_balanced')}
                  </SelectItem>
                  <SelectItem value="elaborate">
                    {t('ai_settings.personality.style_elaborate')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              <Label>{t('ai_settings.personality.tone')}</Label>
              <Select
                value={settings.tone}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, tone: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">
                    {t('ai_settings.personality.tone_professional')}
                  </SelectItem>
                  <SelectItem value="friendly">
                    {t('ai_settings.personality.tone_friendly')}
                  </SelectItem>
                  <SelectItem value="casual">
                    {t('ai_settings.personality.tone_casual')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* AI Name */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.personality.ai_name')}
            </h2>
          </div>
          <div className="space-y-4">
            <Input
              value={settings.aiName}
              onChange={(e) => setSettings(prev => ({ ...prev, aiName: e.target.value }))}
              placeholder={t('ai_settings.personality.ai_name_placeholder')}
            />
          </div>
        </Card>

        {/* Expertise and Focus */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.personality.expertise')}
            </h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label>{t('ai_settings.personality.formality')}</Label>
              <Slider
                value={[settings.formality]}
                onValueChange={([value]) => 
                  setSettings(prev => ({ ...prev, formality: value }))
                }
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <Label>{t('ai_settings.personality.creativity')}</Label>
              <Slider
                value={[settings.creativity]}
                onValueChange={([value]) => 
                  setSettings(prev => ({ ...prev, creativity: value }))
                }
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <Label>{t('ai_settings.personality.detail_level')}</Label>
              <Slider
                value={[settings.detailLevel]}
                onValueChange={([value]) => 
                  setSettings(prev => ({ ...prev, detailLevel: value }))
                }
                max={100}
                step={1}
              />
            </div>
          </div>
        </Card>

        {/* Context Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.personality.context_settings')}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>{t('ai_settings.personality.use_industry_context')}</Label>
              <Switch
                checked={settings.useIndustryContext}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, useIndustryContext: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t('ai_settings.personality.use_market_context')}</Label>
              <Switch
                checked={settings.useMarketContext}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, useMarketContext: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>{t('ai_settings.personality.use_company_context')}</Label>
              <Switch
                checked={settings.useCompanyContext}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, useCompanyContext: checked }))
                }
              />
            </div>
          </div>
        </Card>

        {/* Custom Instructions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.personality.custom_instructions')}
            </h2>
          </div>

          <div className="space-y-4">
            <Textarea
              value={settings.customInstructions}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, customInstructions: e.target.value }))
              }
              placeholder={t('ai_settings.personality.custom_instructions_placeholder')}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {t('ai_settings.personality.custom_instructions_help')}
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setSettings({
            aiName: 'FounderAI',
            communicationStyle: 'balanced',
            expertise: ['business', 'strategy'],
            tone: 'professional',
            formality: 70,
            creativity: 60,
            detailLevel: 80,
            customInstructions: '',
            useIndustryContext: true,
            useMarketContext: true,
            useCompanyContext: true
          })}>
            {t('common.reset')}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
} 