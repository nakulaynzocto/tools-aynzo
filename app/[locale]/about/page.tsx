import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import { getLocalizedUrl, getAllHreflangUrls, getXDefaultUrl } from '@/utils/locale-utils';
import { SITE_URL, OG_IMAGES } from '@/lib/constants';
import { Shield, Zap, Star, Globe, Code, Heart, ArrowRight, Users, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: getLocalizedUrl(SITE_URL, locale, '/about'),
            images: [{ url: OG_IMAGES.default, width: 1200, height: 630 }],
        },
        twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
        alternates: {
            canonical: getLocalizedUrl(SITE_URL, locale, '/about'),
            languages: {
                'x-default': getXDefaultUrl(SITE_URL, '/about'),
                ...getAllHreflangUrls(SITE_URL, locales, '/about')
            }
        }
    };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'About' });

    const values = [
        {
            icon: Shield,
            title: t('reason1Title'),
            desc: t('reason1Text'),
            gradient: 'from-indigo-600 to-violet-600',
        },
        {
            icon: Zap,
            title: t('reason2Title'),
            desc: t('reason2Text'),
            gradient: 'from-violet-600 to-purple-700',
        },
        {
            icon: Star,
            title: t('reason3Title'),
            desc: t('reason3Text'),
            gradient: 'from-indigo-500 to-blue-600',
        },
        {
            icon: Heart,
            title: t('reason4Title'),
            desc: t('reason4Text'),
            gradient: 'from-purple-600 to-indigo-700',
        },
    ];

    const stats = [
        { value: '100+', label: t('statFreeTools'), icon: Code },
        { value: '13', label: t('statLanguages'), icon: Globe },
        { value: '0%', label: t('statDataStored'), icon: Shield },
        { value: '∞', label: t('statAlwaysFree'), icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-background">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0f0a2e] to-background" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-violet-600/15 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-300 text-xs font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
                        <Users size={12} /> {t('badge')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-indigo-200/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {t('missionText')}
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* ── STATS ── */}
            <section className="py-16 border-b border-border bg-card">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="text-center">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                                <Icon size={20} />
                            </div>
                            <p className="text-3xl font-black text-foreground">{value}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-wider">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MISSION ── */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                            <Target size={12} /> {t('missionBadge')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-6">
                            {t('missionHeading')}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            {t('storyText')}
                        </p>
                        <Link
                            href="/tools"
                            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg"
                        >
                            {t('ctaExplore')} <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Visual card */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-indigo-950 to-violet-950 rounded-3xl p-8 border border-indigo-500/20 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                    <Lightbulb size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm">{t('visionTitle')}</p>
                                    <p className="text-indigo-400 text-xs">{t('visionSub')}</p>
                                </div>
                            </div>
                            <blockquote className="text-indigo-200 text-xl font-medium italic leading-relaxed">
                                &ldquo;{t('quote')}&rdquo;
                            </blockquote>
                            <div className="mt-6 pt-6 border-t border-indigo-500/20 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-black text-xs">
                                    N
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">Nakul Singh</p>
                                    <p className="text-indigo-400 text-xs">{t('founderTitle')}</p>
                                </div>
                            </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-3xl blur-xl -z-10 scale-105" />
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="py-20 bg-secondary/20 border-y border-border">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                            <Star size={12} /> {t('whyTitle')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {t('whyHeading')}
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="bg-card border border-border rounded-3xl p-7 hover:shadow-lg hover:border-primary/20 transition-all group">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-foreground mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TEAM ── */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                        <Users size={12} /> {t('meetFounderBadge')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-14">
                        {t('meetFounderTitle')}
                    </h2>

                    <div className="bg-card border border-border rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600" />

                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-4xl mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                            N
                        </div>

                        <h3 className="text-2xl font-black text-foreground mb-1">Nakul Singh</h3>
                        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">{t('founderRole')}</p>

                        <p className="text-muted-foreground leading-relaxed text-lg max-w-xl mx-auto mb-8">
                            {t('founderDesc')}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'UI/UX Design', 'SEO'].map((skill) => (
                                <span key={skill} className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 px-6 bg-card border-t border-border">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        {t('ctaSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/tools"
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:opacity-90 hover:scale-105 transition-all shadow-xl"
                        >
                            {t('ctaExplore')} <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground px-8 py-4 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all"
                        >
                            {t('ctaContact')}
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
