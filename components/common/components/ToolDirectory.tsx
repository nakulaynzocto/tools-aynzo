import { Link } from '@/navigation';
import { toolCategories } from '@/lib/tools';
import { getTranslations } from 'next-intl/server';

export default async function ToolDirectory({ locale }: { locale: string }) {
    const tTools = await getTranslations({ locale, namespace: 'Tools' });
    const tCat = await getTranslations({ locale, namespace: 'Categories' });

    return (
        <section className="bg-background pt-8 pb-16 border-t border-border/30 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-wrap gap-x-8 gap-y-12">
                        {Object.entries(toolCategories).map(([category, categoryTools]) => (
                            <div key={category} className="flex-1 min-w-[200px] space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    {tCat.has(category) ? tCat(category) : category}
                                </h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    {categoryTools.map((tool) => (
                                        <Link
                                            key={tool.slug}
                                            href={`/tools/${tool.slug}`}
                                            className="text-[11px] font-medium text-muted-foreground/50 hover:text-primary transition-colors whitespace-nowrap decoration-dotted hover:underline"
                                        >
                                            {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
