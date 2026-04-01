import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import Image from 'next/image';
import { Shield, Zap, Image as ImageIcon, FileText, Code, ArrowRight } from 'lucide-react';
import HeroSearch from '@/components/common/components/HeroSearch';
import { Link } from '@/navigation';

import ToolDirectory from '@/components/common/components/ToolDirectory';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tApp = await getTranslations({ locale, namespace: 'App' });

  return {
    title: {
      absolute: `${t('title')} | ${tApp('name')} - 100% Free & Secure Online Tools`
    },
    description: t('metaDescription'),
    keywords: t('metaKeywords'),
    alternates: {
      canonical: `https://tools.aynzo.com/${locale}`,
      languages: {
        'x-default': 'https://tools.aynzo.com/en',
        'en': 'https://tools.aynzo.com/en',
        'hi': 'https://tools.aynzo.com/hi',
        'pt': 'https://tools.aynzo.com/pt',
        'es': 'https://tools.aynzo.com/es',
        'id': 'https://tools.aynzo.com/id',
        'de': 'https://tools.aynzo.com/de',
        'fr': 'https://tools.aynzo.com/fr',
        'ja': 'https://tools.aynzo.com/ja',
        'ru': 'https://tools.aynzo.com/ru',
        'tr': 'https://tools.aynzo.com/tr',
        'it': 'https://tools.aynzo.com/it',
        'ko': 'https://tools.aynzo.com/ko',
        'zh': 'https://tools.aynzo.com/zh',
        'ar': 'https://tools.aynzo.com/ar',
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
          <HeroSearch />
          
          {/* CRICKET AI PROMO BANNER (DYNAMO) */}
          <div className="mt-12 bg-gradient-to-r from-red-600/10 via-[#ef4123]/5 to-slate-900/10 border border-red-500/10 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[60px] group-hover:bg-red-500/20 transition-all" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 text-left">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#ef4123] group-hover:scale-110 transition-transform">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-[#ef4123] text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-red-500/20 animate-pulse">New Feature</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IPL 2026 Special</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase italic leading-tight italic">Cricket AI Match Predictor</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Get 5 Daily Fantasy Teams & Deep Neural Match Analysis</p>
                    </div>
                </div>
                <Link 
                    href="/tools/cricket" 
                    className="bg-slate-900 hover:bg-[#ef4123] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-2 group/btn"
                >
                    Predict Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
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

      {/* SEO Link Directory - Strategically placed for crawlers but unobtrusive for users */}
      <ToolDirectory locale={locale} />
    </div>
  );
}

