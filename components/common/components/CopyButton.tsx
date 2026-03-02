"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface CopyButtonProps {
    value: string;
    className?: string;
    label?: string;
    iconSize?: number;
}

export function CopyButton({ value, className, label, iconSize = 16 }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Copied to clipboard!", {
                duration: 2000,
                description: "The content has been successfully copied.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy!");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 active:scale-95",
                copied 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-secondary hover:bg-primary/10 hover:text-primary text-muted-foreground border border-border/40",
                className
            )}
            title={label || "Copy to clipboard"}
        >
            {copied ? (
                <Check size={iconSize} className="animate-in zoom-in duration-300" />
            ) : (
                <Copy size={iconSize} />
            )}
            {label && <span className="text-xs font-bold uppercase tracking-widest">{label}</span>}
        </button>
    );
}
