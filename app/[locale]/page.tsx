import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { getLocalePrefix, getAllHreflangUrls, getXDefaultUrl, localizeHtmlLinks } from '@/utils/locale-utils';
import Image from 'next/image';
import { Shield, Zap, Image as ImageIcon, FileText, Code, ArrowRight } from 'lucide-react';
import HeroSearch from '@/components/common/components/HeroSearch';
import { Link } from '@/navigation';
import { Suspense } from 'react';

import ToolDirectory from '@/components/common/components/ToolDirectory';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tApp = await getTranslations({ locale, namespace: 'App' });

  // Safe reads — prevents build crash if any locale file is missing a key
  let pageTitle = locale === 'en' ? t('title') : t('title');
  let metaDesc = "Professional free online tools for developers, designers & creators. 100% private, browser-based.";
  let metaKeywords = "aynzo tools, free online tools, image compressor, pdf converter";

  try { metaDesc = t('metaDescription'); } catch { try { metaDesc = t('description'); } catch {} }
  try { metaKeywords = t('metaKeywords'); } catch {}
  
  // as-needed locale prefix logic
  const localePrefix = getLocalePrefix(locale);

  return {
    title: {
      absolute: `${pageTitle} | ${tApp('name')} - 100% Free & Secure Online Tools`
    },
    description: metaDesc,
    keywords: metaKeywords,
    alternates: {
      canonical: `https://tools.aynzo.com${localePrefix}`,
      languages: {
        'x-default': getXDefaultUrl('https://tools.aynzo.com'),
        ...getAllHreflangUrls('https://tools.aynzo.com', locales)
      }
    }
  };
}


export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  const capabilities = [
    {
      title: t('capabilities.image.title'),
      description: t('capabilities.image.description'),
      icon: ImageIcon,
      image: "/assets/image_tools.png",
      color: "from-blue-500/20 to-purple-500/20",
      accent: "text-blue-500",
      href: "/tools"
    },
    {
      title: t('capabilities.pdf.title'),
      description: t('capabilities.pdf.description'),
      icon: FileText,
      image: "/assets/pdf_tools.png",
      color: "from-orange-500/20 to-red-500/20",
      accent: "text-orange-500",
      href: "/tools"
    },
    {
      title: t('capabilities.dev.title'),
      description: t('capabilities.dev.description'),
      icon: Code,
      image: "/assets/dev_tools.png",
      color: "from-green-500/20 to-emerald-500/20",
      accent: "text-emerald-500",
      href: "/tools"
    },
    {
      title: t('capabilities.privacy.title'),
      description: t('capabilities.privacy.description'),
      icon: Shield,
      image: "/assets/security_privacy.png",
      color: "from-indigo-500/20 to-blue-500/20",
      accent: "text-indigo-500",
      href: "/tools"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Clean & Structured */}
      <section className="relative pt-24 pb-12 flex flex-col items-center justify-center px-6 bg-background">
        <div className="relative z-10 max-w-4xl w-full text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8">
            {t.rich('heroTitle', {
              v: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </h1>
          <Suspense fallback={<div className="h-16 w-full max-w-3xl mx-auto animate-pulse bg-muted/20 rounded-2xl" />}>
            <HeroSearch />
          </Suspense>
        </div>
      </section>

      {/* Capabilities Story Section */}
      <section className="py-16 space-y-24">
        {capabilities.map((cap, index) => (
          <div key={index} className={`max-w-7xl mx-auto px-6 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}>
            {/* Content Container */}
            <div className="flex-1 space-y-8 text-center md:text-left">
              <h2 className="leading-tight">
                {cap.title}
              </h2>
              <p className="subtitle">
                {cap.description}
              </p>
              <div className={`hidden md:flex items-center gap-3 font-semibold uppercase tracking-widest text-xs ${cap.accent}`}>
                <span className="h-px w-10 bg-current opacity-20"></span>
                {t('labels.secureFast')}
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 w-full max-w-2xl group">
              <Link href={cap.href} className={`relative block aspect-square rounded-[3rem] overflow-hidden bg-gradient-to-br ${cap.color} ring-1 ring-border/50 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1`}>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image 
                  src={cap.image} 
                  alt={cap.title}
                  fill
                  priority={index < 2}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-contain p-12 drop-shadow-2xl transition-all duration-700 group-hover:scale-110"
                />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Value Proposition Grid */}
      <section className="py-40 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="mb-6">{t('trust.title')}</h2>
            <p className="text-xl text-muted-foreground font-medium uppercase tracking-[0.3em]">{t('trust.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('valueGrid.zeroData.title'), desc: t('valueGrid.zeroData.desc') },
              { title: t('valueGrid.noLatency.title'), desc: t('valueGrid.noLatency.desc') },
              { title: t('valueGrid.alwaysFree.title'), desc: t('valueGrid.alwaysFree.desc') }
            ].map((item, i) => (
              <div key={i} className="bg-card border-2 border-border rounded-[2rem] p-10 shadow-sm hover:shadow-xl transition-all hover:border-primary/30 group">
                <h3 className="mb-4 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full group-hover:scale-y-125 transition-transform"></span>
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-loose text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section - High Value for Search Engines */}
      {t.has('seoContent') && (
        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-6">
            <div 
              className="prose prose-invert max-w-none 
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-8 prose-h2:text-foreground
                prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-foreground
                prose-p:text-lg prose-p:text-muted-foreground prose-p:mb-6
                prose-ul:space-y-4 prose-ul:text-muted-foreground prose-ul:mb-8
                prose-li:text-muted-foreground
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(t('seoContent'), locale) }}
            />
          </div>
        </section>
      )}

      {/* Popular Calculators & Health Tools Section - Driving Traffic to SEO Pillars */}
      <section className="py-24 bg-card ring-1 ring-border shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Calculators & <span className="text-primary">Financial Hub</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Professional-grade tools for finance, health, and daily planning. Completely private, fast, and free forever.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Age Calculator', slug: 'age-calculator', icon: '🎂' },
              { name: 'BMI Calculator', slug: 'bmi-calculator', icon: '⚖️' },
              { name: 'EMI Calculator', slug: 'emi-calculator', icon: '🏦' },
              { name: 'GST Calculator', slug: 'gst-calculator', icon: '📊' },
              { name: 'Mortgage Calc', slug: 'mortgage-calculator', icon: '🏠' },
              { name: 'Crypto Profit', slug: 'crypto-profit-calculator', icon: '₿' },
              { name: 'Body Fat %', slug: 'body-fat-calculator', icon: '💪' },
              { name: 'Salary Calc', slug: 'salary-calculator', icon: '💰' }
            ].map((tool) => (
              <Link 
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300 transform-gpu">{tool.icon}</div>
                <h3 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Launch Tool →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Link Directory - Strategically placed for crawlers but unobtrusive for users */}
      <ToolDirectory locale={locale} />
    </div>
  );
}

