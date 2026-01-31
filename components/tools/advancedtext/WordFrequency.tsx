"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, Download, BarChart3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import { calculateKeywordDensity } from '@/components/utils/text/textProcessing';

export function WordFrequency() {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    const [input, setInput] = useState('');
    const [wordFrequency, setWordFrequency] = useState<Array<{ word: string; count: number; percentage: number }>>([]);
    const [copied, setCopied] = useState(false);

    const handleAnalyze = () => {
        if (!input.trim()) {
            setWordFrequency([]);
            return;
        }
        
        const words = input.trim().split(/\s+/).length;
        const frequency = calculateKeywordDensity(input, words);
        setWordFrequency(frequency);
    };

    const handleCopy = () => {
        const text = wordFrequency.map(w => `${w.word}: ${w.count} (${w.percentage}%)`).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const text = wordFrequency.map(w => `${w.word}: ${w.count} (${w.percentage}%)`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'word-frequency.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground">Input Text</label>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your text to analyze word frequency..."
                    className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none min-h-[200px] resize-none"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={!input.trim()}
                    className={cn(
                        "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        input.trim()
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    <BarChart3 size={16} />
                    Analyze Word Frequency
                </button>
            </div>

            {wordFrequency.length > 0 && (
                <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                            <BarChart3 size={16} className="text-primary" />
                            Word Frequency Results
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
                            >
                                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                Copy
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
                            >
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {wordFrequency.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{item.word}</p>
                                        <p className="text-xs text-muted-foreground">{item.count} occurrence{item.count !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-primary">{item.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


