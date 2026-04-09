import InfoPageLayout from '@/components/common/components/InfoPageLayout';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { useTranslations } from 'next-intl';

import { getLocalizedUrl, getAllHreflangUrls, getXDefaultUrl } from '@/utils/locale-utils';
import { SITE_URL } from '@/lib/constants';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Terms' });
    const description = t('intro');
    const title = t('title');
    const image = `${SITE_URL}/og-image.png`;
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: getLocalizedUrl(SITE_URL, locale, '/terms'),
            images: [{ url: image, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
        alternates: {
            canonical: getLocalizedUrl(SITE_URL, locale, '/terms'),
            languages: {
                'x-default': getXDefaultUrl(SITE_URL, '/terms'),
                ...getAllHreflangUrls(SITE_URL, locales, '/terms')
            }
        }
    };
}

export default function TermsPage() {
    const t = useTranslations('Terms');

    return (
        <InfoPageLayout title={t('title')}>
            <p className="lead !text-lg !text-muted-foreground mb-12">{t('intro')}</p>

            <h2>{t('section1Title')}</h2>
            <p>{t('section1Text')}</p>

            <h2>{t('section2Title')}</h2>
            <p>{t('section2Text')}</p>

            <h2>{t('section3Title')}</h2>
            <p>{t('section3Text')}</p>
        </InfoPageLayout>
    );
}
