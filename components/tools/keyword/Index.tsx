"use client";
import { useState } from 'react';
import { Hash, RefreshCw, Search, LinkIcon, Copy, CheckCircle2 } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { KeywordToolProps } from '@/components/types/keyword/types';
import { generateSlug, cleanKeywords, generateLongTailKeywords, calculateKeywordDensity } from '@/components/utils/keyword/keywordProcessing';
import { cn } from '@/utils/cn';

export default function KeywordToolsIndex({ type }: KeywordToolProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [keyword, setKeyword] = useState('');

    const keywordNavTools = [
        {
            category: 'KEYWORDS',
            tools: [
                { id: 'keyword-density-checker', label: 'Density Checker', icon: Hash },
                { id: 'keyword-cleaner', label: 'Keyword Cleaner', icon: RefreshCw },
                { id: 'long-tail-keyword-generator', label: 'Long Tail Generator', icon: Search },
                { id: 'slug-generator', label: 'Slug Generator', icon: LinkIcon },
            ]
        }
    ];

    const handleProcess = () => {
        switch (type) {
            case 'keyword-density-checker':
                if (input && keyword) {
                    const result = calculateKeywordDensity(input, keyword);
                    setOutput(`Keyword: "${keyword}"\nCount: ${result.count}\nDensity: ${result.density}%`);
                }
                break;
            case 'keyword-cleaner':
                if (input) {
                    setOutput(cleanKeywords(input));
                }
                break;
            case 'long-tail-keyword-generator':
                if (input) {
                    const keywords = generateLongTailKeywords(input);
                    setOutput(keywords.join('\n'));
                }
                break;
            case 'slug-generator':
                if (input) {
                    setOutput(generateSlug(input));
                }
                break;
        }
    };

    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <ScrollableNav items={keywordNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {type === 'keyword-density-checker' && (
                                <div>
                                    <label className="text-xs font-bold text-foreground block mb-2">Enter Keyword</label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                        placeholder="Enter keyword to check"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">
                                    {type === 'keyword-density-checker' ? 'Enter Text' : 'Input'}
                                </label>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full h-64 p-4 border-2 border-border rounded-xl bg-muted/30 text-sm font-medium text-foreground focus:border-primary focus:outline-none resize-none"
                                    placeholder={
                                        type === 'keyword-density-checker' ? 'Paste your text here...' :
                                        type === 'keyword-cleaner' ? 'Enter keywords separated by commas or newlines...' :
                                        type === 'long-tail-keyword-generator' ? 'Enter seed keyword...' :
                                        'Enter text to convert to slug...'
                                    }
                                />
                            </div>
                            <button
                                onClick={handleProcess}
                                disabled={!input || (type === 'keyword-density-checker' && !keyword)}
                                className={cn(
                                    "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                    input && (type !== 'keyword-density-checker' || keyword)
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                <RefreshCw size={16} />
                                {type === 'keyword-density-checker' ? 'Check Density' :
                                 type === 'keyword-cleaner' ? 'Clean Keywords' :
                                 type === 'long-tail-keyword-generator' ? 'Generate Keywords' :
                                 'Generate Slug'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Output</label>
                                <button
                                    onClick={handleCopy}
                                    disabled={!output}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        copied ? "bg-emerald-500 text-white" :
                                        output ? "bg-muted hover:bg-primary hover:text-primary-foreground" :
                                        "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                    )}
                                >
                                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                            <textarea
                                value={output}
                                readOnly
                                className="w-full h-64 p-4 border-2 border-border rounded-xl bg-muted/30 text-sm font-medium text-foreground resize-none"
                                placeholder="Output will appear here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
