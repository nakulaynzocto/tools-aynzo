"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { transformAdvancedText } from '@/components/utils/text/textProcessing';

interface AdvancedTextGeneratorProps {
    type: 'italic-text' | 'bold-text' | 'strikethrough-text' | 'underline-text' | 'double-underline-text' | 'cursive-text' | 'small-text' | 'upside-down-text' | 'mirror-text';
}

const toolLabels: Record<string, string> = {
    'italic-text': 'Italic Text',
    'bold-text': 'Bold Text',
    'strikethrough-text': 'Strikethrough Text',
    'underline-text': 'Underline Text',
    'double-underline-text': 'Double Underline Text',
    'cursive-text': 'Cursive Text',
    'small-text': 'Small Text',
    'upside-down-text': 'Upside Down Text',
    'mirror-text': 'Mirror Text',
};

export function AdvancedTextGenerator({ type }: AdvancedTextGeneratorProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const handleTransform = () => {
        if (!input.trim()) {
            setOutput('');
            return;
        }
        const result = transformAdvancedText(input, type);
        setOutput(result);
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (output) {
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Auto-transform on input change
    useEffect(() => {
        if (input.trim()) {
            const result = transformAdvancedText(input, type);
            setOutput(result);
        } else {
            setOutput('');
        }
    }, [input, type]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black uppercase tracking-widest text-foreground">Input Text</label>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            const result = transformAdvancedText(e.target.value, type);
                            setOutput(result);
                        }}
                        placeholder="Enter your text here..."
                        className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none min-h-[200px] resize-none"
                    />
                </div>

                {/* Output */}
                <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black uppercase tracking-widest text-foreground">{toolLabels[type] || 'Output'}</label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied
                                        ? "bg-emerald-500 text-white"
                                        : output
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={!output}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    output
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                    <div className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-sm font-medium text-foreground min-h-[200px] whitespace-pre-wrap break-words">
                        {output || <span className="text-muted-foreground">Transformed text will appear here...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

