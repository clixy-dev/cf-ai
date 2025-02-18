import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import { ThemeProvider } from "@/app/theme-provider";
import { FontSizeProvider } from "@/utils/font-size-context";
import { TenantProvider } from "@/utils/tenant-context";
import { TranslationsProvider } from "@/utils/i18n/TranslationsContext";
import { ThemeColorsProvider } from "@/utils/theme-colors-context";
import { Toaster } from "@/components/ui/toaster";
import { FontSizeSwitcher } from "@/components/ui/font-size-switcher";

const meta = {
  title: 'Co-Founder AI Innovations',
  description: 'Co-Founder AI Innovations is a platform for managing suppliers and customers.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['Co-Founder AI', 'Innovations', 'Co-Founder AI Innovations'],
    authors: [{ name: 'Co-Founder AI Innovations', url: 'https://Co-Founder AI.io/' }],
    creator: 'Co-Founder AI Innovations',
    publisher: 'Co-Founder AI Innovations',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Co-Founder AI',
      creator: '@Co-Founder AI',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <FontSizeProvider>
            <ThemeColorsProvider>
              <TenantProvider>
                <TranslationsProvider>
                  <main className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]">
                    {children}
                  </main>
                  <Toaster />
                </TranslationsProvider>
              </TenantProvider>
            </ThemeColorsProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
