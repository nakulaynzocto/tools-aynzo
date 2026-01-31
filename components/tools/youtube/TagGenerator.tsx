"use client";
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TagGeneratorProps {
    result: string;
    copied: boolean;
    onCopy: () => void;
}

export function TagGenerator({ result, copied, onCopy }: TagGeneratorProps) {
    return (
        <div className="bg-card p-8 rounded-[2.5rem] border-2 border-border relative group h-full flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Generated Tags</span>
                <button onClick={onCopy} className={cn("text-[10px] font-black uppercase tracking-wider flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all", copied ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground")}>
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy All'}
                </button>
            </div>
            <div className="flex-1 p-8 bg-muted rounded-2xl font-mono text-sm leading-relaxed text-foreground shadow-inner border border-border overflow-y-auto">
                {result}
            </div>
        </div>
    );
}


