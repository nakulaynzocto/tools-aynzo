"use client";
import { useState, useEffect } from 'react';
import { Search, Globe, Share2, FileText, List, Copy, Settings, Code, RefreshCw, Eye, Check, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
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
            <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-2xl overflow-hidden min-h-[700px] flex flex-col">
                <div className="flex-1 grid lg:grid-cols-2">
                    {/* Form Pane */}
                    <div className="p-8 border-r-2 border-border space-y-8 h-full overflow-y-auto">
                        <section className="space-y-6">
                            {type === 'meta-tag-generator' && (
                                <div className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground mr-2">Title</label>
                                            <input value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" placeholder="Primary Title" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Description</label>
                                            <textarea value={meta.description} onChange={e => setMeta({ ...meta, description: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none h-24" placeholder="Brief site info..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Keywords</label>
                                            <input value={meta.keywords} onChange={e => setMeta({ ...meta, keywords: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" placeholder="seo, free, tool" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'open-graph-generator' && (
                                <div className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">OG Title</label>
                                            <input value={og.title} onChange={e => setOg({ ...og, title: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Image URL</label>
                                            <input value={og.image} onChange={e => setOg({ ...og, image: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Description</label>
                                            <textarea value={og.description} onChange={e => setOg({ ...og, description: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none h-24" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'twitter-card-generator' && (
                                <div className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Twitter Handle</label>
                                            <input value={twitter.site} onChange={e => setTwitter({ ...twitter, site: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Card Title</label>
                                            <input value={twitter.title} onChange={e => setTwitter({ ...twitter, title: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-muted-foreground">Image URL</label>
                                            <input value={twitter.image} onChange={e => setTwitter({ ...twitter, image: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input focus:border-blue-500 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'robots-txt-generator' && (
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <button onClick={() => setRobots({ ...robots, allAgents: true })} className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", robots.allAgents ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground")}>All Robots</button>
                                            <button onClick={() => setRobots({ ...robots, allAgents: false })} className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", !robots.allAgents ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground")}>Googlebot Only</button>
                                        </div>
                                        <input value={robots.allow} onChange={e => setRobots({ ...robots, allow: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input" placeholder="Allow Path" />
                                        <input value={robots.disallow} onChange={e => setRobots({ ...robots, disallow: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input" placeholder="Disallow Path" />
                                    </div>
                                </div>
                            )}

                            {type === 'xml-sitemap-generator' && (
                                <div className="space-y-4">
                                    <textarea value={sitemap.urls} onChange={e => setSitemap({ ...sitemap, urls: e.target.value })} className="w-full p-4 border-2 border-border rounded-2xl bg-input h-48 font-mono" placeholder="https://example.com/&#10;https://example.com/about" />
                                </div>
                            )}
                        </section>

                    </div>

                    {/* Preview/Output Pane */}
                    <div className="bg-muted/20 p-8 flex flex-col h-full overflow-hidden border-l-2 border-border">
                        <div className="flex-1 flex flex-col space-y-10">
                            {/* Visual Preview */}
                            {/* Visual Preview */}
                            {(type === 'open-graph-generator' || type === 'twitter-card-generator' || type === 'meta-tag-generator') && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                            <Eye size={14} className="text-primary" /> Visual Simulation
                                        </h3>
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-black uppercase">Live Mockup</span>
                                    </div>

                                    {type === 'meta-tag-generator' ? (
                                        <div className="bg-card rounded-[1.5rem] border-2 border-border p-6 shadow-sm">
                                            <div className="font-sans max-w-[600px]">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center p-1">
                                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-foreground font-medium">example.com</span>
                                                        <span className="text-[10px] text-muted-foreground">https://example.com › page</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium truncate mb-1">
                                                    {meta.title || 'Page Title | Your Brand'}
                                                </h3>
                                                <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                                                    {meta.description || 'This is how your page description will appear in search results. Keep it concise, relevant, and engaging to improve your click-through rate.'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
                                            <div className="aspect-[1200/630] bg-muted relative overflow-hidden flex items-center justify-center">
                                                {(type === 'open-graph-generator' ? og.image : twitter.image) ? (
                                                    <img
                                                        src={type === 'open-graph-generator' ? og.image : twitter.image}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                                        alt="Preview"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                                        <Share2 size={64} />
                                                        <span className="font-black text-sm uppercase tracking-widest">Image Mockup</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full text-[10px] text-white font-black border border-white/20 uppercase tracking-widest shadow-2xl">
                                                    {type === 'open-graph-generator' ? 'Open Graph' : 'X Card'}
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-3 bg-gradient-to-b from-card to-muted/10 border-t-2 border-border">
                                                <div className="flex items-center gap-2 opacity-50">
                                                    <Globe size={12} />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">example.com</p>
                                                </div>
                                                <h4 className="text-2xl font-black leading-tight line-clamp-2 text-foreground tracking-tight">
                                                    {(type === 'open-graph-generator' ? og.title : twitter.title) || 'Enter a Captivating Title'}
                                                </h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium opacity-80">
                                                    {(type === 'open-graph-generator' ? og.description : twitter.description) || 'A brief summary of your content will appear here when your link is shared on social platforms.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Code Output */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <Code size={14} className="text-accent" /> Generated Code
                                    </h3>
                                    {result && (
                                        <button
                                            onClick={copyCode}
                                            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black flex items-center gap-2 transition-all"
                                        >
                                            {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                            {copied ? 'COPIED' : 'COPY SNIPPET'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 bg-muted/30 rounded-[2rem] border-2 border-border p-8 font-mono text-sm text-primary overflow-auto shadow-inner relative group group">
                                    {result ? (
                                        <div className="animate-in fade-in duration-500">
                                            <pre className="whitespace-pre-wrap break-all leading-relaxed opacity-90">{result}</pre>
                                            <div className="absolute top-4 right-4 text-[10px] font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-[0.25em]">
                                                {type === 'xml-sitemap-generator' ? 'XML' : 'HTML'}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 gap-4">
                                            <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                                <Info size={32} />
                                            </div>
                                            <p className="font-black text-xs uppercase tracking-[0.2em] text-center">
                                                Awaiting Data...<br />
                                                <span className="text-[10px] font-medium lowercase italic opacity-60 text-muted-foreground/60">Ready to build your metadata</span>
                                            </p>
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
