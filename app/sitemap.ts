import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';
import { locales } from '@/i18n';
import { getLocalePrefix, isPrimaryLocale, PRIMARY_LOCALE } from '@/utils/locale-utils';
import fs from 'fs';
import path from 'path';

// Ensure filesystem access works reliably for sitemap generation.
export const runtime = 'nodejs';

// Helper to get file modification date for realistic lastModified
function getLastModifiedDate(filePath: string): Date {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime;
    } catch {
        return new Date('2024-01-01'); // fallback date
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    try {
        const baseUrl = 'https://tools.aynzo.com';
        let allPages: MetadataRoute.Sitemap = [];

        const staticPages = ['', '/tools', '/blog', '/about', '/contact', '/privacy', '/terms'];
        
        // Get build date for static pages (use package.json modification time)
        const buildDate = getLastModifiedDate(path.join(process.cwd(), 'package.json'));

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

        const getAlternateLanguages = (pagePath: string) => {
            const languages: Record<string, string> = {};
            // x-default should point to the primary locale without a locale prefix
            languages['x-default'] = `${baseUrl}${pagePath}`;
            locales.forEach((l) => {
                languages[l] = l === PRIMARY_LOCALE ? `${baseUrl}${pagePath}` : `${baseUrl}/${l}${pagePath}`;
            });
            return { languages };
        };

        // Generate sitemap entries for all locales, but primary locale URLs omit the locale prefix
        locales.forEach((locale) => {
            const isPrimary = isPrimaryLocale(locale);
            const localePrefix = getLocalePrefix(locale);
            // Static Pages
            staticPages.forEach((pagePath) => {
                const url = `${baseUrl}${localePrefix}${pagePath}`;
                if (url.includes('?')) return; // skip parameter URLs
                allPages.push({
                    url,
                    lastModified: buildDate,
                    changeFrequency: pagePath === '' ? 'daily' : 'monthly',
                    priority: pagePath === '' ? 1 : 0.7,
                    alternates: getAlternateLanguages(pagePath),
                });
            });

            // Tools with AUTOMATIC category-based priority (scales to 150+ tools)
            // Priority hierarchy based on search demand & business value
            const categoryPriority: Record<string, { priority: number; frequency: 'daily' | 'weekly' | 'monthly' }> = {
                // High demand categories (0.8-0.9 priority)
                image: { priority: 0.85, frequency: 'daily' },
                pdf: { priority: 0.8, frequency: 'daily' },
                youtube: { priority: 0.85, frequency: 'daily' },
                seo: { priority: 0.8, frequency: 'weekly' },
                security: { priority: 0.8, frequency: 'weekly' }, // Includes Password generator, etc.
                
                // Medium demand (0.6-0.7 priority)
                converter: { priority: 0.7, frequency: 'weekly' },
                text: { priority: 0.65, frequency: 'weekly' },
                developer: { priority: 0.7, frequency: 'weekly' }, // Replaces dev/formatter
                calculator: { priority: 0.65, frequency: 'weekly' },
                
                // Lower demand (0.4-0.5 priority)
                utility: { priority: 0.5, frequency: 'monthly' },
                crypto: { priority: 0.5, frequency: 'monthly' },
                social: { priority: 0.5, frequency: 'monthly' },
            };
            
            tools.forEach((tool) => {
                const url = `${baseUrl}${localePrefix}/tools/${tool.slug}`;
                if (url.includes('?')) return;
                
                // Get priority based on category (falls back to default if unknown)
                const config = categoryPriority[tool.category] || { priority: 0.5, frequency: 'monthly' };
                
                // Boost priority for "published" status tools
                const statusBoost = tool.status === 'published' ? 0.05 : 0;
                const finalPriority = Math.min(config.priority + statusBoost, 1.0);
                
                // Use build date for tools (tools don't change frequently)
                const toolFileDate = getLastModifiedDate(path.join(process.cwd(), 'lib', 'tools.ts'));
                
                allPages.push({
                    url,
                    lastModified: toolFileDate,
                    changeFrequency: config.frequency,
                    priority: finalPriority,
                    alternates: getAlternateLanguages(`/tools/${tool.slug}`),
                });
            });

            // Blogs
            blogSlugs.forEach((slug) => {
                const url = `${baseUrl}${localePrefix}/blog/${slug}`;
                if (url.includes('?')) return;
                
                // Get actual file modification date for blog posts
                const blogFilePath = path.join(process.cwd(), 'seo-blogs', isPrimary ? '' : locale, `${slug}.json`);
                const blogDate = fs.existsSync(blogFilePath) 
                    ? getLastModifiedDate(blogFilePath)
                    : getLastModifiedDate(path.join(process.cwd(), 'seo-blogs', `${slug}.json`));
                
                allPages.push({
                    url,
                    lastModified: blogDate,
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
    } catch {
        const baseUrl = 'https://tools.aynzo.com';
        const fallbackDate = new Date();
        return [
            {
                url: baseUrl,
                lastModified: fallbackDate,
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/tools`,
                lastModified: fallbackDate,
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/blog`,
                lastModified: fallbackDate,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
        ];
    }
}
