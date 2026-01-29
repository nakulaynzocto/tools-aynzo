"use client";
import { useState, useEffect } from 'react';

import { Search, Globe, Share2, FileText, List, Copy, Settings, Code, RefreshCw, Eye, Check, ExternalLink, Info, CheckCircle2, Hash, Link as LinkIcon } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';

interface SeoToolProps {
    type:
    | 'meta-tag-generator'
    | 'open-graph-generator'
    | 'twitter-card-generator'
    | 'robots-txt-generator'
    | 'xml-sitemap-generator';
}

export default function SeoTools({ type }: SeoToolProps) {
    // Navigation Configuration
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

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    // Form states
    const [meta, setMeta] = useState({ title: '', description: '', keywords: '', author: '', viewport: true });
    const [og, setOg] = useState({ title: '', type: 'website', url: '', image: '', description: '', siteName: '' });
    const [twitter, setTwitter] = useState({ card: 'summary_large_image', site: '@', title: '', description: '', image: '' });
    const [robots, setRobots] = useState({ allAgents: true, allow: '/', disallow: '/admin', sitemap: '' });
    const [sitemap, setSitemap] = useState({ urls: '', frequency: 'monthly', priority: '0.8' });

    useEffect(() => {
        const generate = () => {
            let output = '';
            switch (type) {
                case 'meta-tag-generator':
                    if (!meta.title && !meta.description) { setResult(''); return; }
                    output = `<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}">
<meta name="description" content="${meta.description}">
<meta name="keywords" content="${meta.keywords}">
<meta name="author" content="${meta.author}">
${meta.viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">' : ''}`;
                    break;

                case 'open-graph-generator':
                    if (!og.title && !og.url) { setResult(''); return; }
                    output = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${og.type}">
<meta property="og:url" content="${og.url}">
<meta property="og:title" content="${og.title}">
<meta property="og:description" content="${og.description}">
<meta property="og:image" content="${og.image}">
<meta property="og:site_name" content="${og.siteName}">`;
                    break;

                case 'twitter-card-generator':
                    if (!twitter.title && !twitter.site) { setResult(''); return; }
                    output = `<!-- Twitter -->
<meta property="twitter:card" content="${twitter.card}">
<meta property="twitter:title" content="${twitter.title}">
<meta property="twitter:description" content="${twitter.description}">
<meta property="twitter:image" content="${twitter.image}">
<meta property="twitter:site" content="${twitter.site}">`;
                    break;

                case 'robots-txt-generator':
                    output = `User-agent: ${robots.allAgents ? '*' : 'Googlebot'}
Allow: ${robots.allow}
Disallow: ${robots.disallow}

${robots.sitemap ? `Sitemap: ${robots.sitemap}` : ''}`;
                    break;

                case 'xml-sitemap-generator':
                    if (!sitemap.urls) { setResult(''); return; }
                    const urlList = sitemap.urls.split('\n').filter(u => u.trim());
                    const items = urlList.map(url => `  <url>
    <loc>${url.trim()}</loc>
    <changefreq>${sitemap.frequency}</changefreq>
    <priority>${sitemap.priority}</priority>
  </url>`).join('\n');
                    output = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
                    break;
            }
            setResult(output.trim());
        };

        generate();
    }, [type, meta, og, twitter, robots, sitemap]);

    const handleGenerate = () => {
        // Logic moved to useEffect
    };

    const copyCode = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto py-4">
            {/* SEO Tool Navigation */}
            <ScrollableNav items={seoNavTools} activeToolId={type} />
            <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-2xl overflow-hidden lg:h-[500px] h-auto flex flex-col">
                <div className="flex-1 grid lg:grid-cols-2 divide-x-2 divide-border">
                    {/* Form Pane */}
                    <div className="p-8 space-y-6 h-full overflow-y-auto no-scrollbar bg-muted/5">
                        <section className="space-y-6">
                            {type === 'meta-tag-generator' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary border-b border-border pb-4">
                                        <Code size={16} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Global Metadata</h4>
                                    </div>
                                    <div className="grid gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Page Title</label>
                                            <input value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" placeholder="Safe title: 50-60 chars" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">SEO Description</label>
                                            <textarea value={meta.description} onChange={e => setMeta({ ...meta, description: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none h-24 text-sm font-medium leading-relaxed" placeholder="Brief site info..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Focus Keywords</label>
                                            <input value={meta.keywords} onChange={e => setMeta({ ...meta, keywords: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" placeholder="comma, separated, tags" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'open-graph-generator' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary border-b border-border pb-4">
                                        <Share2 size={16} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Social Graph</h4>
                                    </div>
                                    <div className="grid gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Share Title</label>
                                            <input value={og.title} onChange={e => setOg({ ...og, title: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Thumbnail Preview URL</label>
                                            <input value={og.image} onChange={e => setOg({ ...og, image: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">OG Description</label>
                                            <textarea value={og.description} onChange={e => setOg({ ...og, description: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none h-24 text-sm font-medium" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'twitter-card-generator' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary border-b border-border pb-4">
                                        <Share2 size={16} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">X/Twitter Integration</h4>
                                    </div>
                                    <div className="grid gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Author Handle</label>
                                            <input value={twitter.site} onChange={e => setTwitter({ ...twitter, site: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Card Headline</label>
                                            <input value={twitter.title} onChange={e => setTwitter({ ...twitter, title: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Hero Image URL</label>
                                            <input value={twitter.image} onChange={e => setTwitter({ ...twitter, image: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card focus:border-primary outline-none text-sm font-bold" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'robots-txt-generator' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-primary border-b border-border pb-4">
                                        <Settings size={16} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Crawler Rules</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => setRobots({ ...robots, allAgents: true })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all", robots.allAgents ? "bg-primary text-white" : "bg-muted text-muted-foreground/50 border border-border")}>All Agents</button>
                                            <button onClick={() => setRobots({ ...robots, allAgents: false })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all", !robots.allAgents ? "bg-primary text-white" : "bg-muted text-muted-foreground/50 border border-border")}>Google Only</button>
                                        </div>
                                        <div className="grid gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Allow Indexing</label>
                                                <input value={robots.allow} onChange={e => setRobots({ ...robots, allow: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card" placeholder="Allow Path" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Block Path</label>
                                                <input value={robots.disallow} onChange={e => setRobots({ ...robots, disallow: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card" placeholder="Disallow Path" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'xml-sitemap-generator' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <List size={16} />
                                            <h4 className="text-[10px] font-black uppercase tracking-widest">URL Discovery</h4>
                                        </div>
                                    </div>
                                    <textarea value={sitemap.urls} onChange={e => setSitemap({ ...sitemap, urls: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-card h-64 font-mono text-xs leading-relaxed focus:border-primary outline-none" placeholder="https://example.com/&#10;https://example.com/about" />
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Preview/Output Pane */}
                    <div className="bg-muted px-8 py-6 flex flex-col h-full overflow-hidden">
                        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto no-scrollbar pr-1">
                            {/* Visual Preview */}
                            {(type === 'open-graph-generator' || type === 'twitter-card-generator' || type === 'meta-tag-generator') && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                            <Eye size={12} className="text-primary" /> Visual Simulation
                                        </h3>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-black uppercase tracking-tighter leading-none border border-emerald-500/20">Live Sync</span>
                                    </div>

                                    {type === 'meta-tag-generator' ? (
                                        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3">
                                            <div className="font-sans">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                                                        <Globe className="w-3.5 h-3.5 text-muted-foreground/60" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-foreground font-bold leading-none">example.com</span>
                                                        <span className="text-[9px] text-muted-foreground tracking-tight opacity-60">https://example.com › page</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] font-medium leading-tight mb-1">
                                                    {meta.title || 'Optimal SEO Title for Growth'}
                                                </h3>
                                                <p className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] leading-snug line-clamp-2">
                                                    {meta.description || 'This meta description will appear in search engine results. Keep it between 150-160 characters for maximum efficiency and click-through rates.'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                                            <div className="aspect-[1200/630] bg-muted/30 relative flex items-center justify-center overflow-hidden">
                                                {(type === 'open-graph-generator' ? og.image : twitter.image) ? (
                                                    <img src={type === 'open-graph-generator' ? og.image : twitter.image} className="w-full h-full object-cover" alt="Preview" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                                        <Share2 size={40} />
                                                        <span className="font-black text-[9px] uppercase tracking-widest">Asset Preview</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] text-white font-black uppercase tracking-widest border border-white/10">
                                                    {type === 'open-graph-generator' ? 'Open Graph' : 'X-Card'}
                                                </div>
                                            </div>
                                            <div className="p-5 space-y-2 bg-card border-t border-border">
                                                <div className="flex items-center gap-1.5 opacity-40">
                                                    <Globe size={10} />
                                                    <p className="text-[9px] font-black uppercase tracking-widest">EXAMPLE.COM</p>
                                                </div>
                                                <h4 className="text-base font-black leading-tight line-clamp-1 text-foreground">
                                                    {(type === 'open-graph-generator' ? og.title : twitter.title) || 'Compelling Shared Title'}
                                                </h4>
                                                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 font-medium">
                                                    {(type === 'open-graph-generator' ? og.description : twitter.description) || 'A brief summary that encourages users to click your link on social platforms.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Code Output */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <Code size={12} className="text-primary" /> Markup Output
                                    </h3>
                                    {result && (
                                        <button onClick={copyCode} className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 transition-all uppercase tracking-widest border", copied ? "bg-emerald-500 text-white border-emerald-500" : "bg-card text-primary border-primary/20 hover:border-primary/50")}>
                                            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                            {copied ? 'Copied' : 'Copy Snippet'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 bg-card rounded-2xl border border-border p-6 font-mono text-[11px] text-primary overflow-auto shadow-inner relative group">
                                    {result ? (
                                        <div className="animate-in fade-in duration-300">
                                            <pre className="whitespace-pre-wrap break-all leading-relaxed opacity-90">{result}</pre>
                                            <div className="absolute top-3 right-3 text-[8px] font-black text-foreground/10 uppercase tracking-widest">
                                                {type === 'xml-sitemap-generator' ? 'XML' : 'SOURCE'}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 gap-3">
                                            <Info size={24} />
                                            <p className="font-black text-[9px] uppercase tracking-[0.2em] text-center">Awaiting Data</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-muted-foreground bg-muted/50 p-4 rounded-2xl border border-border">
                <Globe size={16} className="text-blue-500" />
                <span>Search engines like Google use these tags to understand your content. Social networks use them to create beautiful rich shared links.</span>
            </div>
        </div>
    );
}
