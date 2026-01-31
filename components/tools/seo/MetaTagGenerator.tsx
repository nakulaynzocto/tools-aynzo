"use client";
import { Code, Globe } from 'lucide-react';
import { MetaData } from '@/components/types/seo/types';

interface MetaTagGeneratorProps {
    meta: MetaData;
    setMeta: (meta: MetaData) => void;
    result: string;
    copied: boolean;
    onCopy: () => void;
}

export function MetaTagGenerator({ meta, setMeta, result, copied, onCopy }: MetaTagGeneratorProps) {
    return (
        <>
            <div className="p-8 space-y-6 h-full overflow-y-auto no-scrollbar bg-muted/5">
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
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <Code size={12} className="text-primary" /> Markup Output
                            </h3>
                            {result && (
                                <button onClick={onCopy} className={`px-4 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 transition-all uppercase tracking-widest border ${copied ? "bg-emerald-500 text-white border-emerald-500" : "bg-card text-primary border-primary/20 hover:border-primary/50"}`}>
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


