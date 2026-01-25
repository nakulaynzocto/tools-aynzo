"use client";
import { Link } from '@/navigation';
import { tools } from '@/lib/tools';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RelatedToolsProps {
    currentSlug: string;
    category: string;
}

export function RelatedTools({ currentSlug, category }: RelatedToolsProps) {
    const t = useTranslations('Common');
    const tTools = useTranslations('Tools');

    // Filter tools in the same category first (Priority 1)
    const related = tools
        .filter(t => t.category === category && t.slug !== currentSlug)
        .slice(0, 3); // Top 3 Related

    // If we need more, get popular tools from other categories (Priority 2)
    if (related.length < 3) {
        const others = tools
            .filter(t => t.category !== category && t.slug !== currentSlug)
            // Fix Hydration Error: Removed Math.random(). Use deterministic sort or simple slice.
            .slice(0, 3 - related.length);
        related.push(...others);
    }

    return (
        <section className="mt-16 py-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        {t('relatedTools')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        More free tools you might like
                    </p>
                </div>
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                    {t('viewAll')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((tool) => (
                    <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="group relative flex flex-col p-6 bg-card hover:bg-gradient-to-br hover:from-card hover:to-accent/5 border border-border rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                        <div className="relative z-10 flex items-start justify-between">
                            <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors text-primary">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                                Free
                            </span>
                        </div>

                        <div className="relative z-10 mt-4 space-y-2">
                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {tTools.has(`${tool.slug}.description`) ? tTools(`${tool.slug}.description`) : tool.description}
                            </p>
                        </div>

                        <div className="relative z-10 mt-auto pt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            Try Tool <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
