interface ToolInfoSectionProps {
    name: string;
    description: string;
    content?: string;
}

import { useTranslations } from 'next-intl';

export function ToolInfoSection({ name, description, content }: ToolInfoSectionProps) {
    const t = useTranslations('Common');
    return (
        <div className="bg-card rounded-xl border-2 border-border p-5 shadow-lg">
            {content ? (
                <div
                    className="prose md:prose-lg dark:prose-invert max-w-none text-muted-foreground prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: content }}
                    suppressHydrationWarning={true}
                />
            ) : (
                <>
                    <h3 className="text-xl font-bold text-primary mb-3">
                        {t('howToUse', { name })}
                    </h3>
                    <div className="prose prose-lg max-w-none text-muted-foreground/90">
                        <p className="leading-relaxed mb-4">
                            {t('toolIntro', { description: description.toLowerCase() })}
                        </p>

                        <h4 className="text-lg font-semibold text-primary mt-4 mb-2">{t('keyFeatures')}</h4>
                        <ul className="space-y-1.5">
                            <li className="flex items-start gap-2">
                                <span className="text-accent font-bold">✓</span>
                                <span>{t('featureFast')}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent font-bold">✓</span>
                                <span>{t('featureSimple')}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent font-bold">✓</span>
                                <span>{t('featureNoInstall')}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent font-bold">✓</span>
                                <span>{t('featureFree')}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent font-bold">✓</span>
                                <span>{t('featurePrivacy')}</span>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
