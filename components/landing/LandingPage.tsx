'use client'

import { User } from '@supabase/supabase-js';
import { Navbar } from '../layout/Navbar';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { 
  ChefHat,
  Clock, 
  Globe2,
  LineChart,
  MessageSquare,
  Package,
  Users,
  Users2,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { motion } from 'framer-motion';

export default function LandingPage({ user }: { user: User | null }) {
  const router = useRouter();
  const { t } = useTranslations();

  // Move structured data inside component
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t('landing.meta.app_name'),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: t('landing.meta.app_description'),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: t('landing.meta.currency'),
      description: t('landing.meta.trial_price')
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250'
    }
  };

  const features = [
    {
      title: t('landing.features.document_analysis.title'),
      description: t('landing.features.document_analysis.description'),
      icon: Package
    },
    {
      title: t('landing.features.decision_support.title'),
      description: t('landing.features.decision_support.description'),
      icon: Clock
    },
    {
      title: t('landing.features.customizable_frameworks.title'),
      description: t('landing.features.customizable_frameworks.description'),
      icon: Users
    }
  ];

  const aiCapabilities = [
    {
      title: t('landing.ai_capabilities.context_aware.title'),
      description: t('landing.ai_capabilities.context_aware.description'),
      metric: '100%',
      metricLabel: t('landing.ai_capabilities.context_aware.metric_label')
    },
    {
      title: t('landing.ai_capabilities.memory.title'),
      description: t('landing.ai_capabilities.memory.description'),
      metric: '99.9%',
      metricLabel: t('landing.ai_capabilities.memory.metric_label')
    },
    {
      title: t('landing.ai_capabilities.dynamic_processing.title'),
      description: t('landing.ai_capabilities.dynamic_processing.description'),
      metric: 'Real-time',
      metricLabel: t('landing.ai_capabilities.dynamic_processing.metric_label')
    }
  ];

  const testimonials = [
    {
      name: t('landing.testimonials.1.name'),
      role: t('landing.testimonials.1.role'),
      quote: t('landing.testimonials.1.quote')
    },
    {
      name: t('landing.testimonials.2.name'),
      role: t('landing.testimonials.2.role'),
      quote: t('landing.testimonials.2.quote')
    },
    {
      name: t('landing.testimonials.3.name'),
      role: t('landing.testimonials.3.role'),
      quote: t('landing.testimonials.3.quote')
    }
  ];

  const handleStartTrial = () => {
    router.push('/auth/signin');
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-background">
        <header className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <Navbar user={user} onMenuClick={() => {}} />
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section aria-labelledby="hero-heading" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative z-10">
                  <h1 
                    id="hero-heading"
                    className="text-5xl sm:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                  >
                    {t('landing.hero.title')}
                  </h1>
                  <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                    {t('landing.hero.description')}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="text-lg px-8"
                      onClick={handleStartTrial}
                    >
                      {t('landing.hero.start_trial')}
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      {t('landing.hero.watch_demo')}
                    </Button>
                  </div>
                </div>
                <div className="relative lg:h-[600px] rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                    alt={t('landing.seo.hero_image_alt')}
                    width={1200}
                    height={800}
                    priority
                    className="object-cover w-full h-full rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* AI Capabilities Section */}
          <section 
            aria-labelledby="capabilities-heading" 
            className="py-20 bg-muted/50"
          >
            <div className="container mx-auto px-4">
              <h2 
                id="capabilities-heading"
                className="text-3xl font-bold text-center mb-4"
              >
                {t('landing.ai_capabilities.title')}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {t('landing.ai_capabilities.subtitle')}
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {aiCapabilities.map((capability, index) => (
                  <div key={index} className="bg-background p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-2xl font-semibold mb-4">{capability.title}</h3>
                    <p className="text-muted-foreground mb-6">{capability.description}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-primary">{capability.metric}</span>
                      <span className="text-sm text-muted-foreground mb-1">{capability.metricLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section 
            id="features"
            aria-labelledby="features-heading" 
            className="py-20"
          >
            <div className="container mx-auto px-4">
              <h2 
                id="features-heading"
                className="text-3xl font-bold text-center mb-4"
              >
                {t('landing.features.title')}
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {t('landing.features.subtitle')}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} 
                    className="p-6 rounded-xl border bg-background/50 hover:bg-background hover:shadow-lg transition-all duration-300"
                  >
                    <feature.icon className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section 
            id="testimonials"
            aria-labelledby="testimonials-heading"
            className="py-20 bg-muted/50"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t('landing.testimonials.title')}</h2>
                <p className="text-xl text-muted-foreground">{t('landing.testimonials.subtitle')}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-background border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users2 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section 
            id="pricing"
            aria-labelledby="pricing-heading"
            className="py-20"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{t('landing.pricing.title')}</h2>
                <p className="text-xl text-muted-foreground">{t('landing.pricing.subtitle')}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Starter Plan */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-xl border hover:shadow-lg transition-shadow bg-muted/50"
                >
                  <h3 className="text-2xl font-bold mb-2">{t('landing.pricing.starter')}</h3>
                  <div className="text-4xl font-bold mb-4 text-primary">
                    {t('landing.pricing.starter_price')}
                  </div>
                  <div className="space-y-4 mb-6">
                    {t('landing.pricing.starter_features').split('\n').map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-5 w-5 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">{t('landing.pricing.choose_plan')}</Button>
                </motion.div>

                {/* Professional Plan */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-xl border hover:shadow-lg transition-shadow bg-muted/50 relative"
                >
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl text-sm">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{t('landing.pricing.pro')}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">{t('landing.pricing.pro_price')}</span>
                    <span className="text-muted-foreground">{t('landing.pricing.pro_per')}</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    {t('landing.pricing.pro_features').split('\n').map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-5 w-5 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">{t('landing.pricing.choose_plan')}</Button>
                </motion.div>

                {/* Enterprise Plan */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-xl border hover:shadow-lg transition-shadow bg-muted/50"
                >
                  <h3 className="text-2xl font-bold mb-2">{t('landing.pricing.enterprise')}</h3>
                  <div className="text-4xl font-bold mb-4 text-primary">
                    {t('landing.pricing.enterprise_price')}
                  </div>
                  <div className="space-y-4 mb-6">
                    {t('landing.pricing.enterprise_features').split('\n').map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-5 w-5 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    {t('landing.pricing.contact_sales')}
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section 
            id="contact"
            aria-labelledby="cta-heading"
            className="py-20 bg-muted/50 text-center"
          >
            <div className="container mx-auto px-4">
              <h2 
                id="cta-heading"
                className="text-3xl font-bold mb-8"
              >
                {t('landing.cta.founder_title')}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button 
                  size="lg"
                  onClick={handleStartTrial}
                >
                  {t('landing.cta.register_founder')}
                </Button>
              </div>
              <div className="max-w-md mx-auto">
                <form className="flex flex-col gap-4" onSubmit={(e) => {
                  e.preventDefault();
                  handleStartTrial();
                }}>
                  <Input type="email" placeholder={t('landing.cta.founder_email_placeholder')} />
                  <Button type="submit" size="lg">
                    {t('landing.cta.start_now')}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer role="contentinfo" className="border-t mt-12">
          <div className="container mx-auto px-4 py-8">
            <nav 
              aria-label={t('landing.accessibility.footer_nav_label')}
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
            >
              <div>
                <div className="flex items-center mb-4">
                  <ChefHat className="h-8 w-8" aria-label={t('landing.seo.logo_alt')} />
                  <span className="ml-2 text-xl font-bold">{t('landing.meta.app_name')}</span>
                </div>
                <p className="text-muted-foreground">
                  {t('landing.footer.about')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('landing.footer.quick_links.title')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#features">{t('landing.footer.quick_links.features')}</a></li>
                  <li><a href="#testimonials">{t('landing.footer.quick_links.testimonials')}</a></li>
                  <li><a href="#pricing">{t('landing.footer.quick_links.pricing')}</a></li>
                  <li><a href="#contact">{t('landing.footer.quick_links.contact')}</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('landing.footer.contact.title')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>{t('landing.footer.contact.email')}</li>
                  <li>{t('landing.footer.contact.phone')}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('landing.footer.newsletter.title')}</h3>
                <form 
                  className="space-y-2"
                  aria-label={t('landing.accessibility.newsletter_form_label')}
                >
                  <Input type="email" placeholder={t('landing.footer.newsletter.placeholder')} />
                  <Button className="w-full">{t('landing.footer.newsletter.subscribe')}</Button>
                </form>
              </div>
            </nav>
            <p className="text-center text-sm text-muted-foreground mt-8">
              {t('landing.footer.copyright')}{ new Date().getFullYear() }
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}