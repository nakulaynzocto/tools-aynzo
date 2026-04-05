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
        languages['x-default'] = `${baseUrl}/en${path}`;
        locales.forEach((l) => {
            languages[l] = `${baseUrl}/${l}${path}`;
        });
        return { languages };
    };

    locales.forEach((locale) => {
        // Static Pages
        staticPages.forEach((pagePath) => {
            allPages.push({
                url: `${baseUrl}/${locale}${pagePath}`,
                lastModified: new Date(),
                changeFrequency: pagePath === '' ? 'daily' : 'monthly',
                priority: pagePath === '' ? 1 : 0.7,
                alternates: getAlternateLanguages(pagePath),
            });
        });

        // Tools
        tools.forEach((tool) => {
            allPages.push({
                url: `${baseUrl}/${locale}/tools/${tool.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
                alternates: getAlternateLanguages(`/tools/${tool.slug}`),
            });
        });

        // Blogs
        blogSlugs.forEach((slug) => {
            allPages.push({
                url: `${baseUrl}/${locale}/blog/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternateLanguages(`/blog/${slug}`),
            });
        });
    });

    return allPages;
}
