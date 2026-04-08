import { ToolCard } from '@/components/common/components/ToolCard';
import { tools } from '@/lib/tools';
import {
    FileText, Image as ImageIcon, Lock, Code, Search, Youtube, Link as LinkIcon,
    RefreshCw, Shuffle, CreditCard, Wand2, Zap
} from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';
import HeroSearch from '@/components/common/components/HeroSearch';
import RecentToolsSection from '@/components/common/components/RecentToolsSection';
import { getCategoryIcon } from '@/utils/icon-mapping';
import AdCard from '@/components/common/components/AdCard';
import { Fragment } from 'react';
import { getLocalizedUrl, getAllHreflangUrls, getXDefaultUrl } from '@/utils/locale-utils';
import { SITE_URL, OG_IMAGES } from '@/lib/constants';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Navigation' });
    const tTools = await getTranslations({ locale, namespace: 'ToolsDirectory' });
    
    const localizedTitle = tTools.has('title') ? tTools('title') : `${t('tools')} | Professional Online Tools Library`;
    
    return {
        title: localizedTitle,
        description: tTools.has('description') ? tTools('description') : "Browse our complete collection of 100+ free online tools for developers, designers, and writers.",
        alternates: {
            canonical: getLocalizedUrl(SITE_URL, locale, '/tools'),
            languages: {
                'x-default': getXDefaultUrl(SITE_URL, '/tools'),
                ...getAllHreflangUrls(SITE_URL, locales, '/tools')
            }
        }
    };
}

export default async function ToolsPage({ params: { locale } }: { params: { locale: string } }) {
    const tCategories = await getTranslations({ locale, namespace: 'Categories' });
    const tCategoryDescriptions = await getTranslations({ locale, namespace: 'CategoryDescriptions' });
    const tTools = await getTranslations({ locale, namespace: 'Tools' });
    const tToolsDir = await getTranslations({ locale, namespace: 'ToolsDirectory' });
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });
    const tHome = await getTranslations({ locale, namespace: 'HomePage' });

    // Group tools by category
    const toolsByCategory: Record<string, typeof tools> = {};
    tools.forEach(tool => {
        if (!toolsByCategory[tool.category]) {
            toolsByCategory[tool.category] = [];
        }
        toolsByCategory[tool.category].push(tool);
    });

    const categoryList = Object.keys(toolsByCategory);

    return (
        <div className="relative min-h-screen">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full animate-pulse delay-700" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <Zap size={14} />
                        {tHome('toolsCount', { count: tools.length })} Available
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {tToolsDir.rich('heroTitle', {
                            v: (chunks) => <span className="text-primary italic">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        {tToolsDir('heroSubtitle')}
                    </p>
                    
                    <div className="pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <HeroSearch />
                    </div>
                </div>
            </section>

            {/* Sticky Category Navigation */}
            <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-y border-border/50 py-3 shadow-sm overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                        {categoryList.map((cat) => (
                            <a
                                key={cat}
                                href={`#${cat.replace(/\s+/g, '-').toLowerCase()}`}
                                className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold bg-secondary/50 hover:bg-primary hover:text-white transition-all border border-border/40"
                            >
                                {tCategories.has(cat) ? tCategories(cat) : cat}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tools Grid by Category */}
            <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
                <RecentToolsSection />
                
                {Object.entries(toolsByCategory).map(([categoryName, categoryTools], idx) => {
                    const Icon = getCategoryIcon(categoryName);
                    return (
                        <div 
                            key={categoryName} 
                            id={categoryName.replace(/\s+/g, '-').toLowerCase()} 
                            className="scroll-mt-32 space-y-10 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500">
                                            <Icon size={24} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight">
                                            {tCategories.has(categoryName) ? tCategories(categoryName) : categoryName}
                                        </h2>
                                    </div>
                                    <p className="text-muted-foreground font-medium text-lg max-w-xl">
                                        {tCategoryDescriptions.has(categoryName) 
                                          ? tCategoryDescriptions(categoryName) 
                                          : `Collection of high-performance ${categoryName.toLowerCase()} designed for professional workflows.`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-secondary/50 px-4 py-2 rounded-xl border border-border/40">
                                    <span>{categoryTools.length}</span>
                                    <span className="opacity-50 uppercase tracking-widest text-[10px]">Tools</span>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categoryTools.map((tool, toolIdx) => (
                                    <Fragment key={tool.slug}>
                                        <div 
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                            style={{ animationDelay: `${toolIdx * 50}ms` }}
                                        >
                                            <ToolCard
                                                _id={tool.slug}
                                                slug={tool.slug}
                                                name={tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                description={tTools.has(`${tool.slug}.description`) ? tTools(`${tool.slug}.description`) : tool.description}
                                                category={tCategories.has(categoryName) ? tCategories(categoryName) : categoryName}
                                                categoryKey={tool.category}
                                            />
                                        </div>
                                        {/* Premium Ad Placement: After 2nd tool of 1st category */}
                                        {idx === 0 && toolIdx === 1 && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                                <AdCard />
                                            </div>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 pb-40">
                <div className="relative bg-primary/5 rounded-[3rem] p-12 md:p-20 text-center border border-primary/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-black">{tHome('trust.title')}</h2>
                        <p className="text-lg text-muted-foreground font-medium leading-loose">
                            Everything on Aynzo Tools is processed completely within your browser. 
                            Your files never touch our servers, ensuring your data remains private and secure. 
                            Zero storage, zero tracking, just pure performance.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
