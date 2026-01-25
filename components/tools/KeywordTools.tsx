"use client";
import { useState } from 'react';
import { List, RefreshCw, Copy, Settings, Info, Hash } from 'lucide-react';
import { cn } from '@/utils/cn';

interface KeywordToolProps {
    type:
    | 'keyword-density-checker'
    | 'keyword-cleaner'
    | 'long-tail-keyword-generator'
    | 'slug-generator';
}

export default function KeywordTools({ type }: KeywordToolProps) {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleProcess = () => {
        if (!input.trim()) {
            return;
        }
        setLoading(true);
        setTimeout(() => {
            processTool();
            setLoading(false);
        }, 500);
    };

    const processTool = () => {
        switch (type) {
            case 'keyword-density-checker':
                const words = input.toLowerCase().match(/\b\w+\b/g) || [];
                const totalWords = words.length;
                const frequency: { [key: string]: number } = {};
                words.forEach(w => {
                    if (w.length > 3) frequency[w] = (frequency[w] || 0) + 1;
                });
                const density = Object.entries(frequency)
                    .map(([word, count]) => ({
                        word,
                        count,
                        percent: ((count / totalWords) * 100).toFixed(2)
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 20);
                setResult(density);
                break;

            case 'keyword-cleaner':
                const cleanList = input
                    .split('\n')
                    .map(l => l.trim())
                    .filter(l => l) // Remove empty
                    .filter((l, i, self) => self.indexOf(l) === i) // Remove duplicates
                    .sort()
                    .join('\n');
                setResult(cleanList);
                break;

            case 'long-tail-keyword-generator':
                const seed = input.trim();
                const modifiers = ['best', 'cheap', 'guide', 'review', 'how to', 'tutorial', '2024', 'free', 'online', 'vs'];
                const generated = modifiers.map(m => `${m} ${seed}`).concat(modifiers.map(m => `${seed} ${m}`));
                setResult(generated.join('\n'));
                break;

            case 'slug-generator':
                const slug = input
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                setResult(slug);
                break;
        }
    };

    const copyToClipboard = () => {
        const textToCopy = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8">
                    <div className="grid lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Settings size={120} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Settings size={14} /> Input Configuration
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {type === 'keyword-cleaner' ? 'Keyword List (One per line)' : 'Source Text / Seed Keyword'}
                                    </label>
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full h-64 p-5 border-2 border-border rounded-2xl bg-input hover:border-accent focus:border-accent outline-none transition-all text-foreground font-medium resize-none shadow-inner"
                                        placeholder={type === 'keyword-cleaner' ? "keyword 1\nkeyword 2..." : "Type or paste your content here..."}
                                    />
                                </div>
                                <button
                                    onClick={handleProcess}
                                    disabled={loading}
                                    className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-[1.25rem] font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10"
                                >
                                    {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <List className="w-6 h-6 shadow-lg" />}
                                    <span className="text-lg">
                                        {type === 'keyword-density-checker' ? 'Analyze Density' : 'Process Keywords'}
                                    </span>
                                </button>
                            </div>

                            <div className="p-6 bg-blue-500/5 rounded-2xl border-2 border-blue-500/10 space-y-2">
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Info size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">SEO Expert Advice</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                    Ideal keyword density is between 1-2%. Avoid keyword stuffing as it can harm your search rankings.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Output</h3>
                            {result ? (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-500 h-full">
                                    {type === 'keyword-density-checker' ? (
                                        <div className="bg-card rounded-[2rem] border-2 border-border shadow-2xl overflow-hidden h-full flex flex-col">
                                            <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                                                <span className="text-xs font-black uppercase text-muted-foreground">Top Keywords</span>
                                                <button onClick={copyToClipboard} className={`text-xs font-black flex items-center gap-1 transition-colors ${copied ? 'text-emerald-500' : 'text-primary hover:text-accent'}`}>
                                                    {copied ? <RefreshCw size={12} /> : <Copy size={12} />} {copied ? 'COPIED' : 'COPY DATA'}
                                                </button>
                                            </div>
                                            <div className="overflow-auto max-h-[500px] custom-scrollbar">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                            <th className="p-5 border-b border-border">Keyword</th>
                                                            <th className="p-5 border-b border-border text-center">Count</th>
                                                            <th className="p-5 border-b border-border text-right">Density</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(result as any[]).map((item, i) => (
                                                            <tr key={i} className="border-b border-border group hover:bg-muted/50 transition-colors">
                                                                <td className="p-5 font-bold text-foreground text-sm">{item.word}</td>
                                                                <td className="p-5 text-center text-muted-foreground font-black text-xs">{item.count}</td>
                                                                <td className="p-5 text-right">
                                                                    <span className={cn(
                                                                        "px-3 py-1 rounded-full text-[10px] font-black",
                                                                        parseFloat(item.percent) > 3 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
                                                                    )}>
                                                                        {item.percent}%
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-muted/30 p-6 rounded-[2rem] border-2 border-border h-full flex flex-col space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Clean Output</span>
                                                <button onClick={copyToClipboard} className={`text-xs font-black flex items-center gap-1 transition-colors ${copied ? 'text-emerald-500' : 'text-primary hover:text-accent'}`}>
                                                    {copied ? <RefreshCw size={12} /> : <Copy size={12} />} {copied ? 'COPIED' : 'COPY ALL'}
                                                </button>
                                            </div>
                                            <div className="flex-1 min-h-[400px] bg-muted/50 rounded-2xl p-8 font-mono text-sm text-primary overflow-auto shadow-inner border-2 border-border">
                                                <pre className="whitespace-pre-wrap">{result}</pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full min-h-[400px] bg-muted/10 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                        <Hash size={32} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest">Awaiting Analysis</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
