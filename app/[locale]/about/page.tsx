import InfoPageLayout from '@/components/common/components/InfoPageLayout';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n-config';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/about`,
            languages: {
                'x-default': 'https://tools.aynzo.com/en/about',
                ...Object.fromEntries(
                    locales.map((l) => [l, `https://tools.aynzo.com/${l}/about`])
                )
            }
        }
    };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'About' });
    
    return (
        <InfoPageLayout title={t('title')}>
            <p className="mb-6">
                <strong>AYNZO TOOLS</strong> {t('missionText')}
            </p>

            <h2>{t('whyTitle')}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                <li className="bg-secondary/20 p-6 rounded-2xl">
                    <strong className="block text-lg mb-2">{t('reason1Title')}</strong>
                    <p className="text-muted-foreground">{t('reason1Text')}</p>
                </li>
                <li className="bg-secondary/20 p-6 rounded-2xl">
                    <strong className="block text-lg mb-2">{t('reason2Title')}</strong>
                    <p className="text-muted-foreground">{t('reason2Text')}</p>
                </li>
                <li className="bg-secondary/20 p-6 rounded-2xl">
                    <strong className="block text-lg mb-2">{t('reason3Title')}</strong>
                    <p className="text-muted-foreground">{t('reason3Text')}</p>
                </li>
                <li className="bg-secondary/20 p-6 rounded-2xl">
                    <strong className="block text-lg mb-2">{t('reason4Title')}</strong>
                    <p className="text-muted-foreground">{t('reason4Text')}</p>
                </li>
            </ul>

            <h2>{t('storyTitle')}</h2>
            <p className="mb-10 lg:mb-12">
                {t('storyText')}
            </p>

            <blockquote className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-2xl text-xl italic font-medium">
                "{t('quote')}"
            </blockquote>
        </InfoPageLayout>
    );
}
