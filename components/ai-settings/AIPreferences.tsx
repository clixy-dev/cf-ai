'use client';

import { User } from '@supabase/supabase-js';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Bell, Clock, Lock, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIPreferencesProps {
  user: User;
}

interface Preferences {
  notificationsEnabled: boolean;
  emailSummariesEnabled: boolean;
  summaryFrequency: string;
  autoSaveChats: boolean;
  retentionPeriod: string;
  enhancedPrivacy: boolean;
  dataSharing: boolean;
  contextWindow: string;
}

export function AIPreferences({ user }: AIPreferencesProps) {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    notificationsEnabled: true,
    emailSummariesEnabled: true,
    summaryFrequency: 'weekly',
    autoSaveChats: true,
    retentionPeriod: '90days',
    enhancedPrivacy: false,
    dataSharing: true,
    contextWindow: 'medium'
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: t('common.success'),
        description: t('ai_settings.preferences.saved'),
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: t('common.error'),
        description: t('ai_settings.preferences.save_error'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('ai_settings.preferences.title')}</h1>
        <p className="text-muted-foreground">
          {t('ai_settings.preferences.subtitle')}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.preferences.notifications')}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('ai_settings.preferences.enable_notifications')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('ai_settings.preferences.notifications_description')}
                </p>
              </div>
              <Switch
                checked={preferences.notificationsEnabled}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, notificationsEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('ai_settings.preferences.email_summaries')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('ai_settings.preferences.summaries_description')}
                </p>
              </div>
              <Switch
                checked={preferences.emailSummariesEnabled}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, emailSummariesEnabled: checked }))
                }
              />
            </div>

            {preferences.emailSummariesEnabled && (
              <div className="grid gap-2">
                <Label>{t('ai_settings.preferences.summary_frequency')}</Label>
                <Select
                  value={preferences.summaryFrequency}
                  onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, summaryFrequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      {t('ai_settings.preferences.frequency_daily')}
                    </SelectItem>
                    <SelectItem value="weekly">
                      {t('ai_settings.preferences.frequency_weekly')}
                    </SelectItem>
                    <SelectItem value="monthly">
                      {t('ai_settings.preferences.frequency_monthly')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.preferences.data_management')}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('ai_settings.preferences.auto_save')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('ai_settings.preferences.auto_save_description')}
                </p>
              </div>
              <Switch
                checked={preferences.autoSaveChats}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, autoSaveChats: checked }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>{t('ai_settings.preferences.retention_period')}</Label>
              <Select
                value={preferences.retentionPeriod}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, retentionPeriod: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">
                    {t('ai_settings.preferences.retention_30days')}
                  </SelectItem>
                  <SelectItem value="90days">
                    {t('ai_settings.preferences.retention_90days')}
                  </SelectItem>
                  <SelectItem value="1year">
                    {t('ai_settings.preferences.retention_1year')}
                  </SelectItem>
                  <SelectItem value="forever">
                    {t('ai_settings.preferences.retention_forever')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.preferences.privacy')}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('ai_settings.preferences.enhanced_privacy')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('ai_settings.preferences.privacy_description')}
                </p>
              </div>
              <Switch
                checked={preferences.enhancedPrivacy}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, enhancedPrivacy: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('ai_settings.preferences.data_sharing')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('ai_settings.preferences.sharing_description')}
                </p>
              </div>
              <Switch
                checked={preferences.dataSharing}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, dataSharing: checked }))
                }
              />
            </div>
          </div>
        </Card>

        {/* Context Window */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">
              {t('ai_settings.preferences.context_window')}
            </h2>
          </div>

          <div className="grid gap-2">
            <Select
              value={preferences.contextWindow}
              onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, contextWindow: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">
                  {t('ai_settings.preferences.context_small')}
                </SelectItem>
                <SelectItem value="medium">
                  {t('ai_settings.preferences.context_medium')}
                </SelectItem>
                <SelectItem value="large">
                  {t('ai_settings.preferences.context_large')}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('ai_settings.preferences.context_description')}
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setPreferences({
            notificationsEnabled: true,
            emailSummariesEnabled: true,
            summaryFrequency: 'weekly',
            autoSaveChats: true,
            retentionPeriod: '90days',
            enhancedPrivacy: false,
            dataSharing: true,
            contextWindow: 'medium'
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