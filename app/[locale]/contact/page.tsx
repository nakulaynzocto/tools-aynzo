import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { getLocalizedUrl, getAllHreflangUrls, getXDefaultUrl } from '@/utils/locale-utils';
import { SITE_URL, OG_IMAGES } from '@/lib/constants';
import { Mail, Clock, MapPin } from 'lucide-react';
import ContactForm from '@/components/common/components/ContactForm';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Contact' });
    return {
        title: t('title'),
        description: t('description'),
        openGraph: { title: t('title'), description: t('description'), url: getLocalizedUrl(SITE_URL, locale, '/contact'), images: [{ url: OG_IMAGES.default, width: 1200, height: 630 }] },
        twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
        alternates: { canonical: getLocalizedUrl(SITE_URL, locale, '/contact'), languages: { 'x-default': getXDefaultUrl(SITE_URL, '/contact'), ...getAllHreflangUrls(SITE_URL, locales, '/contact') } }
    };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">

                {/* Simple page header — no hero, just clean typography */}
                <div className="mb-16">
                    <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-3">Contact</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                        Get in touch
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">{t('intro')}</p>
                </div>

                {/* Main layout — two columns */}
                <div className="grid lg:grid-cols-5 gap-12">

                    {/* Left — Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Contact Info</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">Email</p>
                                        <p className="text-muted-foreground text-sm mt-0.5">support@aynzo.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">Response Time</p>
                                        <p className="text-muted-foreground text-sm mt-0.5">Within 24 hours, Mon–Sat</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">Based In</p>
                                        <p className="text-muted-foreground text-sm mt-0.5">India 🇮🇳 — Serving worldwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-8">
                            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Before You Write</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Most tool questions are answered in the FAQ section on each tool page. Check there first — you may get an instant answer without waiting.
                            </p>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-card border border-border rounded-2xl p-8">
                            <h2 className="text-xl font-black text-foreground mb-1">{t('formTitle')}</h2>
                            <p className="text-sm text-muted-foreground mb-8">We read every message personally.</p>
                            <ContactForm />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
