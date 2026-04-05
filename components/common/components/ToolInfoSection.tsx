interface ToolInfoSectionProps {
    name: string;
    description: string;
    content?: string;
}

import { useTranslations } from 'next-intl';
import { ListTree, CheckCircle2, ShieldCheck, Microscope } from 'lucide-react';

export function ToolInfoSection({ name, description, content }: ToolInfoSectionProps) {
    const t = useTranslations('Common');
    
    // 1. Process Content: Inject IDs into H2s and H3s for TOC scrolling
    let tocItems: { id: string; text: string; level: number }[] = [];
    let processedContent = content || "";

    if (content) {
        let headingIndex = 0;
        processedContent = content.replace(/<(h2|h3)[^>]*>(.*?)<\/\1>/gi, (match, tag, text) => {
            const id = `section-${headingIndex++}`;
            const cleanText = text.replace(/<[^>]*>/g, '').trim();
            tocItems.push({ id, text: cleanText, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
            return `<${tag} id="${id}">${text}</${tag}>`;
        });
    }

    return (
        <div className="space-y-8 mt-12 mb-16" id="seo-content">
            {/* E-E-A-T / Trust Badges Section */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border/50">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Formula Verified
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Expert Reviewed
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                    <Microscope className="w-3.5 h-3.5" />
                    Scientifically Precise
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 2. Table of Contents (Sticky Sidebar) */}
                {tocItems.length > 2 && (
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 p-5 rounded-2xl bg-muted/30 border border-border/50">
                            <h4 className="flex items-center gap-2 font-black text-foreground mb-4 uppercase text-xs tracking-widest opacity-60">
                                <ListTree className="w-4 h-4 text-primary" />
                                On this page
                            </h4>
                            <nav className="space-y-3">
                                {tocItems.map((item, i) => (
                                    <a 
                                        key={i}
                                        href={`#${item.id}`}
                                        className={`block text-sm transition-colors hover:text-primary ${item.level === 3 ? 'ml-4 opacity-70 italic' : 'font-bold text-foreground/80'}`}
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>
                )}

                {/* 3. Main Content Body */}
                <div className={`${tocItems.length > 2 ? 'lg:col-span-3' : 'lg:col-span-4'} bg-card rounded-2xl border border-border/50 p-6 sm:p-10 shadow-sm`}>
                    {content ? (
                        <div
                            className="content-body max-w-none prose prose-lg dark:prose-invert 
                                prose-headings:font-black prose-headings:tracking-tight
                                prose-h2:text-3xl prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4 prose-h2:mb-6
                                prose-p:leading-loose prose-p:text-muted-foreground
                                prose-strong:text-foreground prose-strong:font-bold
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: processedContent }}
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
            </div>
        </div>
    );
}
