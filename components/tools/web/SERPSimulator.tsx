"use client";
import { Globe, Settings } from 'lucide-react';
import { SERPData } from '@/components/types/web/types';
import { cn } from '@/utils/cn';

interface SERPSimulatorProps {
    serp: SERPData;
    setSerp: (serp: SERPData) => void;
}

export function SERPSimulator({ serp, setSerp }: SERPSimulatorProps) {
    return (
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
                    <Globe className="text-blue-500 w-5 h-5 flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Your description is your ad. Make it catchy and informative to stand out.</p>
                </div>
            </div>
        </div>
    );
}

