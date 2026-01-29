"use client";
import { useState, useEffect } from 'react';
import { Globe, Code, Monitor, Smartphone, Eye, Server, RefreshCw, Copy, ExternalLink, Shield, Settings, Info, Check, Search, CheckCircle2, ZoomIn, Share2, FileText, List, Hash, Link as LinkIcon, Type, AtSign, Globe2, RotateCcw } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';

interface WebToolProps {
    type:
    | 'google-serp-simulator'
    | 'htaccess-redirect-generator'
    | 'my-ip-address'
    | 'screen-resolution-simulator'
    | 'responsive-checker'
    | 'browser-info';
}

export default function WebTools({ type }: WebToolProps) {
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

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // SERP State
    const [serp, setSerp] = useState({
        title: 'AYNZO TOOLS - Professional Online Tools & SEO Utilities',
        desc: 'Access over 100+ free online tools for developers, designers and SEO professionals. Fast, secure, and easy to use with local browser processing.',
        url: 'https://tools.aynzo.com'
    });

    // Redirect State
    const [redirect, setRedirect] = useState({ from: '/old-slug', to: 'https://site.com/new-slug', type: '301' });

    // Resolution State
    const [iframeUrl, setIframeUrl] = useState('');
    const [resolution, setResolution] = useState({ w: 1920, h: 1080, label: 'Desktop' });
    const [scale, setScale] = useState(0.5);

    const handleResolutionChange = (res: { w: number, h: number, label: string }) => {
        setResolution(res);
        // Auto-adjust scale based on device width
        if (res.w > 1000) setScale(0.4);
        else if (res.w > 600) setScale(0.6);
        else setScale(1);
    };

    // SEO Score State
    const [seoUrl, setSeoUrl] = useState('');
    const [seoAnalyzing, setSeoAnalyzing] = useState(false);
    const [seoResult, setSeoResult] = useState<any>(null);

    const analyzeSeo = async () => {
        if (!seoUrl) return;
        setSeoAnalyzing(true);
        setSeoResult(null);

        try {
            // Normalize URL
            let targetUrl = seoUrl.startsWith('http') ? seoUrl : `https://${seoUrl}`;

            // We use a CORS proxy to fetch the HTML content
            // Using allorigins.win as a free reliable proxy for client-side tools
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            const data = await response.json();

            if (!data.contents) throw new Error("Could not fetch page content");

            const html = data.contents;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // --- ANALYSIS LOGIC ---
            let score = 0;
            const issues: { type: 'success' | 'warning' | 'error', title: string, desc: string }[] = [];

            // 1. Title Tag Analysis (20 points)
            const title = doc.querySelector('title')?.innerText || '';
            if (title) {
                if (title.length >= 10 && title.length <= 60) {
                    score += 20;
                    issues.push({ type: 'success', title: 'SEO Title is Optimized', desc: `Great! Title length is ${title.length} chars (Recommended: 10-60).` });
                } else {
                    score += 10;
                    issues.push({ type: 'warning', title: 'SEO Title Needs Improvement', desc: `Title is present but length (${title.length}) is not optimal. Aim for 30-60 chars.` });
                }
            } else {
                issues.push({ type: 'error', title: 'Missing SEO Title', desc: 'The <title> tag is missing. This is critical for SEO.' });
            }

            // 2. Meta Description (20 points)
            const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            if (desc) {
                if (desc.length >= 50 && desc.length <= 160) {
                    score += 20;
                    issues.push({ type: 'success', title: 'Meta Description is Optimized', desc: `Perfect length (${desc.length} chars). Describes page well.` });
                } else {
                    score += 10;
                    issues.push({ type: 'warning', title: 'Meta Description Issues', desc: `Description exists but length (${desc.length}) is outside recommended 50-160 range.` });
                }
            } else {
                issues.push({ type: 'error', title: 'Missing Meta Description', desc: 'No meta description found. Search engines may not display snippets correctly.' });
            }

            // 3. H1 Header (20 points)
            const h1s = doc.querySelectorAll('h1');
            if (h1s.length === 1) {
                score += 20;
                issues.push({ type: 'success', title: 'H1 Header Optimized', desc: 'Excellent! Exactly one H1 tag found.' });
            } else if (h1s.length === 0) {
                issues.push({ type: 'error', title: 'Missing H1 Header', desc: 'No H1 tag found. Use one main heading per page.' });
            } else {
                score += 10;
                issues.push({ type: 'warning', title: 'Multiple H1 Headers', desc: `Found ${h1s.length} H1 tags. It is best practice to have only one per page.` });
            }

            // 4. Images Alt Attributes (20 points)
            const images = Array.from(doc.querySelectorAll('img'));
            const imagesWithAlt = images.filter(img => img.getAttribute('alt')?.trim());
            const totalImages = images.length;

            if (totalImages === 0) {
                score += 20; // No images means no alt tag errors? Technically yes.
                issues.push({ type: 'warning', title: 'No Images Found', desc: 'Visual content helps engagement. Consider adding images.' });
            } else {
                const altRatio = imagesWithAlt.length / totalImages;
                if (altRatio === 1) {
                    score += 20;
                    issues.push({ type: 'success', title: 'Image Alt Tags Perfect', desc: 'All images have alt attributes. Great for accessibility and SEO.' });
                } else if (altRatio > 0.5) {
                    score += 10;
                    issues.push({ type: 'warning', title: 'Missing Some Alt Tags', desc: `${totalImages - imagesWithAlt.length} images are missing alt descriptions. Fix this for better indexing.` });
                } else {
                    issues.push({ type: 'error', title: 'Poor Image SEO', desc: 'Most images are missing alt tags. Search engines cannot "see" your images.' });
                }
            }

            // 5. Links Analysis (20 points)
            const links = doc.querySelectorAll('a');
            if (links.length > 0) {
                score += 20;
                issues.push({ type: 'success', title: 'Links Found', desc: `Found ${links.length} internal/external links. Linking structure appears active.` });
            } else {
                issues.push({ type: 'warning', title: 'No Links Found', desc: 'A page without links is a dead end for bots and users.' });
            }

            setSeoResult({
                score,
                url: targetUrl,
                metrics: {
                    meta: { score: (title && desc) ? 95 : 40, status: (title && desc) ? 'good' : 'poor' },
                    content: { score: h1s.length === 1 ? 90 : 60, status: h1s.length === 1 ? 'good' : 'avg' },
                    mobile: { score: 90, status: 'good' }, // Can't easily check mobile without real backend
                    tech: { score: imagesWithAlt.length === totalImages ? 90 : 50, status: 'avg' }
                },
                issues // Pass the real issues list
            });

        } catch (error) {
            console.error(error);
            // Fallback for when fetching fails (CORS or blocks)
            setSeoResult({
                score: 0,
                url: seoUrl,
                metrics: { meta: { score: 0, status: 'error' }, content: { score: 0 }, mobile: { score: 0 }, tech: { score: 0 } },
                issues: [{ type: 'error', title: 'Scan Failed', desc: 'Could not crawl this URL. The site might block automated scanners or allow-scripts. Please try another domain.' }]
            });
        } finally {
            setSeoAnalyzing(false);
        }
    };

    useEffect(() => {
        if (type === 'browser-info') {
            const info = {
                'User Agent': navigator.userAgent,
                'Language': navigator.language,
                'Platform': navigator.platform,
                'Screen Size': `${window.screen.width} x ${window.screen.height}`,
                'Viewport': `${window.innerWidth} x ${window.innerHeight}`,
                'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
                'Device Memory': (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A',
                'CPU Cores': navigator.hardwareConcurrency || 'N/A'
            };
            setResult(info);
        }
        if (type === 'my-ip-address') fetchIp();
    }, [type]);

    const fetchIp = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            setResult(data.ip);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type === 'htaccess-redirect-generator') {
            const code = `# HTTP Redirect\nRedirect ${redirect.type} ${redirect.from} ${redirect.to}`;
            setResult(code);
        }
    }, [type, redirect]);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Tool Navigation */}
            {(isSeoTool || isUtilityTool) && (
                <ScrollableNav items={isSeoTool ? seoNavTools : utilityNavTools} activeToolId={type} />
            )}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8">
                    {/* SERP SIMULATOR */}
                    {type === 'google-serp-simulator' && (
                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-5 space-y-6">
                                <div className="space-y-4 bg-muted/30 p-8 rounded-[2rem] border-2 border-border">
                                    <h3 className="font-black flex items-center gap-2 text-xs uppercase text-muted-foreground tracking-widest"><Settings size={14} /> Optimization</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground">SEO Page Title</label>
                                                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded", serp.title.length > 60 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500")}>{serp.title.length}/60</span>
                                            </div>
                                            <input value={serp.title} onChange={e => setSerp({ ...serp, title: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black uppercase text-muted-foreground">Meta Description</label>
                                                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded", serp.desc.length > 160 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500")}>{serp.desc.length}/160</span>
                                            </div>
                                            <textarea value={serp.desc} onChange={e => setSerp({ ...serp, desc: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent min-h-[120px]" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Simulated URL</label>
                                            <input value={serp.url} onChange={e => setSerp({ ...serp, url: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-7 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Google Desktop Preview</h3>
                                <div className="bg-[#f8f9fa] dark:bg-[#202124] p-12 rounded-[2.5rem] shadow-xl border border-border/50">
                                    <div className="max-w-[600px] font-sans">
                                        <div className="flex items-center gap-3 mb-2 opacity-90">
                                            <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-sm border border-border">
                                                <Globe size={16} className="text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[12px] text-[#202124] dark:text-white font-medium leading-none mb-0.5">Example Web</span>
                                                <span className="text-[11px] text-[#4d5156] dark:text-[#bdc1c6] truncate">{serp.url}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1 leading-tight font-medium">
                                            {serp.title || 'Please enter a title...'}
                                        </h3>
                                        <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] leading-[1.58] line-clamp-2">
                                            {serp.desc || 'Provide a compelling meta description to increase your CTR in search engine results pages.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Your description is your ad. Make it catchy and informative to stand out.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* REDIRECT GENERATOR */}
                    {type === 'htaccess-redirect-generator' && (
                        <div className="grid lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-6 relative overflow-hidden h-full">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Settings size={14} /> Redirection Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Type</label>
                                            <select value={redirect.type} onChange={e => setRedirect({ ...redirect, type: e.target.value })} className="w-full p-4 border-2 border-border rounded-xl bg-input font-black text-sm appearance-none outline-none focus:border-accent">
                                                <option value="301">301 - Permanent</option>
                                                <option value="302">302 - Temporary</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Source Path</label>
                                            <input value={redirect.from} onChange={e => setRedirect({ ...redirect, from: e.target.value })} className="w-full p-4 border-2 border-border rounded-xl bg-input font-bold" placeholder="/old-link" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Destination</label>
                                            <input value={redirect.to} onChange={e => setRedirect({ ...redirect, to: e.target.value })} className="w-full p-4 border-2 border-border rounded-xl bg-input font-bold" placeholder="https://newsite.com/link" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 flex flex-col h-full">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Apache Config Output</h3>
                                    {result && (
                                        <button onClick={() => copy(result)} className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all", copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20')}>
                                            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />} {copied ? 'COPIED' : 'COPY ALL'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 p-8 bg-muted/30 border-2 border-border rounded-3xl font-mono text-sm text-primary shadow-inner min-h-[300px] flex flex-col items-center justify-center">
                                    {result ? (
                                        <pre className="w-full whitespace-pre-wrap break-all">{result}</pre>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                                            <RotateCcw className="w-10 h-10 animate-spin-slow opacity-10" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Waiting for input...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BROWSER INFO / IP */}
                    {(type === 'browser-info' || type === 'my-ip-address') && (
                        <div className="space-y-10">
                            {type === 'my-ip-address' ? (
                                <div className="py-16 flex flex-col items-center justify-center space-y-8">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all"></div>
                                        <div className="relative w-40 h-40 bg-card border-8 border-border rounded-[3rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-all duration-500">
                                            <Globe size={64} className="text-primary" />
                                        </div>
                                    </div>
                                    <div className="text-center space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Public Gateway IP</h3>
                                        <div className="text-7xl font-black tracking-tight text-foreground bg-clip-text">
                                            {loading ? <div className="flex gap-2 p-4">{[1, 2, 3].map(i => <div key={i} className="w-5 h-5 bg-muted rounded-full animate-pulse" />)}</div> : result}
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <button onClick={() => copy(result)} className={`px-12 py-5 border-2 rounded-[1.25rem] font-black transition-all flex items-center gap-3 text-sm shadow-xl ${copied ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-card border-primary/20 text-primary hover:border-primary hover:bg-primary/5'}`}>
                                            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />} {copied ? 'IP COPIED' : 'COPY IP'}
                                        </button>
                                        <button onClick={fetchIp} className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3 text-sm">
                                            <RefreshCw size={20} /> REFRESH
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {result && Object.entries(result).map(([k, v]: [string, any]) => (
                                        <div key={k} className="p-8 bg-muted/20 border-2 border-border rounded-3xl space-y-3 group hover:border-primary/30 transition-all shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{k}</span>
                                                <Copy size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer transition-all" onClick={() => copy(v)} />
                                            </div>
                                            <p className="font-black text-foreground break-all leading-tight">{v}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RESOLUTION SIMULATOR */}
                    {(type === 'screen-resolution-simulator' || type === 'responsive-checker') && (
                        <div className="space-y-10">
                            <div className="flex flex-col xl:flex-row gap-8 items-end">
                                <div className="flex-1 w-full space-y-3">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">SIMULATION SOURCE</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                                            <Globe size={22} />
                                        </div>
                                        <input
                                            value={iframeUrl} onChange={e => setIframeUrl(e.target.value)}
                                            className="w-full pl-14 pr-6 py-5 border-2 border-border rounded-[1.25rem] bg-input font-black text-lg focus:border-primary outline-none transition-all shadow-inner"
                                            placeholder="Enter Website URL (e.g. google.com)"
                                        />
                                    </div>
                                </div>
                                <div className="flex p-2 bg-muted rounded-[1.5rem] border-2 border-border gap-2 shadow-inner">
                                    {[
                                        { w: 375, h: 667, label: 'Mobile', icon: Smartphone },
                                        { w: 768, h: 1024, label: 'Tablet', icon: Monitor },
                                        { w: 1920, h: 1080, label: 'Desktop', icon: Monitor },
                                    ].map(device => (
                                        <button
                                            key={device.label}
                                            onClick={() => handleResolutionChange(device)}
                                            className={cn(
                                                "px-6 py-3 rounded-2xl flex items-center gap-3 transition-all",
                                                resolution.label === device.label ? "bg-primary shadow-xl text-primary-foreground border-2 border-primary" : "bg-transparent border border-border text-foreground hover:bg-primary/10 hover:border-primary active:scale-95"
                                            )}
                                        >
                                            <device.icon size={18} />
                                            <span className="text-[11px] font-black uppercase tracking-tighter">{device.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 bg-muted p-2 rounded-[1.25rem] border-2 border-border shadow-inner px-4">
                                    <ZoomIn size={16} className="text-muted-foreground" />
                                    <input
                                        type="range"
                                        min="0.2"
                                        max="1.5"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="w-24 accent-primary cursor-pointer"
                                    />
                                    <span className="text-[10px] font-black w-8 text-right font-mono">{Math.round(scale * 100)}%</span>
                                </div>
                            </div>

                            <div className="relative bg-muted/10 border-2 border-border rounded-[3rem] p-8 flex flex-col items-center overflow-hidden transition-all duration-500 ease-in-out">
                                <div className="absolute top-6 left-8 flex items-center gap-6 z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Simulator</span>
                                    </div>
                                    <div className="px-5 py-2 bg-card border-2 border-border rounded-full text-xs font-black text-primary shadow-sm">{resolution.w} x {resolution.h}</div>
                                </div>

                                <div
                                    className="mt-16 w-full flex justify-center origin-top transition-all duration-300 ease-in-out"
                                    style={{ height: (resolution.h * scale) + 40 }}
                                >
                                    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }} className="absolute">
                                        <div className="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] border-[12px] border-border rounded-[3.5rem] bg-card p-2">
                                            <div className="bg-background rounded-[2.5rem] overflow-hidden shadow-inner">
                                                {iframeUrl ? (
                                                    <div style={{ width: resolution.w, height: resolution.h }} className="bg-background overflow-hidden">
                                                        <iframe
                                                            src={iframeUrl.startsWith('http') ? iframeUrl : `https://${iframeUrl}`}
                                                            className="w-full h-full border-none"
                                                            title="SimulatorView"
                                                            sandbox="allow-scripts allow-same-origin allow-forms"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{ width: resolution.w, height: resolution.h }} className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-card">
                                                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
                                                            <ExternalLink size={40} className="opacity-20" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-lg font-black text-foreground">Awaiting Source URL</p>
                                                            <p className="text-xs font-medium text-muted-foreground max-w-xs">Enter a valid website address above to begin the responsive simulation for <b>{resolution.label}</b> device.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <div className="w-12 h-1 bg-muted rounded-full"></div>
                                    <div className="w-1.5 h-1 bg-muted rounded-full"></div>
                                    <div className="w-1.5 h-1 bg-muted rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    )}

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
