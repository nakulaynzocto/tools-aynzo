"use client";
import { Copy, Check, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmbedCodeGeneratorProps {
    result: string;
    copied: boolean;
    onCopy: () => void;
}

export function EmbedCodeGenerator({ result, copied, onCopy }: EmbedCodeGeneratorProps) {
    return (
        <div className="space-y-6 pb-6 h-full flex flex-col">
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-border" dangerouslySetInnerHTML={{ __html: result }} />
            <div className="bg-card p-8 rounded-[2.5rem] border-2 border-border space-y-4 shadow-2xl flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Output</span>
                    <button onClick={onCopy} className={cn("text-[10px] font-black uppercase tracking-wider flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all", copied ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground")}>
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <div className="flex-1 p-8 bg-muted rounded-2xl font-mono text-sm text-primary overflow-y-auto shadow-inner border border-border">
                    {result}
                </div>
            </div>
        </div>
    );
}

