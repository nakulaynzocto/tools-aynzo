import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { locales, defaultLocale } from './i18n-config';

export const routing = defineRouting({
    locales,
    defaultLocale,
    // Use 'always' so /en/... paths are always used (never strip locale prefix from canonical URL)
    localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
