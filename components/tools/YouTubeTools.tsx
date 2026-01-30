"use client";
import { useState, useEffect } from 'react';

import { Download, Copy, Link as LinkIcon, Play, Settings, RefreshCw, Info, Video, Check, Image, Tags, Type, Code, Clock, CheckCircle2, Wand2, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';

interface YouTubeToolProps {
    type:
    | 'youtube-thumbnail-downloader'
    | 'youtube-tag-generator'
    | 'youtube-title-generator'
    | 'youtube-embed-code-generator'
    | 'youtube-timestamp-link-generator';
}

export default function YouTubeTools({ type }: YouTubeToolProps) {
    const youtubeNavTools = [
        {
            category: 'YouTube Tools',
            tools: [
                { id: 'youtube-thumbnail-downloader', label: 'Thumbnail', icon: Image },
                { id: 'youtube-tag-generator', label: 'Tags', icon: Tags },
                { id: 'youtube-title-generator', label: 'Titles', icon: Type },
                { id: 'youtube-embed-code-generator', label: 'Embed', icon: Code },
                { id: 'youtube-timestamp-link-generator', label: 'Timestamp', icon: Clock },
            ]
        }
    ];

    const activeCategory = youtubeNavTools.find(cat => cat.tools.some(t => t.id === type));
    
    const t = useTranslations('YouTubeTools');
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [settings, setSettings] = useState({
        autoplay: false,
        loop: false,
        controls: true,
        startTime: '',
    });

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        if (!input.trim()) {
            setResult(null);
            return;
        }

        const processTool = () => {
            switch (type) {
                case 'youtube-thumbnail-downloader':
                    const videoId = extractVideoId(input);
                    if (!videoId) {
                        setResult(null);
                        return;
                    }
                    setResult({
                        max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                        hd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                        mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    });
                    break;

                case 'youtube-tag-generator':
                    const keywords = input.split(' ');
                    const tags = [
                        ...keywords,
                        `${input} tutorial`,
                        `how to ${input}`,
                        `best ${input}`,
                        `${input} 2024`,
                        `${input} guide`,
                        `${input} review`,
                        `${input} for beginners`,
                        `learn ${input}`,
                        `${input} tips`,
                        `${input} tricks`,
                        `${input} explained`
                    ].join(', ');
                    setResult(tags);
                    break;

                case 'youtube-title-generator':
                    const titles = [
                        `How to Master ${input} in just 10 Minutes`,
                        `The Ultimate Guide to ${input} (2024 Edition)`,
                        `7 Secrets About ${input} No One Tells You`,
                        `Why ${input} is the Future of Everything`,
                        `Stop Doing ${input} Wrong! (Watch This)`,
                        `I tried ${input} for 30 Days - Here's What Happened`,
                        `${input} 101: Everything You Need to Know`,
                        `The Best Way to Learn ${input} Fast`
                    ];
                    setResult(titles);
                    break;

                case 'youtube-embed-code-generator':
                    const embedId = extractVideoId(input);
                    if (!embedId) {
                        setResult(null);
                        return;
                    }
                    let src = `https://www.youtube.com/embed/${embedId}?`;
                    if (settings.autoplay) src += '&autoplay=1';
                    if (settings.loop) src += '&loop=1';
                    if (!settings.controls) src += '&controls=0';

                    const code = `<iframe width="560" height="315" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    setResult(code);
                    break;

                case 'youtube-timestamp-link-generator':
                    const timeId = extractVideoId(input);
                    if (!timeId) {
                        setResult(null);
                        return;
                    }
                    let timeStr = settings.startTime || '0';
                    const link = `https://youtu.be/${timeId}?t=${timeStr}`;
                    setResult(link);
                    break;
            }
        };

        const timeoutId = setTimeout(() => {
            processTool();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [input, type, settings]);




    const copyToClipboard = (text: string, index?: number) => {
        navigator.clipboard.writeText(text);
        if (typeof index === 'number') {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Helper to render tool specific inputs/settings
    const renderSettings = () => {
        if (type === 'youtube-embed-code-generator') {
            return (
                <div className="flex flex-wrap gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.autoplay}
                            onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{t('autoplay')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.loop}
                            onChange={(e) => setSettings({ ...settings, loop: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{t('loop')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!settings.controls}
                            onChange={(e) => setSettings({ ...settings, controls: !e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{t('hideControls')}</span>
                    </label>
                </div>
            );
        }
        if (type === 'youtube-timestamp-link-generator') {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1">{t('startTime')}</label>
                    <input
                        type="text"
                        value={settings.startTime}
                        onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                        placeholder={t('startTimePlaceholder')}
                        className="w-full p-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-input text-foreground"
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {/* YouTube Navigation */}
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-4 md:p-6">
                    {!result ? (
                        <div className="min-h-[300px] flex flex-col items-center justify-center transition-all py-12 px-4 relative">
                            <div className="relative z-10 w-full max-w-2xl text-center space-y-8">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                        {type === 'youtube-tag-generator' || type === 'youtube-title-generator'
                                            ? t('enterTopic')
                                            : t('videoUrl')}
                                    </label>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={type.includes('generator') && !type.includes('embed') && !type.includes('link')
                                            ? t('topicPlaceholder')
                                            : t('urlPlaceholder')}
                                        className="w-full p-6 text-xl border-2 border-border rounded-3xl bg-input hover:border-primary focus:border-primary outline-none transition-all text-foreground font-medium text-center shadow-inner"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        if (input.trim()) {
                                            setLoading(true);
                                            setTimeout(() => setLoading(false), 800);
                                        }
                                    }}
                                    className="px-12 py-5 bg-primary text-white dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 dark:border-none text-xl font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.4)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)] hover:scale-[1.05] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] dark:hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 transition-all duration-300"
                                >
                                    {loading ? <RefreshCw className="w-6 h-6 animate-spin mx-auto" /> : t('analyze')}
                                </button>

                                <div className="pt-8 flex justify-center gap-8 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                        <Play size={14} className="text-red-500" /> Fast Extract
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                        <CheckCircle2 size={14} className="text-emerald-500" /> 100% Free
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-[1fr,350px] gap-8 items-stretch lg:h-[500px] h-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Main Content Area */}
                            <div className="flex flex-col gap-6 h-full min-h-0">
                                {/* Header Info */}
                                <div className="flex items-center justify-between px-6 py-4 bg-muted/50 rounded-2xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                            {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </div>
                                    </div>
                                    <button onClick={() => { setInput(''); setResult(null); }} className="text-[10px] font-black uppercase tracking-widest text-destructive hover:underline">New Analysis</button>
                                </div>

                                {/* Results Viewport - internal scroll */}
                                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
                                    {type === 'youtube-thumbnail-downloader' && (
                                        <div className="grid grid-cols-2 gap-6 pb-6">
                                            {Object.entries(result).map(([quality, url]: [string, any]) => (
                                                <div key={quality} className="bg-card p-4 rounded-3xl border-2 border-border group overflow-hidden shadow-xl hover:border-primary/30 transition-all">
                                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-border">
                                                        <img src={url} alt={quality} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] text-white font-black uppercase tracking-widest rounded-full">
                                                            {quality}
                                                        </div>
                                                    </div>
                                                    <a href={url} target="_blank" rel="noreferrer" download className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black text-center text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                        <Download size={14} /> Download
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {type === 'youtube-tag-generator' && (
                                        <div className="bg-card p-8 rounded-[2.5rem] border-2 border-border relative group h-full flex flex-col shadow-2xl">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Generated Tags</span>
                                                <button onClick={() => copyToClipboard(result as string)} className={cn("text-[10px] font-black uppercase tracking-wider flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all", copied ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground")}>
                                                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy All'}
                                                </button>
                                            </div>
                                            <div className="flex-1 p-8 bg-muted rounded-2xl font-mono text-sm leading-relaxed text-foreground shadow-inner border border-border overflow-y-auto">
                                                {result}
                                            </div>
                                        </div>
                                    )}

                                    {type === 'youtube-title-generator' && (
                                        <div className="grid gap-3 pb-6">
                                            {(result as string[]).map((title, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group shadow-sm">
                                                    <span className="text-sm font-bold text-foreground pr-8 leading-snug">{title}</span>
                                                    <button onClick={() => copyToClipboard(title, i)} className={cn("p-3 rounded-xl transition-all flex-shrink-0", copiedIndex === i ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-primary hover:text-white")}>
                                                        {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {(type === 'youtube-embed-code-generator' || type === 'youtube-timestamp-link-generator') && (
                                        <div className="space-y-6 pb-6 h-full flex flex-col">
                                            {type === 'youtube-embed-code-generator' && (
                                                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-border" dangerouslySetInnerHTML={{ __html: result }} />
                                            )}
                                            <div className="bg-card p-8 rounded-[2.5rem] border-2 border-border space-y-4 shadow-2xl flex-1 flex flex-col">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Output</span>
                                                    <button onClick={() => copyToClipboard(result)} className={cn("text-[10px] font-black uppercase tracking-wider flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all", copied ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground")}>
                                                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                                                    </button>
                                                </div>
                                                <div className="flex-1 p-8 bg-muted rounded-2xl font-mono text-sm text-primary overflow-y-auto shadow-inner border border-border">
                                                    {result}
                                                </div>
                                                {type.includes('link') && (
                                                    <a href={result} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all text-[11px] group border border-primary/20">
                                                        Open Link <LinkIcon className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Options Panel */}
                            <div className="h-full flex flex-col gap-6">
                                <div className="bg-card flex-1 p-8 rounded-[2.5rem] border border-border shadow-2xl flex flex-col">
                                    <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
                                        <div className="flex items-center gap-3 text-primary border-b border-border pb-6">
                                            <Settings className="w-5 h-5" />
                                            <h4 className="font-black uppercase tracking-[0.2em] text-xs leading-none">Parameters</h4>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Input URL / ID</label>
                                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-4 border-2 border-border rounded-xl bg-muted focus:border-primary outline-none transition-all text-xs font-bold" />
                                            </div>

                                            <div className="space-y-4">
                                                {renderSettings()}
                                            </div>
                                        </div>

                                        <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-2">
                                            <div className="flex items-center gap-2 text-blue-500">
                                                <Wand2 size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Growth Expert Tip</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                                {t('tipText')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 mt-auto space-y-4 border-t border-border">
                                        <div className="flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                                            <div className="flex items-center gap-1.5"><Lock size={12} /> Secure</div>
                                            <div className="flex items-center gap-1.5"><RefreshCw size={12} /> Real-time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
