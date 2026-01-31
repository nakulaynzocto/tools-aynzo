"use client";
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TitleGeneratorProps {
    result: string[];
    copiedIndex: number | null;
    onCopy: (text: string, index: number) => void;
}

export function TitleGenerator({ result, copiedIndex, onCopy }: TitleGeneratorProps) {
    return (
        <div className="grid gap-3 pb-6">
            {result.map((title, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all group shadow-sm">
                    <span className="text-sm font-bold text-foreground pr-8 leading-snug">{title}</span>
                    <button onClick={() => onCopy(title, i)} className={cn("p-3 rounded-xl transition-all flex-shrink-0", copiedIndex === i ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-primary hover:text-white")}>
                        {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            ))}
        </div>
    );
}


