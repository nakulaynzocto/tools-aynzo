import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'],
    defaultLocale: 'en',
    // Use 'as-needed' so English URLs don't have /en/ prefix (better for SEO)
    localePrefix: 'as-needed',
    // Disable locale detection to prevent 307 redirects for root URLs, which breaks hreflang and GSC validation
    localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
