"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, Download, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { findReplace } from '@/components/utils/text/textProcessing';

export function FindReplace() {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    const [input, setInput] = useState('');
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [useRegex, setUseRegex] = useState(false);

    const handleReplace = () => {
        if (!input.trim() || !findText.trim()) {
            setOutput('');
            return;
        }
        
        let result = input;
        if (useRegex) {
            try {
                const regex = new RegExp(findText, 'g');
                result = input.replace(regex, replaceText);
            } catch (e) {
                setOutput('Invalid regex pattern');
                return;
            }
        } else {
            result = findReplace(input, findText, replaceText);
        }
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
            a.download = 'replaced-text.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="space-y-6">
            {/* Find & Replace Controls */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Search size={16} className="text-primary" />
                        Find & Replace
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold">
                        <input
                            type="checkbox"
                            checked={useRegex}
                            onChange={(e) => setUseRegex(e.target.checked)}
                            className="w-4 h-4 rounded border-border"
                        />
                        Use Regex
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-foreground block mb-2">Find</label>
                        <input
                            type="text"
                            value={findText}
                            onChange={(e) => setFindText(e.target.value)}
                            placeholder="Text to find..."
                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-foreground block mb-2">Replace With</label>
                        <input
                            type="text"
                            value={replaceText}
                            onChange={(e) => setReplaceText(e.target.value)}
                            placeholder="Replacement text..."
                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>
                <button
                    onClick={handleReplace}
                    disabled={!input.trim() || !findText.trim()}
                    className={cn(
                        "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        input.trim() && findText.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    Replace All <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground">Input Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your text here..."
                        className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none min-h-[200px] resize-none"
                    />
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
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Replaced text will appear here..."
                        className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-sm font-medium text-foreground min-h-[200px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}


