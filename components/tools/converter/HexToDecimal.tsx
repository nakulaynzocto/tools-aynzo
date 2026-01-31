"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export function HexToDecimal() {
    const t = useTranslations('Common');
    const [hex, setHex] = useState('');
    const [decimal, setDecimal] = useState('');
    const [copied, setCopied] = useState<'hex' | 'decimal' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const hexToDecimal = (hexStr: string): string => {
        const cleaned = hexStr.replace(/^0x/i, '').trim();
        if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
            setError('Invalid hexadecimal format');
            return '';
        }
        setError(null);
        return parseInt(cleaned, 16).toString();
    };

    const decimalToHex = (decStr: string): string => {
        const num = parseInt(decStr);
        if (isNaN(num)) {
            setError('Invalid decimal format');
            return '';
        }
        setError(null);
        return num.toString(16).toUpperCase();
    };

    const handleHexChange = (value: string) => {
        setHex(value);
        if (value.trim()) {
            const result = hexToDecimal(value);
            setDecimal(result);
        } else {
            setDecimal('');
            setError(null);
        }
    };

    const handleDecimalChange = (value: string) => {
        setDecimal(value);
        if (value.trim()) {
            const result = decimalToHex(value);
            setHex(result);
        } else {
            setHex('');
            setError(null);
        }
    };

    const handleCopy = (content: string, type: 'hex' | 'decimal') => {
        navigator.clipboard.writeText(content);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSwap = () => {
        const tempHex = hex;
        const tempDecimal = decimal;
        setHex(tempDecimal);
        setDecimal(tempHex);
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-bold">
                    {error}
                </div>
            )}

            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Hex Input */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">Hexadecimal</label>
                            <button
                                onClick={() => handleCopy(hex, 'hex')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied === 'hex'
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {copied === 'hex' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                        </div>
                        <input
                            type="text"
                            value={hex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            placeholder="Enter hex (e.g., FF, 0xFF, 1A3B)"
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-2xl font-mono font-black text-foreground focus:border-primary focus:outline-none"
                        />
                        <div className="text-xs text-muted-foreground">
                            Base 16 (0-9, A-F)
                        </div>
                    </div>

                    {/* Decimal Output */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">Decimal</label>
                            <button
                                onClick={() => handleCopy(decimal, 'decimal')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied === 'decimal'
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {copied === 'decimal' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                        </div>
                        <input
                            type="text"
                            value={decimal}
                            onChange={(e) => handleDecimalChange(e.target.value)}
                            placeholder="Enter decimal number"
                            className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-2xl font-mono font-black text-foreground focus:border-primary focus:outline-none"
                        />
                        <div className="text-xs text-muted-foreground">
                            Base 10 (0-9)
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex items-center justify-center my-4 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:my-0">
                    <button
                        onClick={handleSwap}
                        className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

