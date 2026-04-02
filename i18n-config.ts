
export const locales = ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'en' as const;
