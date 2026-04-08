import InfoPageLayout from '@/components/common/components/InfoPageLayout';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { useTranslations } from 'next-intl';
import { getLocalizedUrl, getAllHreflangUrls, getXDefaultUrl } from '@/utils/locale-utils';
import { SITE_URL, OG_IMAGES } from '@/lib/constants';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Privacy' });
    return {
        title: t('title'),
        description: t('intro'),
        openGraph: {
            title: t('title'),
            description: t('intro'),
            url: getLocalizedUrl(SITE_URL, locale, '/privacy'),
            images: [{ url: OG_IMAGES.default, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('intro'),
        },
        alternates: {
            canonical: getLocalizedUrl(SITE_URL, locale, '/privacy'),
            languages: {
                'x-default': getXDefaultUrl(SITE_URL, '/privacy'),
                ...getAllHreflangUrls(SITE_URL, locales, '/privacy')
            }
        }
    };
}

export default function PrivacyPage() {
    const t = useTranslations('Privacy');
    return (
        <InfoPageLayout title={t('title')}>
            <p className="lead">{t('intro')}</p>

            <h2>{t('section1Title')}</h2>
            <p>{t('section1Text')}</p>

            <h2>{t('section2Title')}</h2>
            <p>{t('section2Text')}</p>

            <h2>{t('section3Title')}</h2>
            <p>{t('section3Text')}</p>

            <h2>{t('section4Title')}</h2>
            <p>{t('section4Text')}</p>

            <h2>{t('section5Title')}</h2>
            <p>{t('section5Text')}</p>
            
            <p className="mt-8 text-sm text-muted-foreground">{t('lastUpdated')}</p>
        </InfoPageLayout>
    );
}
