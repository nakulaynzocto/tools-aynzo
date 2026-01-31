"use client";
import { Share2, Globe, Code, CheckCircle2, Copy } from 'lucide-react';
import { TwitterCardData } from '@/components/types/seo/types';
import { cn } from '@/utils/cn';

interface TwitterCardGeneratorProps {
    twitter: TwitterCardData;
    setTwitter: (twitter: TwitterCardData) => void;
    result: string;
    copied: boolean;
    onCopy: () => void;
}

export function TwitterCardGenerator({ twitter, setTwitter, result, copied, onCopy }: TwitterCardGeneratorProps) {
    return (
        <>
            <div className="p-8 space-y-6 h-full overflow-y-auto no-scrollbar bg-muted/5">
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
            </div>
            <div className="bg-muted px-8 py-6 flex flex-col h-full overflow-hidden">
                <div className="flex-1 flex flex-col space-y-6 overflow-y-auto no-scrollbar pr-1">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <Globe size={12} className="text-primary" /> Visual Simulation
                            </h3>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-black uppercase tracking-tighter leading-none border border-emerald-500/20">Live Sync</span>
                        </div>
                        <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                            <div className="aspect-[1200/630] bg-muted/30 relative flex items-center justify-center overflow-hidden">
                                {twitter.image ? (
                                    <img src={twitter.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                        <Share2 size={40} />
                                        <span className="font-black text-[9px] uppercase tracking-widest">Asset Preview</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] text-white font-black uppercase tracking-widest border border-white/10">
                                    X-Card
                                </div>
                            </div>
                            <div className="p-5 space-y-2 bg-card border-t border-border">
                                <div className="flex items-center gap-1.5 opacity-40">
                                    <Globe size={10} />
                                    <p className="text-[9px] font-black uppercase tracking-widest">EXAMPLE.COM</p>
                                </div>
                                <h4 className="text-base font-black leading-tight line-clamp-1 text-foreground">
                                    {twitter.title || 'Compelling Shared Title'}
                                </h4>
                                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 font-medium">
                                    {twitter.description || 'A brief summary that encourages users to click your link on social platforms.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <Code size={12} className="text-primary" /> Markup Output
                            </h3>
                            {result && (
                                <button onClick={onCopy} className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 transition-all uppercase tracking-widest border", copied ? "bg-emerald-500 text-white border-emerald-500" : "bg-card text-primary border-primary/20 hover:border-primary/50")}>
                                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy Snippet'}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 bg-card rounded-2xl border border-border p-6 font-mono text-[11px] text-primary overflow-auto shadow-inner relative group">
                            {result ? (
                                <div className="animate-in fade-in duration-300">
                                    <pre className="whitespace-pre-wrap break-all leading-relaxed opacity-90">{result}</pre>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 gap-3">
                                    <p className="font-black text-[9px] uppercase tracking-[0.2em] text-center">Awaiting Data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

