"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export function BinaryToText() {
    const t = useTranslations('Common');
    const [binary, setBinary] = useState('');
    const [text, setText] = useState('');
    const [copied, setCopied] = useState<'binary' | 'text' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const binaryToText = (binaryStr: string): string => {
        const binaryArray = binaryStr.trim().split(/\s+/);
        return binaryArray.map(bin => {
            const decimal = parseInt(bin, 2);
            if (isNaN(decimal)) return '';
            return String.fromCharCode(decimal);
        }).join('');
    };

    const textToBinary = (textStr: string): string => {
        return textStr.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    };

    const handleBinaryChange = (value: string) => {
        setBinary(value);
        setError(null);
        try {
            const result = binaryToText(value);
            setText(result);
        } catch (e) {
            setError('Invalid binary format');
            setText('');
        }
    };

    const handleTextChange = (value: string) => {
        setText(value);
        setError(null);
        try {
            const result = textToBinary(value);
            setBinary(result);
        } catch (e) {
            setError('Conversion error');
            setBinary('');
        }
    };

    const handleCopy = (content: string, type: 'binary' | 'text') => {
        navigator.clipboard.writeText(content);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSwap = () => {
        const tempBinary = binary;
        const tempText = text;
        setBinary(tempText);
        setText(tempBinary);
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
                    {/* Binary Input */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">Binary</label>
                            <button
                                onClick={() => handleCopy(binary, 'binary')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied === 'binary'
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {copied === 'binary' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                        </div>
                        <textarea
                            value={binary}
                            onChange={(e) => handleBinaryChange(e.target.value)}
                            placeholder="Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)"
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-sm font-mono text-foreground focus:border-primary focus:outline-none min-h-[200px] resize-none"
                        />
                    </div>

                    {/* Text Output */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">Text</label>
                            <button
                                onClick={() => handleCopy(text, 'text')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied === 'text'
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {copied === 'text' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="Enter text to convert to binary"
                            className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-sm font-mono text-foreground focus:border-primary focus:outline-none min-h-[200px] resize-none"
                        />
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex items-center justify-center my-4 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:my-0">
                    <button
                        onClick={handleSwap}
                        className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

