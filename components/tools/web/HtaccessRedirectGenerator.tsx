"use client";
import { Settings, Copy, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { RedirectData } from '@/components/types/web/types';

interface HtaccessRedirectGeneratorProps {
    redirect: RedirectData;
    setRedirect: (redirect: RedirectData) => void;
    result: string;
    copied: boolean;
    onCopy: () => void;
}

import { useTranslations } from 'next-intl';

export function HtaccessRedirectGenerator({ redirect, setRedirect, result, copied, onCopy }: HtaccessRedirectGeneratorProps) {
    const tTool = useTranslations('Tools.webTools');
    return (
        <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-6 relative overflow-hidden h-full">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Settings size={14} />{tTool('redirectionSettings')}</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{tTool('type')}</label>
                            <select value={redirect.type} onChange={e => setRedirect({ ...redirect, type: e.target.value as '301' | '302' })} className="w-full p-4 border-2 border-border rounded-xl bg-input font-black text-sm appearance-none outline-none focus:border-accent">
                                <option value="301">301 - {tTool('permanent')}</option>
                                <option value="302">302 - {tTool('temporary')}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{tTool('sourcePath')}</label>
                            <input value={redirect.from} onChange={e => setRedirect({ ...redirect, from: e.target.value })} className="w-full p-4 border-2 border-border rounded-xl bg-input font-bold" placeholder="/old-link" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{tTool('destination')}</label>
                            <input value={redirect.to} onChange={e => setRedirect({ ...redirect, to: e.target.value })} className="w-full p-4 border-2 border-border rounded-xl bg-input font-bold" placeholder="https://newsite.com/link" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6 flex flex-col h-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">{tTool('apacheConfigOutput')}</h3>
                    {result && (
                        <button onClick={onCopy} className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all", copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20')}>
                            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />} {copied ? tTool('copied') : tTool('copyAll')}
                        </button>
                    )}
                </div>
                <div className="flex-1 p-8 bg-muted/30 border-2 border-border rounded-3xl font-mono text-sm text-primary shadow-inner min-h-[300px] flex flex-col items-center justify-center">
                    {result ? (
                        <pre className="w-full whitespace-pre-wrap break-all">{result}</pre>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                            <RotateCcw className="w-10 h-10 animate-spin-slow opacity-10" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tTool('waitingForInput')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


