"use client";
import { useTranslations } from 'next-intl';

interface TextToolContentProps {
    type: string;
}

export function TextToolContent({ type }: TextToolContentProps) {
    const t = useTranslations('TextToolContent');

    if (type !== 'word-counter') return null;

    return (
        <div className="mt-12 space-y-8 animate-in fade-in duration-700">
            {/* Intro Section */}
            <div className="bg-card/50 rounded-2xl p-6 sm:p-8 border border-border">
                <h2 className="text-2xl sm:text-3xl font-black mb-4 text-foreground">{t('word-counter.title')}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                    {t.rich('word-counter.intro', {
                        strong: (chunks) => <strong className="font-bold text-foreground">{chunks}</strong>
                    })}
                </p>
            </div>

            {/* How to Use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                    <h2 className="text-xl sm:text-2xl font-black mb-6 text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                        {t('word-counter.howToUseTitle')}
                    </h2>
                    <ul className="space-y-4">
                        {[0, 1, 2, 3].map((i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span>{t(`word-counter.howToUseSteps.${i}`)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Features */}
                <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                    <h2 className="text-xl sm:text-2xl font-black mb-6 text-foreground flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 text-sm">2</span>
                        {t('word-counter.featuresTitle')}
                    </h2>
                    <ul className="space-y-4">
                        {[0, 1, 2, 3].map((i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>
                                    {t.rich(`word-counter.features.${i}`, {
                                        strong: (chunks) => <strong className="font-bold text-foreground">{chunks}</strong>
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
                <h2 className="text-2xl sm:text-3xl font-black mb-8 text-foreground text-center">{t('word-counter.faqTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="bg-muted/30 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-3 text-foreground">{t(`word-counter.faq.${i}.q`)}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{t(`word-counter.faq.${i}.a`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
