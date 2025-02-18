import LandingPage from '@/components/landing/LandingPage';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Co-Founder AI - AI-Powered Startup Advisory Platform',
  description: '24/7 access to an AI co-founder with persistent memory and deep business context. Make data-driven decisions, analyze documents, and generate strategic insights.',
  keywords: [
    'AI co-founder',
    'startup advisor',
    'business strategy AI',
    'document analysis',
    'decision support system',
    'venture building',
    'founder tools',
    'AI business insights',
    'startup growth platform',
    'entrepreneur AI assistant'
  ],
  openGraph: {
    title: 'Co-Founder AI - Your Intelligent Business Partner',
    description: 'AI-powered platform providing continuous strategic support and business analysis for startups',
    images: [
      {
        url: 'https://cofounder-ai.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Co-Founder AI Platform Interface'
      }
    ]
  }
};

export default async function Landing() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <LandingPage user={user} />;
} 