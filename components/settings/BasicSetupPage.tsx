'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useTenant } from '@/utils/tenant-context';
import { getTenantSettings, updateTenantSettings } from '@/utils/supabase/queries';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { toast } from '@/components/ui/use-toast';
import { Upload, X, Palette } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useThemeColors } from '@/utils/theme-colors-context';

interface BasicSetupPageProps {
  user: User;
}

interface ThemeColors {
  primary: string;
  secondary: string;
}

interface FormData {
  company_name: string;
  company_uen: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_description: string;
  terms_accepted: boolean;
  logo_url: string;
  theme_colors: ThemeColors;
}

// Add this configuration for next/image to allow external URLs from Supabase storage
const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function BasicSetupPage({ user }: BasicSetupPageProps) {
  const { currentTenant } = useTenant();
  const { t } = useTranslations();
  const { updateThemeColors } = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    company_uen: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_description: '',
    terms_accepted: false,
    logo_url: '',
    theme_colors: {
      primary: '#8AB661',
      secondary: '#2F855A'
    }
  });

  useEffect(() => {
    if (currentTenant) {
      loadTenantSettings();
    }
  }, [currentTenant]);

  useEffect(() => {
    // Update theme colors whenever they change in formData
    if (formData.theme_colors) {
      updateThemeColors(formData.theme_colors);
    }
  }, [formData.theme_colors]);

  const loadTenantSettings = async () => {
    try {
      const supabase = createClient();
      const settings = await getTenantSettings(supabase, currentTenant!.id);
      if (settings) {
        setFormData({
          company_name: settings.company_name || '',
          company_uen: settings.company_uen || '',
          company_email: settings.company_email || '',
          company_phone: settings.company_phone || '',
          company_address: settings.company_address || '',
          company_description: settings.company_description || '',
          terms_accepted: settings.terms_accepted || false,
          logo_url: settings.logo_url || '',
          theme_colors: {
            primary: settings.theme_colors?.primary || '#8AB661',
            secondary: settings.theme_colors?.secondary || '#2F855A'
          }
        });
      }
    } catch (error) {
      console.error('Error loading tenant settings:', error);
      toast({
        title: t('common.error'),
        description: t('settings.failed_to_load'),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!currentTenant) return;
    
    setLoading(true);
    try {
      const supabase = createClient();
      await updateTenantSettings(supabase, currentTenant.id, formData);
      toast({
        title: t('common.success'),
        description: t('settings.saved_successfully'),
      });
    } catch (error) {
      console.error('Error saving tenant settings:', error);
      toast({
        title: t('common.error'),
        description: t('settings.failed_to_save'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!currentTenant) return;

    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      toast({
        title: t('common.error'),
        description: t('settings.logo_file_too_large'),
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);
    try {
      const supabase = createClient();
      
      // Delete existing logo if exists
      if (formData.logo_url) {
        const oldPath = formData.logo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('company-logos')
            .remove([oldPath]);
        }
      }

      // Upload new logo
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentTenant.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      
      // Save immediately
      await updateTenantSettings(supabase, currentTenant.id, {
        ...formData,
        logo_url: publicUrl
      });

      toast({
        title: t('common.success'),
        description: t('settings.logo_uploaded'),
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: t('common.error'),
        description: t('settings.logo_upload_failed'),
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentTenant || !formData.logo_url) return;

    try {
      const supabase = createClient();
      const fileName = formData.logo_url.split('/').pop();
      
      if (fileName) {
        await supabase.storage
          .from('company-logos')
          .remove([fileName]);
      }

      setFormData(prev => ({ ...prev, logo_url: '' }));
      await updateTenantSettings(supabase, currentTenant.id, {
        ...formData,
        logo_url: ''
      });

      toast({
        title: t('common.success'),
        description: t('settings.logo_removed'),
      });
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: t('common.error'),
        description: t('settings.logo_remove_failed'),
        variant: "destructive",
      });
    }
  };

  const handleColorChange = (colorType: keyof ThemeColors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the value is a valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        theme_colors: {
          ...prev.theme_colors,
          [colorType]: value
        }
      }));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb 
            items={[
              { label: t('nav.dashboard'), href: '/' },
              { label: t('nav.settings') }
            ]} 
          />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            {t('settings.basic_setup')}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t('settings.basic_setup_description')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="space-y-8 p-6">
          {/* Company Logo Section */}
          <div className="grid grid-cols-[200px,1fr] gap-6 items-start">
            <Label className="font-medium">{t('settings.company_logo')}:</Label>
            <div className="space-y-4">
              {formData.logo_url ? (
                <div className="relative w-[200px] h-[200px] border rounded-lg overflow-hidden">
                  <Image
                    loader={imageLoader}
                    src={formData.logo_url}
                    alt="Company Logo"
                    fill
                    className="object-contain"
                    unoptimized
                    priority={true}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-[200px] h-[200px] border-2 border-dashed rounded-lg bg-muted/50">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                      <label
                        htmlFor="logo-upload"
                        className="relative cursor-pointer font-semibold text-primary hover:text-primary/80"
                      >
                        <span>{t('settings.upload_logo')}</span>
                        <input
                          id="logo-upload"
                          name="logo-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('settings.logo_requirements')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('settings.company_information')}</h3>
              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="company_name">{t('settings.company_name')}:</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder={t('settings.enter_company_name')}
                />
              </div>

              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="company_uen">{t('settings.company_uen')}:</Label>
                <Input
                  id="company_uen"
                  name="company_uen"
                  value={formData.company_uen}
                  onChange={handleChange}
                  placeholder={t('settings.enter_company_uen')}
                />
              </div>

              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="company_email">{t('settings.email')}:</Label>
                <Input
                  id="company_email"
                  name="company_email"
                  type="email"
                  value={formData.company_email}
                  onChange={handleChange}
                  placeholder={t('settings.enter_email')}
                />
              </div>

              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="company_phone">{t('settings.phone')}:</Label>
                <Input
                  id="company_phone"
                  name="company_phone"
                  type="tel"
                  value={formData.company_phone}
                  onChange={handleChange}
                  placeholder={t('settings.enter_phone')}
                />
              </div>

              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="company_address">{t('settings.company_address')}:</Label>
                <Input
                  id="company_address"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  placeholder={t('settings.enter_company_address')}
                />
              </div>

              <div className="grid grid-cols-[200px,1fr] gap-4 items-start">
                <Label htmlFor="company_description">{t('settings.company_description')}:</Label>
                <Textarea
                  id="company_description"
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleChange}
                  placeholder={t('settings.enter_company_description')}
                  rows={4}
                />
              </div>
            </div>

            {/* Theme Colors Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t('settings.theme_colors')}</h3>
              </div>
              <Separator />
              
              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="primary_color">{t('settings.primary_color')}:</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    value={formData.theme_colors?.primary || '#8AB661'}
                    onChange={handleColorChange('primary')}
                    className="w-20 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.theme_colors?.primary || '#8AB661'}
                    onChange={handleColorChange('primary')}
                    className="w-32 font-mono uppercase"
                    maxLength={7}
                  />
                  <div 
                    className="w-32 h-10 rounded-md"
                    style={{ backgroundColor: formData.theme_colors?.primary || '#8AB661' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
                <Label htmlFor="secondary_color">{t('settings.secondary_color')}:</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    type="color"
                    value={formData.theme_colors?.secondary || '#2F855A'}
                    onChange={handleColorChange('secondary')}
                    className="w-20 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.theme_colors?.secondary || '#2F855A'}
                    onChange={handleColorChange('secondary')}
                    className="w-32 font-mono uppercase"
                    maxLength={7}
                  />
                  <div 
                    className="w-32 h-10 rounded-md"
                    style={{ backgroundColor: formData.theme_colors?.secondary || '#2F855A' }}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="grid grid-cols-[200px,1fr] gap-4 items-center">
              <div></div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms_accepted"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, terms_accepted: checked as boolean }))
                  }
                />
                <label
                  htmlFor="terms_accepted"
                  className="text-sm font-medium leading-none"
                >
                  {t('settings.terms_and_conditions')}
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button variant="outline" onClick={() => loadTenantSettings()}>
              {t('common.reset')}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 