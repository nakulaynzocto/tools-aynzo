import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
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
        openGraph: { title: t('title'), description: t('intro'), url: getLocalizedUrl(SITE_URL, locale, '/privacy'), images: [{ url: OG_IMAGES.default, width: 1200, height: 630 }] },
        twitter: { card: 'summary_large_image', title: t('title'), description: t('intro') },
        alternates: { canonical: getLocalizedUrl(SITE_URL, locale, '/privacy'), languages: { 'x-default': getXDefaultUrl(SITE_URL, '/privacy'), ...getAllHreflangUrls(SITE_URL, locales, '/privacy') } }
    };
}

export default async function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Privacy' });

    const sections = [
        { id: 's1', title: t('section1Title'), text: t('section1Text') },
        { id: 's2', title: t('section2Title'), text: t('section2Text') },
        { id: 's3', title: t('section3Title'), text: t('section3Text') },
        { id: 's4', title: t('section4Title'), text: t('section4Text') },
        { id: 's5', title: t('section5Title'), text: t('section5Text') },
        {
            id: 's6',
            title: '6. Advertising & Cookies',
            text: 'We use Google AdSense to display advertisements on this site. Google AdSense uses cookies to serve ads based on your prior visits to our website and other sites on the internet. You may opt out of personalized advertising by visiting Google\'s Ads Settings at adssettings.google.com. We also use Google Analytics with anonymized IPs to understand aggregate site traffic. No personally identifiable information is ever collected or stored by Aynzo Tools.'
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">

                {/* Header */}
                <div className="border-b border-border pb-10 mb-10">
                    <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-3">Legal</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">{t('intro')}</p>
                    <p className="text-xs text-muted-foreground/60 mt-4 font-medium">{t('lastUpdated')}</p>
                </div>

                {/* Document layout — sidebar + content */}
                <div className="grid lg:grid-cols-4 gap-12">

                    {/* Sticky TOC */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">On this page</p>
                            <nav className="space-y-2">
                                {sections.map((s) => (
                                    <a key={s.id} href={`#${s.id}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 border-l-2 border-border hover:border-primary pl-3">
                                        {s.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-12">
                        {sections.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-24">
                                <h2 className="text-xl font-black text-foreground mb-4 pb-3 border-b border-border">
                                    {section.title}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                            </div>
                        ))}

                        {/* Contact prompt */}
                        <div className="mt-12 p-6 bg-secondary/40 rounded-2xl border border-border">
                            <p className="text-sm font-bold text-foreground mb-1">Questions about this policy?</p>
                            <p className="text-sm text-muted-foreground">
                                Contact us at <a href="mailto:support@aynzo.com" className="text-primary font-semibold hover:underline">support@aynzo.com</a> and we'll respond within 24 hours.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
