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
      <section className="relative py-8 md:py-20 px-4 overflow-hidden">
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

      {/* SEO Content Section */}
      {locale === 'en' && (
        <section className="w-full px-6 max-w-5xl mx-auto py-20 border-t border-border mt-20">
          <div className="prose prose-invert prose-blue max-w-none">
            <h2 className="text-3xl font-bold text-foreground mb-8">Empower Your Digital Workflow with Aynzo Tools</h2>

            <p className="text-lg text-muted-foreground mb-6">
              Welcome to <strong>Aynzo Tools</strong>, your ultimate destination for high-quality, <strong>free online tools</strong> designed to simplify your daily digital tasks. In a world where productivity is paramount, we provide a clean, fast, and secure environment to handle everything from complex file conversions to simple text formatting. Our mission is to offer a professional "utilities-as-a-service" platform that eliminates the need for expensive software or clunky, ad-ridden alternatives.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">A Comprehensive Suite of Online Utilities</h3>
            <p className="text-muted-foreground mb-6">
              At Aynzo Tools, we categorize our offerings to help you find exactly what you need in seconds:
            </p>
            <ul className="space-y-4 text-muted-foreground mb-8">
              <li>
                <strong className="text-foreground">Image Converter Online & Editors:</strong> Our image suite is built for speed. Whether you need an <strong>image converter online</strong> to switch between JPG, PNG, and WebP, or you need to compress photos for web optimization, we’ve got you covered. You can also crop, rotate, and add filters with zero quality loss.
              </li>
              <li>
                <strong className="text-foreground">Essential PDF Tools:</strong> Documents shouldn't be a hassle. Our <strong className="text-foreground">pdf tools free</strong> of charge allow you to convert PDFs to Word, merge files, or extract images without compromising document integrity.
              </li>
              <li>
                <strong className="text-foreground">Text & Coding Utilities:</strong> For developers and writers, we offer advanced text formatters, case converters, and code minifiers. Validate your JSON, beautify your CSS, or convert Markdown to HTML with a single click.
              </li>
              <li>
                <strong className="text-foreground">SEO & Social Media Tools:</strong> Rank higher and share better. Use our meta-tag generators, keyword density checkers, and YouTube thumbnail downloaders to gain a competitive edge in search results.
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">Why Choose Aynzo Tools?</h3>
            <p className="text-muted-foreground mb-6">
              The internet is full of "free" sites that track your data or bombard you with intrusive ads. Aynzo Tools is different. We prioritize <strong>Privacy and Security</strong>, ensuring that your files are processed locally or deleted immediately after use. Our platform is <strong>100% Ad-Free</strong>, meaning you can focus on your work without distractions. Every tool is optimized for <strong>Blazing Fast Performance</strong>, using the latest web technologies to deliver results in milliseconds.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-6">Who is Aynzo Tools For?</h3>
            <p className="text-muted-foreground mb-6">
              Our platform is meticulously crafted for:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground mb-8">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Developers:</strong> Quickly debugging code, formatting data, or generating hashes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Content Creators:</strong> Optimizing images, SEO analysis, and social assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Students & Professionals:</strong> Converting documents and quick calculations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Everyday Users:</strong> Simple <strong>online utilities tools</strong> that just work.</span>
              </li>
            </ul>

            <div className="bg-secondary/30 border border-border rounded-2xl p-8 text-center mt-12">
              <p className="text-lg font-medium text-foreground italic">
                "Stop jumping between dozens of tabs. Bookmark Aynzo Tools today and experience the power of a professional tool suite right in your browser."
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
