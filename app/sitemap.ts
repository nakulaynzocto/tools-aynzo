import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { locales } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tools.aynzo.com';

    let allPages: MetadataRoute.Sitemap = [];

    locales.forEach((locale) => {
        // Home page for this locale
        allPages.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        });

        // All tools for this locale
        const toolPages = tools.map((tool) => ({
            url: `${baseUrl}/${locale}/tools/${tool.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        allPages = [...allPages, ...toolPages];
    });

    return allPages;
}
