"use client";
import { useState } from 'react';
import { Globe, Settings, Globe2, Info, Monitor, Smartphone, Shield, Code, Share2, List, Hash, RefreshCw, Search, LinkIcon, Type, AtSign } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { WebToolProps, SERPData, RedirectData, ResolutionData } from '@/components/types/web/types';
import { useWebProcessing } from '@/components/hooks/web/useWebProcessing';
import { SERPSimulator } from './SERPSimulator';
import { HtaccessRedirectGenerator } from './HtaccessRedirectGenerator';
import { IPAddressChecker } from './IPAddressChecker';
import { BrowserInfo } from './BrowserInfo';
import { ResolutionSimulator } from './ResolutionSimulator';

export default function WebToolsIndex({ type }: WebToolProps) {
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

    const utilityNavTools = [
        {
            category: 'Device & Network',
            tools: [
                { id: 'my-ip-address', label: 'My IP', icon: Globe2 },
                { id: 'browser-info', label: 'Browser Info', icon: Info },
            ]
        },
        {
            category: 'Design & Layout',
            tools: [
                { id: 'screen-resolution-simulator', label: 'Screen Res', icon: Monitor },
                { id: 'responsive-checker', label: 'Responsive', icon: Smartphone },
            ]
        },
        {
            category: 'Content',
            tools: [
                { id: 'lorem-ipsum', label: 'Lorem Ipsum', icon: Type },
                { id: 'email-validator', label: 'Email Validator', icon: AtSign },
            ]
        }
    ];

    const isSeoTool = seoNavTools.some(cat => cat.tools.some(t => t.id === type));
    const isUtilityTool = utilityNavTools.some(cat => cat.tools.some(t => t.id === type));
    
    const activeSeoCategory = seoNavTools.find(cat => cat.tools.some(t => t.id === type));
    const activeUtilityCategory = utilityNavTools.find(cat => cat.tools.some(t => t.id === type));

    const [copied, setCopied] = useState(false);

    const [serp, setSerp] = useState<SERPData>({
        title: 'AYNZO TOOLS - Professional Online Tools & SEO Utilities',
        desc: 'Access over 100+ free online tools for developers, designers and SEO professionals. Fast, secure, and easy to use with local browser processing.',
        url: 'https://tools.aynzo.com'
    });

    const [redirect, setRedirect] = useState<RedirectData>({ from: '/old-slug', to: 'https://site.com/new-slug', type: '301' });

    const [iframeUrl, setIframeUrl] = useState('');
    const [resolution, setResolution] = useState<ResolutionData>({ w: 1920, h: 1080, label: 'Desktop' });
    const [scale, setScale] = useState(0.5);

    const [seoUrl, setSeoUrl] = useState('');
    const [seoResult, setSeoResult] = useState<any>(null);

    const { result, loading, analyzeSEOUrl } = useWebProcessing(type, redirect);

    const analyzeSeo = async () => {
        if (!seoUrl) return;
        await analyzeSEOUrl(seoUrl);
    };

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderWebTool = () => {
        switch (type) {
            case 'google-serp-simulator':
                return <SERPSimulator serp={serp} setSerp={setSerp} />;
            case 'htaccess-redirect-generator':
                return <HtaccessRedirectGenerator redirect={redirect} setRedirect={setRedirect} result={result || ''} copied={copied} onCopy={() => copy(result || '')} />;
            case 'my-ip-address':
                return <IPAddressChecker result={result || ''} loading={loading} copied={copied} onCopy={() => copy(result || '')} onRefresh={() => window.location.reload()} />;
            case 'browser-info':
                return <BrowserInfo result={result || {}} onCopy={copy} />;
            case 'screen-resolution-simulator':
            case 'responsive-checker':
                return <ResolutionSimulator iframeUrl={iframeUrl} setIframeUrl={setIframeUrl} resolution={resolution} setResolution={setResolution} scale={scale} setScale={setScale} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {(isSeoTool && activeSeoCategory) && (
                <ScrollableNav items={[{ category: activeSeoCategory.category, tools: activeSeoCategory.tools }]} activeToolId={type} />
            )}
            {(isUtilityTool && activeUtilityCategory) && (
                <ScrollableNav items={[{ category: activeUtilityCategory.category, tools: activeUtilityCategory.tools }]} activeToolId={type} />
            )}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8">
                    {renderWebTool()}
                </div>
            </div>
            <div className="bg-muted/30 border-2 border-border p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center shrink-0">
                    <Shield className="text-primary w-10 h-10" />
                </div>
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-black tracking-tight text-foreground uppercase">Privacy First Simulation</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-3xl">
                        Our platform uses advanced in-browser technologies to simulator various web environments. All data processing occurs locally on your machine, ensuring that your sensitive information, browsing habits, and simulated parameters remain private and never touch our servers.
                    </p>
                </div>
            </div>
        </div>
    );
}

