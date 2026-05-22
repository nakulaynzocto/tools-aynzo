"use client";
import { useState } from 'react';
import { Hash, RefreshCw, Search, LinkIcon, Copy, CheckCircle2 } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { KeywordToolProps } from '@/components/types/keyword/types';
import { generateSlug, cleanKeywords, generateLongTailKeywords, calculateKeywordDensity } from '@/components/utils/keyword/keywordProcessing';
import { cn } from '@/utils/cn';

import { useTranslations } from 'next-intl';

export default function KeywordToolsIndex({ type }: KeywordToolProps) {
    const tKeyword = useTranslations('Tools.KeywordTools');
    const tTools = useTranslations('Tools');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [keyword, setKeyword] = useState('');

    const keywordNavTools = [
        {
            category: tKeyword('category'),
            tools: [
                { id: 'keyword-density-checker', label: tTools('keyword-density-checker.name') !== 'keyword-density-checker.name' ? tTools('keyword-density-checker.name') : 'Density Checker', icon: Hash },
                { id: 'keyword-cleaner', label: tTools('keyword-cleaner.name') !== 'keyword-cleaner.name' ? tTools('keyword-cleaner.name') : 'Keyword Cleaner', icon: RefreshCw },
                { id: 'long-tail-keyword-generator', label: tTools('long-tail-keyword-generator.name') !== 'long-tail-keyword-generator.name' ? tTools('long-tail-keyword-generator.name') : 'Long Tail Generator', icon: Search },
                { id: 'slug-generator', label: tTools('slug-generator.name') !== 'slug-generator.name' ? tTools('slug-generator.name') : 'Slug Generator', icon: LinkIcon },
            ]
        }
    ];

    const handleProcess = () => {
        switch (type) {
            case 'keyword-density-checker':
                if (input && keyword) {
                    const result = calculateKeywordDensity(input, keyword);
                    // Use string replacement for dynamic translation
                    const template = tKeyword('keywordResult');
                    const formatted = template.replace('{keyword}', keyword)
                                              .replace('{count}', result.count.toString())
                                              .replace('{density}', result.density.toString());
                    setOutput(formatted);
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
                                    <label className="text-xs font-bold text-foreground block mb-2">{tKeyword('enterKeyword')}</label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                        placeholder={tKeyword('enterKeywordToCheck')}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">
                                    {type === 'keyword-density-checker' ? tKeyword('enterText') : tKeyword('input')}
                                </label>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full h-64 p-4 border-2 border-border rounded-xl bg-muted/30 text-sm font-medium text-foreground focus:border-primary focus:outline-none resize-none"
                                    placeholder={
                                        type === 'keyword-density-checker' ? tKeyword('pasteTextHere') :
                                        type === 'keyword-cleaner' ? tKeyword('enterKeywordsSeparated') :
                                        type === 'long-tail-keyword-generator' ? tKeyword('enterSeedKeyword') :
                                        tKeyword('enterTextToConvert')
                                    }
                                />
                            </div>
                            <button
                                onClick={handleProcess}
                                disabled={!input || (type === 'keyword-density-checker' && !keyword)}
                                className={cn(
                                    "w-full py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                    input && (type !== 'keyword-density-checker' || keyword)
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                <RefreshCw size={16} />
                                {type === 'keyword-density-checker' ? tKeyword('checkDensity') :
                                 type === 'keyword-cleaner' ? tKeyword('cleanKeywords') :
                                 type === 'long-tail-keyword-generator' ? tKeyword('generateKeywords') :
                                 tKeyword('generateSlug')}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">{tKeyword('output')}</label>
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
                                placeholder={tKeyword('outputWillAppear')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
