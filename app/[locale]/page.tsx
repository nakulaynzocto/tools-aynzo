import { ToolCard } from '@/components/ToolCard';
import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  FileText, Image as ImageIcon, Lock, Code, Search, Youtube, Link as LinkIcon,
  RefreshCw, Shuffle, CreditCard, Wand2, Shield, Zap, Globe
} from 'lucide-react';

// IMPORTANT: Add 'export const dynamic = "force-dynamic"' if you want to bypass static generation, 
// though generally static params are preferred.
// For now, we rely on generateStaticParams if we want SSG, but let's stick to simple dynamic rendering.

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const tApp = await getTranslations({ locale, namespace: 'App' });

  return {
    title: {
      absolute: `${t('title')} | ${tApp('name')}`
    },
    description: t('description'),
    alternates: {
      canonical: `https://tools.aynzo.com/${locale}`,
      languages: {
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

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('HomePage');
  // If we wanted to translate categories dynamically in the component:
  const tCategories = useTranslations('Categories');
  const tTools = useTranslations('Tools');

  // Group tools by category
  const toolsByCategory: Record<string, typeof tools> = {};

  // We need to map the English category names to localized category names if we want grouping?
  // Actually, tools.ts uses English keys. We display them localized.

  tools.forEach(tool => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(tool);
  });

  // Icon mapping based on category name
  const getCategoryIcon = (category: string) => {
    if (category.includes('image')) return ImageIcon;
    if (category.includes('pdf') || category.includes('text')) return FileText;
    if (category.includes('security') || category.includes('crypto')) return Lock;
    if (category.includes('developer') || category.includes('code')) return Code;
    if (category.includes('seo') || category.includes('web')) return Search;
    if (category.includes('youtube')) return Youtube;
    if (category.includes('social') || category.includes('link')) return LinkIcon;
    if (category.includes('converter')) return RefreshCw;
    if (category.includes('random')) return Shuffle;
    if (category.includes('utility')) return CreditCard;
    return Wand2;
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-[0.03]"></div>

        <div className="relative z-10 w-full px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t('description')}
            <br className="hidden md:block" />
            {t('noAds')}
          </p>
        </div>
      </section>

      {/* Tools Sections by Category */}
      <div className="w-full px-6 space-y-16">
        {Object.entries(toolsByCategory).map(([categoryName, categoryTools]) => {
          return (
            <div key={categoryName} id={categoryName.replace(/\s+/g, '-').toLowerCase()} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {tCategories.has(categoryName) ? tCategories(categoryName) : categoryName}
                </h2>
                <span className="text-sm font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                  {categoryTools.length}
                </span>
              </div>

              <div className="flex items-center gap-3 border-b border-border pb-4 hidden">
                {/* This hidden block is just to avoid unused icon imports being removed by checkers if I used them directly */}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    _id={tool.slug}
                    slug={tool.slug}
                    name={tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                    description={tTools.has(`${tool.slug}.description`) ? tTools(`${tool.slug}.description`) : tool.description}
                    category={tCategories.has(categoryName) ? tCategories(categoryName) : categoryName}
                    icon={getCategoryIcon(tool.category)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
