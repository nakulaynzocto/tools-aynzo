"use client";
import { Copy } from 'lucide-react';

interface BrowserInfoProps {
    result: Record<string, string>;
    onCopy: (text: string) => void;
}

export function BrowserInfo({ result, onCopy }: BrowserInfoProps) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result && Object.entries(result).map(([k, v]: [string, any]) => (
                <div key={k} className="p-8 bg-muted/20 border-2 border-border rounded-3xl space-y-3 group hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{k}</span>
                        <Copy size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer transition-all" onClick={() => onCopy(v)} />
                    </div>
                    <p className="font-black text-foreground break-all leading-tight">{v}</p>
                </div>
            ))}
        </div>
    );
}

