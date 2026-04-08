/**
 * Locale Utilities for as-needed URL prefix logic
 * Ensures English URLs don't have /en/ prefix for better SEO
 */

export const PRIMARY_LOCALE = 'en';

/**
 * Get locale prefix for URLs based on as-needed strategy
 * - English (primary): returns '' (no prefix)
 * - Other locales: returns '/{locale}'
 */
export function getLocalePrefix(locale: string): string {
    return locale === PRIMARY_LOCALE ? '' : `/${locale}`;
}

/**
 * Check if the given locale is the primary locale (English)
 */
export function isPrimaryLocale(locale: string): boolean {
    return locale === PRIMARY_LOCALE;
}

/**
 * Get full URL with proper locale prefix
 * @param baseUrl - Base URL without trailing slash (e.g., 'https://tools.aynzo.com')
 * @param locale - Locale code (e.g., 'en', 'hi')
 * @param path - URL path starting with / (e.g., '/tools/image-compressor')
 */
export function getLocalizedUrl(baseUrl: string, locale: string, path: string = ''): string {
    const prefix = getLocalePrefix(locale);
    return `${baseUrl}${prefix}${path}`;
}

/**
 * Generate hreflang URL for a locale
 * - Primary locale: returns base URL without prefix
 * - Other locales: returns URL with locale prefix
 */
export function getHreflangUrl(baseUrl: string, locale: string, path: string = ''): string {
    return getLocalizedUrl(baseUrl, locale, path);
}

/**
 * Generate all hreflang URLs for all locales
 * Returns object suitable for Next.js metadata alternates.languages
 */
export function getAllHreflangUrls(
    baseUrl: string, 
    locales: string[], 
    path: string = ''
): Record<string, string> {
    return Object.fromEntries(
        locales.map((l) => [
            l, 
            l === PRIMARY_LOCALE 
                ? `${baseUrl}${path}` 
                : `${baseUrl}/${l}${path}`
        ])
    );
}

/**
 * Get x-default hreflang URL (always points to primary locale without prefix)
 */
export function getXDefaultUrl(baseUrl: string, path: string = ''): string {
    return `${baseUrl}${path}`;
}

/**
 * Rewrite all internal links in an HTML string to match the current locale and prefix strategy.
 * Useful for rich text content from SEO config or JSON blogs.
 */
export function localizeHtmlLinks(html: string, locale: string): string {
    const prefix = getLocalePrefix(locale);
    const domain = 'tools.aynzo.com';
    
    return html
        // 1. Rewrite full domain links: https://tools.aynzo.com/en/tools -> https://tools.aynzo.com/tools
        .replace(new RegExp(`href="https://${domain}/(?:en|hi|pt|es|id|de|fr|ja|ru|tr|it|ko|zh|ar|x-default)/`, 'g'), `href="https://${domain}${prefix}/`)
        // 2. Rewrite relative locale links: href="/en/tools" -> href="/tools"
        .replace(/href="\/(?:en|hi|pt|es|id|de|fr|ja|ru|tr|it|ko|zh|ar|x-default)\//g, `href="${prefix}/`)
        // 3. Rewrite relative root links: href="/tools" -> href="/hi/tools" (only if not English)
        .replace(/href="\/(?!http|https|mailto|tel)([^\/"]+)/g, (match, p1) => {
            const isSupportedLocale = ['en','hi','pt','es','id','de','fr','ja','ru','tr','it','ko','zh','ar'].includes(p1);
            if (!isSupportedLocale && prefix !== '') {
                return `href="${prefix}/${p1}`;
            }
            return match;
        });
}
