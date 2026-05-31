import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { getLocalePrefix, getAllHreflangUrls, getXDefaultUrl, localizeHtmlLinks } from '@/utils/locale-utils';
import { Shield, Zap, Image as ImageIcon, FileText, Code, ArrowRight, Lock, Globe, Star, Cpu, Calculator, Search } from 'lucide-react';
import HeroSearch from '@/components/common/components/HeroSearch';
import Link from 'next/link';
import { Suspense } from 'react';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tApp = await getTranslations({ locale, namespace: 'App' });

  let pageTitle = t('title');
  let metaDesc = "Professional free online tools for developers, designers & creators. 100% private, browser-based.";
  let metaKeywords = "aynzo tools, free online tools, image compressor, pdf converter";

  try { metaDesc = t('metaDescription'); } catch { try { metaDesc = t('description'); } catch {} }
  try { metaKeywords = t('metaKeywords'); } catch {}

  const localePrefix = getLocalePrefix(locale);

  return {
    title: { absolute: `${pageTitle} | ${tApp('name')} - 100% Free & Secure Online Tools` },
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
  const localePrefix = getLocalePrefix(locale);

  const toolCategories = [
    {
      icon: ImageIcon,
      label: 'Image Tools',
      count: '30+',
      tools: ['Image Compressor', 'Image Resizer', 'JPG to PNG', 'WebP Converter', 'Crop & Rotate'],
      href: `${localePrefix}/tools#image-tools`,
      gradient: 'from-indigo-600 to-violet-600',
    },
    {
      icon: FileText,
      label: 'PDF Tools',
      count: '8+',
      tools: ['PDF to Word', 'Merge PDF', 'Split PDF', 'Word to PDF', 'PDF Compress'],
      href: `${localePrefix}/tools#converters`,
      gradient: 'from-violet-600 to-purple-700',
    },
    {
      icon: Code,
      label: 'Developer Tools',
      count: '20+',
      tools: ['JSON Formatter', 'CSS Beautifier', 'Regex Tester', 'HTML Formatter', 'JS Minifier'],
      href: `${localePrefix}/tools#code-dev-tools`,
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: Calculator,
      label: 'Calculators',
      count: '25+',
      tools: ['EMI Calculator', 'GST Calculator', 'BMI Calculator', 'Age Calculator', 'SIP Calculator'],
      href: `${localePrefix}/tools#calculators`,
      gradient: 'from-purple-600 to-indigo-700',
    },
    {
      icon: Search,
      label: 'SEO & Social',
      count: '15+',
      tools: ['Meta Tag Generator', 'Keyword Density', 'XML Sitemap', 'OG Image Generator', 'Robots.txt'],
      href: `${localePrefix}/tools#seo-social`,
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      icon: Shield,
      label: 'Security & Crypto',
      count: '12+',
      tools: ['Password Generator', 'MD5 Generator', 'SHA-256', 'Base64 Encoder', 'UUID Generator'],
      href: `${localePrefix}/tools#security-crypto`,
      gradient: 'from-violet-700 to-purple-600',
    },
  ];

  return (
    <div className="flex flex-col">

      {/* ── HERO ── Gradient background, premium feel */}
      <section className="relative overflow-hidden">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0f0a2e] to-background dark:from-indigo-950 dark:via-[#0a0820] dark:to-background" />
        {/* Glow orbs */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-violet-600/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 pt-24 pb-20 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-300 text-xs font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest backdrop-blur-sm">
            <Zap size={12} className="text-indigo-400" /> 100+ Free Professional Tools
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
            {t.rich('heroTitle', {
              v: (chunks) => (
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              )
            })}
          </h1>

          {/* Subtext */}
          <p className="text-indigo-200/70 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            Fast, private, and 100% free. No signup required. All tools run directly in your browser.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl">
            <Suspense fallback={<div className="h-14 w-full animate-pulse bg-white/10 rounded-2xl" />}>
              <HeroSearch />
            </Suspense>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 w-full max-w-2xl">
            {[
              { value: '100+', label: 'Free Tools', icon: Zap },
              { value: '0%', label: 'Data Stored', icon: Lock },
              { value: '13', label: 'Languages', icon: Globe },
              { value: '100%', label: 'Browser-Based', icon: Cpu },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Icon size={16} className="text-indigo-400" />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-indigo-300/60 font-medium uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade into background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              Everything You Need, <span className="text-primary">All in One Place</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professional tools across every category — no signup, no ads, no limits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative rounded-3xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  {/* Gradient strip at top */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${cat.gradient}`} />

                  <div className="p-7 bg-card">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-black text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                        {cat.count} tools
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                      {cat.label}
                    </h3>

                    {/* Tool pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {cat.tools.map((tool) => (
                        <span key={tool} className="text-[11px] font-medium text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-lg border border-border/60">
                          {tool}
                        </span>
                      ))}
                      <span className="text-[11px] text-muted-foreground/50 py-1">& more...</span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                      Explore tools
                      <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`${localePrefix}/tools`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-primary/25"
            >
              View All 100+ Tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              {t('trust.title')}
            </h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.2em]">
              {t('trust.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: t('valueGrid.zeroData.title'), desc: t('valueGrid.zeroData.desc'), icon: Lock, gradient: 'from-indigo-600 to-violet-600' },
              { title: t('valueGrid.noLatency.title'), desc: t('valueGrid.noLatency.desc'), icon: Zap, gradient: 'from-violet-600 to-purple-700' },
              { title: t('valueGrid.alwaysFree.title'), desc: t('valueGrid.alwaysFree.desc'), icon: Star, gradient: 'from-indigo-500 to-blue-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-card border border-border rounded-3xl p-8 hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ── */}
      {t.has('seoContent') && (
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="prose max-w-none
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-8 prose-h2:text-foreground
                prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-foreground
                prose-p:text-lg prose-p:text-muted-foreground prose-p:mb-6
                prose-ul:space-y-4 prose-ul:mb-8
                prose-li:text-muted-foreground
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(t('seoContent'), locale) }}
            />
          </div>
        </section>
      )}

      {/* ── POPULAR CALCULATORS ── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              Calculators & <span className="text-primary">Financial Hub</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Professional-grade tools for finance, health, and daily planning. Free forever.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Age Calculator', slug: 'age-calculator', icon: '🎂' },
              { name: 'BMI Calculator', slug: 'bmi-calculator', icon: '⚖️' },
              { name: 'EMI Calculator', slug: 'emi-calculator', icon: '🏦' },
              { name: 'GST Calculator', slug: 'gst-calculator', icon: '📊' },
              { name: 'Mortgage Calc', slug: 'mortgage-calculator', icon: '🏠' },
              { name: 'Crypto Profit', slug: 'crypto-profit-calculator', icon: '₿' },
              { name: 'Body Fat %', slug: 'body-fat-calculator', icon: '💪' },
              { name: 'Salary Calc', slug: 'salary-calculator', icon: '💰' },
            ].map((tool) => (
              <Link
                key={tool.slug}
                href={`${localePrefix}/tools/${tool.slug}`}
                className="group p-5 rounded-2xl bg-background border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{tool.icon}</div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Open →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
