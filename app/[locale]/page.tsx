import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { getLocalePrefix, getAllHreflangUrls, getXDefaultUrl, localizeHtmlLinks } from '@/utils/locale-utils';
import { ArrowRight, Lock, Zap } from 'lucide-react';
import HeroSearch from '@/components/common/components/HeroSearch';
import Link from 'next/link';
import { Suspense } from 'react';
import { getCategoryIcon } from '@/utils/icon-mapping';
import Script from 'next/script';

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
  const tTools = await getTranslations({ locale, namespace: 'Tools' });
  const tCategories = await getTranslations({ locale, namespace: 'Categories' });
  const localePrefix = getLocalePrefix(locale);

  const toolCategories = [
    { label: tCategories('Image Tools'),            key: 'Image Tools',             href: `${localePrefix}/tools#image-tools`,             count: 31 },
    { label: tCategories('Converters'),             key: 'Converters',              href: `${localePrefix}/tools#converters`,              count: 10 },
    { label: tCategories('Text Tools'),             key: 'Text Tools',              href: `${localePrefix}/tools#text-tools`,              count: 21 },
    { label: tCategories('Code & Developer Tools'), key: 'Code & Dev Tools',        href: `${localePrefix}/tools#code-&-developer-tools`,  count: 18 },
    { label: tCategories('Utility Tools'),          key: 'Utility Tools',           href: `${localePrefix}/tools#utility-tools`,           count: 15 },
    { label: tCategories('Security & Crypto'),      key: 'Security & Crypto',       href: `${localePrefix}/tools#security-&-crypto`,       count: 8  },
    { label: tCategories('Calculators'),            key: 'Calculator Tools',        href: `${localePrefix}/tools#calculators`,             count: 27 },
    { label: tCategories('SEO & Web Tools'),        key: 'SEO & Web Tools',         href: `${localePrefix}/tools#seo-&-web-tools`,          count: 11 },
    { label: tCategories('YouTube Tools'),          key: 'YouTube Tools',           href: `${localePrefix}/tools#youtube-tools`,           count: 6  },
    { label: tCategories('Social & Links'),         key: 'Social & Links',          href: `${localePrefix}/tools#social-&-links`,          count: 8  },
  ];

  const stats = [
    { value: '100+', label: t('statFreeTools') },
    { value: '0%',   label: t('statDataStored') },
    { value: '13',   label: t('statLanguages') },
    { value: '100%', label: t('statBrowserBased') },
  ];

  const trustItems = [
    { title: t('trustItem1Title'), desc: t('trustItem1Desc') },
    { title: t('trustItem2Title'), desc: t('trustItem2Desc') },
    { title: t('trustItem3Title'), desc: t('trustItem3Desc') },
    { title: t('trustItem4Title'), desc: t('trustItem4Desc') },
  ];

  const calcTools = [
    { nameKey: 'age-calculator.name',           slug: 'age-calculator',          fallback: 'Age Calculator',    icon: '🎂' },
    { nameKey: 'bmi-calculator.name',           slug: 'bmi-calculator',          fallback: 'BMI Calculator',    icon: '⚖️' },
    { nameKey: 'emi-calculator.name',           slug: 'emi-calculator',          fallback: 'EMI Calculator',    icon: '🏦' },
    { nameKey: 'gst-calculator.name',           slug: 'gst-calculator',          fallback: 'GST Calculator',    icon: '📊' },
    { nameKey: 'mortgage-calculator.name',      slug: 'mortgage-calculator',     fallback: 'Mortgage Calc',     icon: '🏠' },
    { nameKey: 'crypto-profit-calculator.name', slug: 'crypto-profit-calculator',fallback: 'Crypto Profit',     icon: '₿'  },
    { nameKey: 'body-fat-calculator.name',      slug: 'body-fat-calculator',     fallback: 'Body Fat %',        icon: '💪' },
    { nameKey: 'salary-calculator.name',        slug: 'salary-calculator',       fallback: 'Salary Calc',       icon: '💰' },
  ];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Aynzo Tools',
    'url': `https://tools.aynzo.com${localePrefix}`,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `https://tools.aynzo.com${localePrefix}/tools?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="flex flex-col">
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* ── HERO ── */}
      <section className="relative overflow-hidden -mt-[62px]">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 pt-[158px] pb-20 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary text-xs font-black px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            {t('heroBadge')}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.05]">
            {t.rich('heroTitle', {
              v: (chunks) => <span>{chunks}</span>
            })}
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl">
            <Suspense fallback={<div className="h-14 w-full animate-pulse bg-white/10 rounded-2xl" />}>
              <HeroSearch />
            </Suspense>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 w-full max-w-2xl border-t border-slate-100 dark:border-slate-800/50 pt-10">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <p className="text-3xl font-extrabold text-primary">{value}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              {t('categorySectionTitle')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t('categorySectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {toolCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.key);
              return (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="group rounded-[1.5rem] bg-card border border-slate-200/80 dark:border-slate-800/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 p-8 flex flex-col items-start"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('catToolsCount', { count: cat.count })}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── POPULAR CALCULATORS SECTION ── */}
      <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
              Popular Online Calculators
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Quick, accurate, and privacy-first calculator tools for everyday tasks, finance, and health.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {calcTools.map((tool) => {
              let name = tool.fallback;
              let desc = '';
              try { name = tTools(tool.nameKey); } catch {}
              try { desc = tTools(`${tool.slug}.description`); } catch {}
              
              return (
                <Link
                  key={tool.slug}
                  href={`${localePrefix}/tools/${tool.slug}`}
                  className="group rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800/80 hover:border-primary/40 hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-start"
                >
                  <div className="text-3xl mb-4 bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 flex-1">
                    {desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                    <span>Use Tool</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              {t('trustTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="bg-card border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── READY TO GET STARTED ── */}
      <section className="py-20 bg-background text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{t('ctaTitle')}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className="pt-2">
            <Link
              href={`${localePrefix}/tools`}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ── */}
      {(() => {
        let seoHtml = '';
        try { seoHtml = t('seoContent'); } catch {}
        if (!seoHtml || seoHtml === 'seoContent') return null;
        return (
          <section className="py-20 bg-background border-t border-border/60">
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
                dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(seoHtml, locale) }}
              />
            </div>
          </section>
        );
      })()}

      {/* ── POPULAR CALCULATORS ── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
              {t('calcSectionTitle')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t('calcSectionSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {calcTools.map((tool) => {
              let toolName = tool.fallback;
              try { toolName = tTools(tool.nameKey); } catch {}
              return (
                <Link
                  key={tool.slug}
                  href={`${localePrefix}/tools/${tool.slug}`}
                  className="group p-5 rounded-2xl bg-background border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{tool.icon}</div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{toolName}</h3>
                  <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{t('openTool')}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
