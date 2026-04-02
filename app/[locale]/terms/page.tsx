import InfoPageLayout from '@/components/common/components/InfoPageLayout';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n-config';
import { useTranslations } from 'next-intl';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Terms' });
    return {
        title: t('title'),
        description: t('intro'),
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/terms`
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
