'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyUserTenant } from '@/utils/auth-helpers';
import { useTenant } from '@/utils/tenant-context';
import Link from 'next/link';
import { createUserTenant, updateTenantSettings } from '@/utils/supabase/queries';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { Language, languages } from '@/utils/i18n/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

// Define language icons mapping
const languageIcons: Record<string, string> = {
  en: '🇺🇸',
  ja: '🇯🇵',
  ko: '🇰🇷',
  vi: '🇻🇳',
  th: '🇹🇭',
  zh: '🇨🇳',
};

export type AuthState = 'signin' | 'signup' | 'forgot_password';

interface AuthFormProps {
  state: AuthState;
}

export default function AuthForm({ state }: AuthFormProps) {
  const { t, setLanguage, currentLanguage } = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setCurrentTenant } = useTenant();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const supabase = createClient();

    try {
      if (state === 'signin') {
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (!user) throw new Error('No user returned from sign-in');

        // Verify tenant access and get default tenant
        const defaultTenant = await verifyUserTenant(supabase, user.id);
        setCurrentTenant(defaultTenant);
        localStorage.setItem('currentTenant', JSON.stringify(defaultTenant));

        router.push('/');
        router.refresh();
      } 
      else if (state === 'signup') {
        // Validate passwords match
        if (password !== confirmPassword) {
          throw new Error(t('signup.passwords_not_match'));
        }

        // Sign up the user
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;
        if (!user) throw new Error('No user returned from sign-up');

        // Create tenant and settings
        try {
          const tenant = await createUserTenant(supabase, user.id, name);
          
          // Update tenant settings with user's email
          await updateTenantSettings(supabase, tenant.id, {
            company_email: email,
          });

          // Show success message and redirect
          router.push('/auth/verify-email');
        } catch (error: any) {
          // If tenant creation fails, we should handle it gracefully
          console.error('Failed to create tenant:', error);
          throw new Error(t('signup.tenant_creation_failed'));
        }
      }
      else if (state === 'forgot_password') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/callback`,
        });
        if (resetError) throw resetError;
        router.push('/auth/check-email');
      }
    } catch (error: any) {
      setError(error.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'signup': return t('signin.title');
      case 'forgot_password': return t('signin.forgot_password');
      default: return t('signin.title');
    }
  };

  const getDescription = () => {
    switch (state) {
      case 'signup': return t('signin.title');
      case 'forgot_password': return t('signin.forgot_password');
      default: return t('signin.title');
    }
  };

  const getButtonText = () => {
    switch (state) {
      case 'signup': return loading ? t('common.loading') : t('signin.sign_in');
      case 'forgot_password': return loading ? t('common.loading') : t('signin.forgot_password');
      default: return loading ? t('common.loading') : t('signin.sign_in');
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">{languageIcons[currentLanguage]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code as Language)}
                className="flex items-center gap-2"
              >
                <span>{languageIcons[lang.code]}</span>
                <span>{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          {state === 'signin' ? t('signin.title') : getTitle()}
        </h2>
        {/* {state === 'signin' && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('common.no_account')}</span>
            <Link href="/auth/signup" className="text-secondary hover:text-secondary/80">
              {t('signin.sign_in')}
            </Link>
          </div>
        )} */}
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {state === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">{t('signin.username')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('signin.username')}
              disabled={loading}
              className="bg-white/50"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">
            {state === 'signin' ? t('signin.username') : t('signin.username')}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t('signin.username')}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
        {state !== 'forgot_password' && (
          <div className="space-y-2">
            <Label htmlFor="password">{t('signin.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('signin.password')}
              minLength={6}
              disabled={loading}
              className="bg-white/50"
            />
          </div>
        )}
        {state === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('signin.password')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t('signin.password')}
              minLength={6}
              disabled={loading}
              className="bg-white/50"
            />
          </div>
        )}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">
            {error}
          </div>
        )}
        
        {state === 'signin' && (
          <Link 
            href="/auth/forgot_password" 
            className="block text-sm text-secondary hover:text-secondary/80"
          >
            {t('signin.forgot_password')}
          </Link>
        )}

        <Button 
          type="submit" 
          className="w-full rounded-full bg-primary hover:bg-primary/90" 
          disabled={loading}
        >
          {state === 'signin' ? t('signin.sign_in') : getButtonText()}
        </Button>
        
        {/* Navigation links */}
        {state !== 'signin' && (
          <div className="text-sm text-center space-y-2">
            {state === 'signup' ? (
              <p>
                {t('common.no_account')}{' '}
                <Link href="/auth/signin" className="text-secondary hover:text-secondary/80">
                  {t('signin.sign_in')}
                </Link>
              </p>
            ) : (
              <p>
                {t('common.remember_password')}{' '}
                <Link href="/auth/signin" className="text-secondary hover:text-secondary/80">
                  {t('signin.sign_in')}
                </Link>
              </p>
            )}
          </div>
        )}

        {/* Add links between sign in and sign up */}
        {state === 'signin' && (
          <div className="text-center mt-4">
            <span className="text-muted-foreground">
              {t('common.no_account')} {' '}
            </span>
            <Link 
              href="/auth/signup"
              className="text-primary hover:underline"
            >
              {t('signin.sign_up')}
            </Link>
          </div>
        )}
        
        {state === 'signup' && (
          <div className="text-center mt-4">
            <span className="text-muted-foreground">
              {t('signup.have_account')} {' '}
            </span>
            <Link 
              href="/auth/signin"
              className="text-primary hover:underline"
            >
              {t('signup.sign_in')}
            </Link>
          </div>
        )}
      </form>

    </div>
  );
}
