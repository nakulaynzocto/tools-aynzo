import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { locales } from '@/i18n';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tools.aynzo.com';
    let allPages: MetadataRoute.Sitemap = [];

    const staticPages = ['', '/tools', '/blog', '/about', '/contact', '/privacy', '/terms'];

    const getBlogSlugs = () => {
        const slugs = new Set<string>();
        
        // Scan main English directory
        const mainBlogsDir = path.join(process.cwd(), 'seo-blogs');
        if (fs.existsSync(mainBlogsDir)) {
            fs.readdirSync(mainBlogsDir)
              .filter(f => f.endsWith('.json') && !f.startsWith('_'))
              .forEach(f => slugs.add(f.replace('.json', '')));
        }

        // Scan all localized subdirectories
        locales.forEach(loc => {
            const locBlogsDir = path.join(process.cwd(), 'seo-blogs', loc);
            if (fs.existsSync(locBlogsDir)) {
                fs.readdirSync(locBlogsDir)
                  .filter(f => f.endsWith('.json') && !f.startsWith('_'))
                  .forEach(f => slugs.add(f.replace('.json', '')));
            }
        });

        return Array.from(slugs);
    };

    const blogSlugs = getBlogSlugs();

    const getAlternateLanguages = (path: string) => {
        const languages: Record<string, string> = {};
        // x-default should point to the primary locale without a locale prefix
        languages['x-default'] = `${baseUrl}${path}`;
        locales.forEach((l) => {
            languages[l] = `${baseUrl}/${l}${path}`;
        });
        return { languages };
    };
    const primaryLocale = 'en';

    // Generate sitemap entries for all locales, but primary locale URLs omit the locale prefix
    locales.forEach((locale) => {
        const isPrimary = locale === primaryLocale;
        const localePrefix = isPrimary ? '' : `/${locale}`;
        // Static Pages
        staticPages.forEach((pagePath) => {
            const url = `${baseUrl}${localePrefix}${pagePath}`;
            if (url.includes('?')) return; // skip parameter URLs
            allPages.push({
                url,
                lastModified: new Date(),
                changeFrequency: pagePath === '' ? 'daily' : 'monthly',
                priority: pagePath === '' ? 1 : 0.7,
                alternates: getAlternateLanguages(pagePath),
            });
        });

        // Tools
        tools.forEach((tool) => {
            const url = `${baseUrl}${localePrefix}/tools/${tool.slug}`;
            if (url.includes('?')) return;
            allPages.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
                alternates: getAlternateLanguages(`/tools/${tool.slug}`),
            });
        });

        // Blogs
        blogSlugs.forEach((slug) => {
            const url = `${baseUrl}${localePrefix}/blog/${slug}`;
            if (url.includes('?')) return;
            allPages.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternateLanguages(`/blog/${slug}`),
            });
        });
    });

    // Deduplicate URLs while preserving order
    const seen = new Set<string>();
    const uniquePages: MetadataRoute.Sitemap = [];
    for (const entry of allPages) {
        if (!seen.has(entry.url)) {
            seen.add(entry.url);
            uniquePages.push(entry);
        }
    }
    return uniquePages;
}
