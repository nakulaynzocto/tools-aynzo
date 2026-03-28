import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { Link } from '@/navigation';
import fs from 'fs';
import path from 'path';
import { BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return {
    title: t('metaTitle') || 'Blog - Aynzo Tools',
    description: t('metaDescription') || 'Read the latest guides and tutorials on using online tools for productivity and SEO.',
    alternates: {
      canonical: `https://tools.aynzo.com/${locale}/blog`
    }
  };
}

export default async function BlogListPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Blog' });
  
  // Read blogs from seo-blogs directory
  // For 'en', use root seo-blogs. For others, use subdirectory.
  const blogsDir = locale === 'en' 
    ? path.join(process.cwd(), 'seo-blogs')
    : path.join(process.cwd(), 'seo-blogs', locale);
    
  let blogs: any[] = [];
  
  if (fs.existsSync(blogsDir)) {
    const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
    blogs = files.map(file => {
      const content = fs.readFileSync(path.join(blogsDir, file), 'utf-8');
      return JSON.parse(content);
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link 
                key={blog.slug} 
                href={`/blog/${blog.slug}`}
                className="group relative bg-card border-2 border-border/50 rounded-[2.5rem] p-8 hover:border-primary/30 hover:shadow-2xl transition-all h-full flex flex-col"
              >
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                  <span className="px-3 py-1 bg-primary/10 rounded-full">{blog.category}</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                  {blog.title}
                </h2>
                
                <p className="text-muted-foreground line-clamp-3 mb-8 flex-grow">
                  {blog.metaDescription}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-border/40 mt-auto">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {blog.publishedAt}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14}/> {blog.readTime}</span>
                  </div>
                  <ChevronRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-border rounded-[3rem]">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-6 opacity-20" />
            <p className="text-xl text-muted-foreground">{t('noPosts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
