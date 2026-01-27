"use client";
import { useState, useEffect } from 'react';
import { Download, Copy, Link as LinkIcon, Play, Settings, RefreshCw, Info, Video, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

    const handleProcess = () => {
        // Logic moved to useEffect
    };


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
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Settings size={120} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Settings size={14} /> {t('configuration')}
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {type === 'youtube-tag-generator' || type === 'youtube-title-generator'
                                            ? t('enterTopic')
                                            : t('videoUrl')}
                                    </label>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={type.includes('generator') && !type.includes('embed') && !type.includes('link')
                                                ? t('topicPlaceholder')
                                                : t('urlPlaceholder')}
                                            className="w-full p-4 border-2 border-border rounded-2xl bg-input hover:border-accent focus:border-accent outline-none transition-all text-foreground font-medium"
                                        />
                                        {renderSettings()}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-blue-500/5 rounded-2xl border-2 border-blue-500/10 space-y-2">
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Info size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">{t('growthTip')}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                    {t('tipText')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('generatedOutput')}</h3>

                            {/* Live Preview for Embed Code */}
                            {type === 'youtube-embed-code-generator' && result && (
                                <div className="bg-card rounded-2xl border-2 border-border p-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-red-500/10 rounded-lg text-red-500">
                                            <Play size={12} fill="currentColor" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Player Preview</span>
                                    </div>
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-white/10" dangerouslySetInnerHTML={{ __html: result }} />
                                </div>
                            )}

                            {result ? (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-500">
                                    {/* Thumbnail Results */}
                                    {type === 'youtube-thumbnail-downloader' && (
                                        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                                            {Object.entries(result).map(([quality, url]: [string, any]) => (
                                                <div key={quality} className="bg-card p-4 rounded-2xl border-2 border-border group overflow-hidden shadow-sm">
                                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-border">
                                                        <img src={url} alt={`${quality} thumbnail`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] text-white font-black uppercase tracking-tighter rounded-full border border-white/10">
                                                            {t('qualityLabel', { quality })}
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        download
                                                        className="w-full py-3 bg-secondary hover:bg-muted text-foreground rounded-xl font-black text-center transition-all text-xs flex items-center justify-center gap-2 border border-border"
                                                    >
                                                        <Download size={14} /> {t('downloadImage')}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tag Results */}
                                    {type === 'youtube-tag-generator' && (
                                        <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border relative group">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{t('seoTags')}</span>
                                                <button onClick={() => copyToClipboard(result)} className={cn("text-xs font-black flex items-center gap-1 transition-all", copied ? "text-emerald-500" : "text-primary hover:text-accent")}>
                                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                                    {copied ? 'Copied!' : t('copyAll')}
                                                </button>
                                            </div>
                                            <div className="p-4 bg-card rounded-xl border-2 border-border font-mono text-sm break-all text-foreground pr-12 min-h-[200px] shadow-inner">
                                                {result}
                                            </div>
                                        </div>
                                    )}

                                    {/* Title Results */}
                                    {type === 'youtube-title-generator' && (
                                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                            {(result as string[]).map((title, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all group shadow-sm">
                                                    <span className="text-sm font-bold text-foreground leading-snug">{title}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(title, i)}
                                                        className={cn(
                                                            "p-2 rounded-lg transition-all",
                                                            copiedIndex === i
                                                                ? "bg-emerald-500/10 text-emerald-500 opacity-100"
                                                                : "bg-muted text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100"
                                                        )}
                                                    >
                                                        {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Embed Code & Link Results */}
                                    {(type === 'youtube-embed-code-generator' || type === 'youtube-timestamp-link-generator') && (
                                        <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{t(type.includes('embed') ? 'generatedCode' : 'generatedLink')}</span>
                                                <button onClick={() => copyToClipboard(result)} className={cn("text-xs font-black flex items-center gap-1 transition-all", copied ? "text-emerald-500" : "text-primary hover:text-accent")}>
                                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                                    {copied ? 'Copied!' : t('copy')}
                                                </button>
                                            </div>
                                            <div className="p-6 bg-muted/50 rounded-2xl font-mono text-sm text-primary overflow-x-auto shadow-inner border-2 border-border">
                                                {result}
                                            </div>
                                            {type.includes('link') && (
                                                <a href={result} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-card hover:bg-muted text-foreground rounded-xl font-bold text-center transition-all text-xs border-2 border-border">
                                                    {t('openLink')} <LinkIcon className="inline-block ml-1 w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full min-h-[300px] bg-muted/10 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                        <Video size={32} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-center">{t('inputRequired')}<br /><span className="text-[10px] lowercase italic opacity-60">{t('resultsPlaceholder')}</span></p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
