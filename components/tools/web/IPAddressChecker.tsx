"use client";
import { Globe2, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface IPAddressCheckerProps {
    result: string;
    loading: boolean;
    copied: boolean;
    onCopy: () => void;
    onRefresh: () => void;
}

export function IPAddressChecker({ result, loading, copied, onCopy, onRefresh }: IPAddressCheckerProps) {
    return (
        <div className="py-16 flex flex-col items-center justify-center space-y-8">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all"></div>
                <div className="relative w-40 h-40 bg-card border-8 border-border rounded-[3rem] flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-all duration-500">
                    <Globe2 size={64} className="text-primary" />
                </div>
            </div>
            <div className="text-center space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Public Gateway IP</h3>
                <div className="text-7xl font-black tracking-tight text-foreground bg-clip-text">
                    {loading ? <div className="flex gap-2 p-4">{[1, 2, 3].map(i => <div key={i} className="w-5 h-5 bg-muted rounded-full animate-pulse" />)}</div> : result}
                </div>
            </div>
            <div className="flex gap-6">
                <button onClick={onCopy} className={cn(`px-12 py-5 border-2 rounded-[1.25rem] font-black transition-all flex items-center gap-3 text-sm shadow-xl`, copied ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-card border-primary/20 text-primary hover:border-primary hover:bg-primary/5')}>
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />} {copied ? 'IP COPIED' : 'COPY IP'}
                </button>
                <button onClick={onRefresh} className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-black shadow-xl hover:scale-105 transition-all flex items-center gap-3 text-sm">
                    <RefreshCw size={20} /> REFRESH
                </button>
            </div>
        </div>
    );
}


