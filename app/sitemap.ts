import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { locales } from '@/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tools.aynzo.com';

    let allPages: MetadataRoute.Sitemap = [];

    const alternateLanguages = (path: string) => {
        const languages: Record<string, string> = {};
        locales.forEach((l) => {
            languages[l] = `${baseUrl}/${l}${path}`;
        });
        return { languages };
    };

    locales.forEach((locale) => {
        // Home page for this locale
        allPages.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
            alternates: alternateLanguages(''),
        });

        // All tools for this locale
        tools.forEach((tool) => {
            allPages.push({
                url: `${baseUrl}/${locale}/tools/${tool.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
                alternates: alternateLanguages(`/tools/${tool.slug}`),
            });
        });
    });

    return allPages;
}
