import { ToolCard } from '@/components/ToolCard';
import { tools } from '@/lib/tools';
import { useTranslations } from 'next-intl';
import {
    FileText, Image as ImageIcon, Lock, Code, Search, Youtube, Link as LinkIcon,
    RefreshCw, Shuffle, CreditCard, Wand2
} from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Navigation' });
    return {
        title: t('tools'),
        description: "Browse our complete collection of free online tools for developers, designers, and writers.",
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/tools`
        }
    };
}

export default function ToolsPage({ params: { locale } }: { params: { locale: string } }) {
    const tCategories = useTranslations('Categories');
    const tTools = useTranslations('Tools');
    const tNav = useTranslations('Navigation'); // Assuming 'tools' is in Navigation

    // Group tools by category
    const toolsByCategory: Record<string, typeof tools> = {};

    tools.forEach(tool => {
        if (!toolsByCategory[tool.category]) {
            toolsByCategory[tool.category] = [];
        }
        toolsByCategory[tool.category].push(tool);
    });

    // Icon mapping based on category name
    const getCategoryIcon = (category: string) => {
        if (category.includes('image')) return ImageIcon;
        if (category.includes('pdf') || category.includes('text')) return FileText;
        if (category.includes('security') || category.includes('crypto')) return Lock;
        if (category.includes('developer') || category.includes('code')) return Code;
        if (category.includes('seo') || category.includes('web')) return Search;
        if (category.includes('youtube')) return Youtube;
        if (category.includes('social') || category.includes('link')) return LinkIcon;
        if (category.includes('converter')) return RefreshCw;
        if (category.includes('random')) return Shuffle;
        if (category.includes('utility')) return CreditCard;
        return Wand2;
    };

    return (
        <div className="space-y-12 py-12 pb-20">
            <div className="w-full px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                    {tNav('tools')}
                </h1>
            </div>

            <div className="w-full px-6 space-y-16">
                {Object.entries(toolsByCategory).map(([categoryName, categoryTools]) => {
                    return (
                        <div key={categoryName} id={categoryName.replace(/\s+/g, '-').toLowerCase()} className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-border pb-4">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {tCategories.has(categoryName) ? tCategories(categoryName) : categoryName}
                                </h2>
                                <span className="text-sm font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                                    {categoryTools.length}
                                </span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categoryTools.map((tool) => (
                                    <ToolCard
                                        key={tool.slug}
                                        _id={tool.slug}
                                        slug={tool.slug}
                                        name={tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                        description={tTools.has(`${tool.slug}.description`) ? tTools(`${tool.slug}.description`) : tool.description}
                                        category={tCategories.has(categoryName) ? tCategories(categoryName) : categoryName}
                                        icon={getCategoryIcon(tool.category)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
