import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'],
    defaultLocale: 'en',
    // Use 'always' so /en/... paths are always used (never strip locale prefix from canonical URL)
    localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
