"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

const romanValues: { [key: string]: number } = {
    'M': 1000, 'CM': 900, 'D': 500, 'CD': 400,
    'C': 100, 'XC': 90, 'L': 50, 'XL': 40,
    'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1
};

const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

export function RomanNumeralConverter() {
    const t = useTranslations('Common');
    const [roman, setRoman] = useState('');
    const [number, setNumber] = useState('');
    const [copied, setCopied] = useState<'roman' | 'number' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const romanToNumber = (romanStr: string): string => {
        const upper = romanStr.toUpperCase().trim();
        if (!upper) return '';
        
        if (!/^[IVXLCDM]+$/.test(upper)) {
            setError('Invalid Roman numeral format');
            return '';
        }
        
        setError(null);
        let result = 0;
        let i = 0;
        
        while (i < upper.length) {
            if (i + 1 < upper.length && romanValues[upper.substring(i, i + 2)]) {
                result += romanValues[upper.substring(i, i + 2)];
                i += 2;
            } else if (romanValues[upper[i]]) {
                result += romanValues[upper[i]];
                i++;
            } else {
                setError('Invalid Roman numeral');
                return '';
            }
        }
        
        return result.toString();
    };

    const numberToRoman = (numStr: string): string => {
        const num = parseInt(numStr);
        if (isNaN(num) || num < 1 || num > 3999) {
            setError('Number must be between 1 and 3999');
            return '';
        }
        
        setError(null);
        let result = '';
        let remaining = num;
        
        for (const numeral of romanNumerals) {
            const value = romanValues[numeral];
            while (remaining >= value) {
                result += numeral;
                remaining -= value;
            }
        }
        
        return result;
    };

    const handleRomanChange = (value: string) => {
        setRoman(value);
        if (value.trim()) {
            const result = romanToNumber(value);
            setNumber(result);
        } else {
            setNumber('');
            setError(null);
        }
    };

    const handleNumberChange = (value: string) => {
        setNumber(value);
        if (value.trim()) {
            const result = numberToRoman(value);
            setRoman(result);
        } else {
            setRoman('');
            setError(null);
        }
    };

    const handleCopy = (content: string, type: 'roman' | 'number') => {
        navigator.clipboard.writeText(content);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSwap = () => {
        const tempRoman = roman;
        const tempNumber = number;
        setRoman(tempNumber);
        setNumber(tempRoman);
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-bold">
                    {error}
                </div>
            )}

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="text-xs font-bold text-muted-foreground mb-2">Note:</div>
                <div className="text-sm text-foreground">
                    Roman numerals range from 1 to 3999. Valid characters: I, V, X, L, C, D, M
                </div>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Roman Input */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">Roman Numeral</label>
                            <button
                                onClick={() => handleCopy(roman, 'roman')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied === 'roman'
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {copied === 'roman' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                        </div>
                        <input
                            type="text"
                            value={roman}
                            onChange={(e) => handleRomanChange(e.target.value)}
                            placeholder="Enter Roman numeral (e.g., XIV, MCMXCIV)"
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-2xl font-black text-foreground focus:border-primary focus:outline-none uppercase"
                        />
                        <div className="text-xs text-muted-foreground">
                            Valid: I, V, X, L, C, D, M
                        </div>
                    </div>

                    {/* Number Output */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">Number</label>
                            <button
                                onClick={() => handleCopy(number, 'number')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied === 'number'
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {copied === 'number' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                        </div>
                        <input
                            type="number"
                            min="1"
                            max="3999"
                            value={number}
                            onChange={(e) => handleNumberChange(e.target.value)}
                            placeholder="Enter number (1-3999)"
                            className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-2xl font-black text-foreground focus:border-primary focus:outline-none"
                        />
                        <div className="text-xs text-muted-foreground">
                            Range: 1 to 3999
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

