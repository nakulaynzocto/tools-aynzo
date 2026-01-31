"use client";
import { useState } from 'react';
import { Code, Share2, Settings, List, Hash, RefreshCw, Search, LinkIcon as LinkIcon, Globe } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { SeoToolProps, MetaData, OpenGraphData, TwitterCardData, RobotsData, SitemapData } from '@/components/types/seo/types';
import { useSEOProcessing } from '@/components/hooks/seo/useSEOProcessing';
import { MetaTagGenerator } from './MetaTagGenerator';
import { OpenGraphGenerator } from './OpenGraphGenerator';
import { TwitterCardGenerator } from './TwitterCardGenerator';
import { RobotsTxtGenerator } from './RobotsTxtGenerator';
import { SitemapGenerator } from './SitemapGenerator';

export default function SeoToolsIndex({ type }: SeoToolProps) {
    const seoNavTools = [
        {
            category: 'Meta & Optimisation',
            tools: [
                { id: 'meta-tag-generator', label: 'Meta Tags', icon: Code },
                { id: 'open-graph-generator', label: 'Open Graph', icon: Share2 },
                { id: 'twitter-card-generator', label: 'Twitter Card', icon: Share2 },
                { id: 'robots-txt-generator', label: 'Robots.txt', icon: Settings },
                { id: 'xml-sitemap-generator', label: 'Sitemap', icon: List },
            ]
        },
        {
            category: 'Keywords',
            tools: [
                { id: 'keyword-density-checker', label: 'Density', icon: Hash },
                { id: 'keyword-cleaner', label: 'Cleaner', icon: RefreshCw },
                { id: 'long-tail-keyword-generator', label: 'Long Tail', icon: Search },
                { id: 'slug-generator', label: 'Slug', icon: LinkIcon },
            ]
        },
        {
            category: 'Webmaster',
            tools: [
                { id: 'google-serp-simulator', label: 'SERP Sim', icon: Globe },
                { id: 'htaccess-redirect-generator', label: '.htaccess', icon: Settings },
            ]
        }
    ];

    const [copied, setCopied] = useState(false);

    const [meta, setMeta] = useState<MetaData>({ title: '', description: '', keywords: '', author: '', viewport: true });
    const [og, setOg] = useState<OpenGraphData>({ title: '', type: 'website', url: '', image: '', description: '', siteName: '' });
    const [twitter, setTwitter] = useState<TwitterCardData>({ card: 'summary_large_image', site: '@', title: '', description: '', image: '' });
    const [robots, setRobots] = useState<RobotsData>({ allAgents: true, allow: '/', disallow: '/admin', sitemap: '' });
    const [sitemap, setSitemap] = useState<SitemapData>({ urls: '', frequency: 'monthly', priority: '0.8' });

    const { result } = useSEOProcessing(type, meta, og, twitter, robots, sitemap);

    const copyCode = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderSEOTool = () => {
        switch (type) {
            case 'meta-tag-generator':
                return <MetaTagGenerator meta={meta} setMeta={setMeta} result={result} copied={copied} onCopy={copyCode} />;
            case 'open-graph-generator':
                return <OpenGraphGenerator og={og} setOg={setOg} result={result} copied={copied} onCopy={copyCode} />;
            case 'twitter-card-generator':
                return <TwitterCardGenerator twitter={twitter} setTwitter={setTwitter} result={result} copied={copied} onCopy={copyCode} />;
            case 'robots-txt-generator':
                return <RobotsTxtGenerator robots={robots} setRobots={setRobots} result={result} copied={copied} onCopy={copyCode} />;
            case 'xml-sitemap-generator':
                return <SitemapGenerator sitemap={sitemap} setSitemap={setSitemap} result={result} copied={copied} onCopy={copyCode} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-4">
            <ScrollableNav items={seoNavTools} activeToolId={type} />
            <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-2xl overflow-hidden lg:h-[500px] h-auto flex flex-col">
                <div className="flex-1 grid lg:grid-cols-2 divide-x-2 divide-border">
                    {renderSEOTool()}
                </div>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-muted-foreground bg-muted/50 p-4 rounded-2xl border border-border">
                <Globe size={16} className="text-blue-500" />
                <span>Search engines like Google use these tags to understand your content. Social networks use them to create beautiful rich shared links.</span>
            </div>
        </div>
    );
}

