import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AYNZO TOOLS';
    const siteDesc = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Fast, secure, and free online tools for daily tasks.';

    return {
        name: siteName,
        short_name: 'AYNZO',
        description: siteDesc,
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
