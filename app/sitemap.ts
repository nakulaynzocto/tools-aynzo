import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { locales } from '@/i18n';
import fs from 'fs';
import path from 'path';

import { getCachedMatches } from '@/lib/tools/cricket/cache';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://tools.aynzo.com';
    let allPages: MetadataRoute.Sitemap = [];

    // Fetch dynamic cricket matches
    const matches = await getCachedMatches().catch(() => []);

    const blogsDir = path.join(process.cwd(), 'seo-blogs');
    const blogFiles = fs.existsSync(blogsDir) 
        ? fs.readdirSync(blogsDir).filter(f => f.endsWith('.json') && !f.startsWith('_'))
        : [];
    const blogSlugs = blogFiles.map(f => f.replace('.json', ''));

    const staticPages = ['', '/blog', '/about', '/contact', '/privacy', '/terms'];

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

        // Cricket Pages (Dynamic SEO)
        allPages.push({
            url: `${baseUrl}/${locale}/tools/cricket/ai-predictor`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
            alternates: getAlternateLanguages('/tools/cricket/ai-predictor'),
        });

        matches.forEach((match) => {
            const urlSlug = match.slug || match.event_key;
            allPages.push({
                url: `${baseUrl}/${locale}/tools/cricket/${urlSlug}`,
                lastModified: new Date(),
                changeFrequency: 'always', // Highly dynamic
                priority: 0.8,
                alternates: getAlternateLanguages(`/tools/cricket/${urlSlug}`),
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
