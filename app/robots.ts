import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Only block private API routes — all tool pages must be crawlable
                disallow: ['/api/'],
            },
        ],
        sitemap: 'https://tools.aynzo.com/sitemap.xml',
    };
}
