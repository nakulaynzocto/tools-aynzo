"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { transformAdvancedText } from '@/components/utils/text/textProcessing';

interface TextManipulatorProps {
    type: 'remove-duplicate-lines' | 'sort-alphabetically' | 'remove-extra-spaces';
}

const toolLabels: Record<string, string> = {
    'remove-duplicate-lines': 'Remove Duplicate Lines',
    'sort-alphabetically': 'Sort Lines Alphabetically',
    'remove-extra-spaces': 'Remove Extra Spaces',
};

export function TextManipulator({ type }: TextManipulatorProps) {
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
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your text here..."
                        className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none min-h-[200px] resize-none"
                    />
                    <button
                        onClick={handleTransform}
                        disabled={!input.trim()}
                        className={cn(
                            "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                            input.trim()
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        Transform <ArrowRight size={16} />
                    </button>
                </div>

                {/* Output */}
                <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black uppercase tracking-widest text-foreground">Output</label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                    copied
                                        ? "bg-emerald-500 text-white"
                                        : output
                                            ? "bg-primary text-white hover:bg-primary/90"
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
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Transformed text will appear here..."
                        className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-sm font-medium text-foreground min-h-[200px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}

