import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'];

function deepMergeMessages(base: any, override: any): any {
    if (Array.isArray(base) || Array.isArray(override)) {
        return override ?? base;
    }

    if (typeof base !== 'object' || base === null) return override ?? base;
    if (typeof override !== 'object' || override === null) return override ?? base;

    const merged: Record<string, any> = { ...base };
    for (const key of Object.keys(override)) {
        merged[key] = key in base
            ? deepMergeMessages(base[key], override[key])
            : override[key];
    }
    return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !locales.includes(locale as any)) {
        notFound();
    }

    const defaultMessages = (await import('./messages/en.json')).default;
    const localeMessages = locale === 'en'
        ? defaultMessages
        : (await import(`./messages/${locale}.json`)).default;

    return {
        messages: deepMergeMessages(defaultMessages, localeMessages),
        locale: locale as string
    };
});
