import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Disallow non-locale tool URLs to prevent duplicate content
            disallow: ['/api/', '/tools/'],
        },
        sitemap: 'https://tools.aynzo.com/sitemap.xml',
    };
}
