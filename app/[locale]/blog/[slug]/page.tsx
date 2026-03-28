import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { Link } from '@/navigation';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import { RelatedTools } from '@/components/common/components/RelatedTools';
import { toolCategories } from '@/lib/tools';

export async function generateStaticParams() {
  const allParams = [];
  for (const locale of locales) {
    const blogsDir = locale === 'en' 
      ? path.join(process.cwd(), 'seo-blogs')
      : path.join(process.cwd(), 'seo-blogs', locale);
    
    if (fs.existsSync(blogsDir)) {
      const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
      for (const file of files) {
        const blogData = JSON.parse(fs.readFileSync(path.join(blogsDir, file), 'utf-8'));
        allParams.push({ locale, slug: blogData.slug });
      }
    }
  }
  return allParams;
}

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string, slug: string } }): Promise<Metadata> {
  const blogsDir = locale === 'en' 
    ? path.join(process.cwd(), 'seo-blogs')
    : path.join(process.cwd(), 'seo-blogs', locale);
    
  if (!fs.existsSync(blogsDir)) return {};

  const fileFound = fs.readdirSync(blogsDir).find(f => f.includes(slug));
  if (!fileFound) return {};

  const blog = JSON.parse(fs.readFileSync(path.join(blogsDir, fileFound), 'utf-8'));

  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    keywords: blog.tags.join(', '),
    alternates: {
      canonical: `https://tools.aynzo.com/${locale}/blog/${slug}`,
      languages: locales.reduce((acc: any, loc) => {
        acc[loc] = `https://tools.aynzo.com/${loc}/blog/${slug}`;
        return acc;
      }, {})
    },
    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDescription,
      url: `https://tools.aynzo.com/${locale}/blog/${slug}`,
      type: 'article',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      tags: blog.tags,
      images: [
        {
          url: 'https://tools.aynzo.com/og-blog.png',
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle,
      description: blog.metaDescription,
      images: ['https://tools.aynzo.com/og-blog.png'],
    }
  };
}

export default async function BlogDetailPage({ params: { locale, slug } }: { params: { locale: string, slug: string } }) {
  const blogsDir = locale === 'en' 
    ? path.join(process.cwd(), 'seo-blogs')
    : path.join(process.cwd(), 'seo-blogs', locale);
    
  if (!fs.existsSync(blogsDir)) notFound();

  const fileFound = fs.readdirSync(blogsDir).find(f => f.includes(slug));
  if (!fileFound) notFound();

  const blog = JSON.parse(fs.readFileSync(path.join(blogsDir, fileFound), 'utf-8'));
  const t = await getTranslations({ locale, namespace: 'Blog' });

  const cleanContent = blog.content.replace(/^\s*<h1[^>]*>.*?<\/h1>/i, '').trim();

  return (
    <article className="bg-background min-h-screen pb-24">
      {/* Article Header - Large & Modern */}
      <header className="relative pt-24 pb-16 px-6 border-b border-border/40 bg-secondary/10 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-12 hover:-translate-x-1 transition-transform bg-primary/5 px-4 py-2 rounded-full">
            <ArrowLeft size={16} /> {t('backToBlog')}
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 text-xs font-black tracking-widest text-primary/60 uppercase mb-8">
              <span className="px-3 py-1 bg-primary/5 rounded-md border border-primary/10">{blog.category}</span>
              <span className="w-1 h-1 rounded-full bg-primary/20"></span>
              <span className="flex items-center gap-1.5"><Calendar size={14}/> {blog.publishedAt}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground mb-12 leading-[1.1]">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border/40 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-foreground/80 font-bold uppercase tracking-wider">
                <Clock size={16} className="text-primary"/> {blog.readTime}
              </div>
              {/* Social Share Pills */}
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Linkedin, Copy].map((Icon, i) => (
                  <button key={i} className="h-10 w-10 flex items-center justify-center bg-card border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all rounded-full ring-1 ring-border">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content - Clean Typography */}
      <div className="max-w-4xl mx-auto px-6 pt-20">
        <div 
          className="content-body max-w-none selection:bg-primary/20"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
        
        {/* Author Footer (Minimal) */}
        <footer className="mt-40 p-12 bg-secondary/30 rounded-[3rem] border-2 border-border/40 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('aboutAynzo')}</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Aynzo provides 100+ high-quality online tools to help everyone from developers to writers streamline their digital workflow with privacy first.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
               Explore Tools <ArrowLeft className="rotate-180" size={16}/>
            </Link>
        </footer>
      </div>
      
      {/* Schema.org Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.metaDescription,
            "datePublished": blog.publishedAt,
            "dateModified": blog.updatedAt,
            "author": {
              "@type": "Organization",
              "name": "Aynzo Tools",
              "url": "https://tools.aynzo.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Aynzo Tools",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tools.aynzo.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://tools.aynzo.com/${locale}/blog/${slug}`
            }
          })
        }}
      />
    </article>
  );
}
