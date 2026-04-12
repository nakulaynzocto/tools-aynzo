import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/_next/static/',
                    '/_next/image/',
                    '/assets/',
                    '/favicon.ico',
                    '/sitemap.xml',
                ],
                // Block private API routes and internal Next.js paths that shouldn't be indexed
                disallow: [
                    '/api/',
                    '/_next/data/',
                ],
            },
        ],
        sitemap: 'https://tools.aynzo.com/sitemap.xml',
    };
}
