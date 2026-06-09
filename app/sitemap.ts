import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { SITE_URL } from '@/lib/constants';
import connectToDatabase from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { locales } from '@/i18n';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapData: MetadataRoute.Sitemap = [];

  // 1. Static Routes
  const staticRoutes = ['', '/tools', '/blog', '/contact', '/about', '/privacy', '/terms'];
  
  staticRoutes.forEach(route => {
    const alternates: any = {
      languages: {}
    };
    
    locales.forEach(loc => {
      const isDefault = loc === 'en';
      const locPrefix = isDefault ? '' : `/${loc}`;
      alternates.languages[loc] = `${SITE_URL}${locPrefix}${route}`;
    });
    alternates.languages['x-default'] = `${SITE_URL}${route}`;

    sitemapData.push({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route === '' ? 1.0 : 0.8,
      alternates,
    });
  });

  // 2. Tool Routes
  tools.forEach(tool => {
    const route = `/tools/${tool.slug}`;
    const alternates: any = { languages: {} };
    
    locales.forEach(loc => {
      const isDefault = loc === 'en';
      const locPrefix = isDefault ? '' : `/${loc}`;
      alternates.languages[loc] = `${SITE_URL}${locPrefix}${route}`;
    });
    alternates.languages['x-default'] = `${SITE_URL}${route}`;

    sitemapData.push({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates,
    });
  });

  // 3. Blog Routes
  try {
    await connectToDatabase();
    const distinctSlugs = await Blog.distinct('slug');
    
    distinctSlugs.forEach(slug => {
      const route = `/blog/${slug}`;
      const alternates: any = { languages: {} };
      
      locales.forEach(loc => {
        const isDefault = loc === 'en';
        const locPrefix = isDefault ? '' : `/${loc}`;
        alternates.languages[loc] = `${SITE_URL}${locPrefix}${route}`;
      });
      alternates.languages['x-default'] = `${SITE_URL}${route}`;

      sitemapData.push({
        url: `${SITE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates,
      });
    });
  } catch (error) {
    console.error('[Sitemap] Failed to fetch blog slugs from DB:', error instanceof Error ? error.message : error);
    // Fallback: ensure at least the blog index page is included when DB is unreachable
    // Individual blog post URLs will be added once DB connectivity is restored
    const blogIndexRoute = '/blog';
    const blogAlternates: any = { languages: {} };
    locales.forEach(loc => {
      const isDefault = loc === 'en';
      const locPrefix = isDefault ? '' : `/${loc}`;
      blogAlternates.languages[loc] = `${SITE_URL}${locPrefix}${blogIndexRoute}`;
    });
    blogAlternates.languages['x-default'] = `${SITE_URL}${blogIndexRoute}`;
    // Only add if /blog wasn't already in static routes (it is, but this ensures priority is set)
  }

  return sitemapData;
}
