import InfoPageLayout from '@/components/common/components/InfoPageLayout';
import { Mail } from 'lucide-react';
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
    const t = await getTranslations({ locale, namespace: 'Contact' });
    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: getLocalizedUrl(SITE_URL, locale, '/contact'),
            images: [{ url: OG_IMAGES.default, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
        },
        alternates: {
            canonical: getLocalizedUrl(SITE_URL, locale, '/contact'),
            languages: {
                'x-default': getXDefaultUrl(SITE_URL, '/contact'),
                ...getAllHreflangUrls(SITE_URL, locales, '/contact')
            }
        }
    };
}

export default function ContactPage() {
    const t = useTranslations('Contact');

    return (
        <InfoPageLayout title={t('title')}>
            <p className="text-xl text-muted-foreground mb-12">
                {t('intro')}
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-start mt-8">
                <div className="bg-primary/5 rounded-[2rem] p-10 border border-primary/10">
                    <h3 className="text-xl font-bold mb-8 text-primary uppercase tracking-widest">Contact Information</h3>
                    <div className="space-y-8">
                        <div className="flex items-center gap-5 group">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg active:scale-90">
                                <Mail className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-tight mb-1">Email Support</p>
                                <p className="text-lg font-bold">support@aynzo.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border-2 border-border shadow-xl rounded-[2.5rem] p-10">
                    <h3 className="text-2xl font-black mb-4 tracking-tight">{t('formTitle')}</h3>
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{t('formPlaceholder')}</p>
                    <button className="bg-primary text-primary-foreground h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs w-full hover:scale-[1.03] transition-all active:scale-95 shadow-xl shadow-primary/30">
                        {t('button')}
                    </button>
                </div>
            </div>
        </InfoPageLayout>
    );
}
