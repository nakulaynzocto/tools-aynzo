"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Download, FileDiff } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { RegexDiffToolProps } from '@/components/types/regex/types';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export default function RegexDiffToolsIndex({ type }: RegexDiffToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [diff, setDiff] = useState<Array<{ type: 'added' | 'removed' | 'unchanged', line: string }>>([]);
    const [copied, setCopied] = useState(false);

    const diffNavTools = [
        {
            category: 'TOOLS',
            tools: [
                { id: 'diff-checker', label: 'Diff Checker', icon: FileDiff },
            ]
        }
    ];

    useEffect(() => {
        if (!text1.trim() && !text2.trim()) {
            setDiff([]);
            return;
        }

        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const diffResult: Array<{ type: 'added' | 'removed' | 'unchanged', line: string }> = [];
        
        const maxLen = Math.max(lines1.length, lines2.length);
        
        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';
            
            if (line1 === line2) {
                diffResult.push({ type: 'unchanged', line: line1 });
            } else {
                if (line1) {
                    diffResult.push({ type: 'removed', line: line1 });
                }
                if (line2) {
                    diffResult.push({ type: 'added', line: line2 });
                }
            }
        }
        
        setDiff(diffResult);
    }, [text1, text2]);

    const handleCopy = async () => {
        const diffText = diff.map(d => {
            if (d.type === 'added') return `+ ${d.line}`;
            if (d.type === 'removed') return `- ${d.line}`;
            return `  ${d.line}`;
        }).join('\n');
        
        await navigator.clipboard.writeText(diffText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const diffText = diff.map(d => {
            if (d.type === 'added') return `+ ${d.line}`;
            if (d.type === 'removed') return `- ${d.line}`;
            return `  ${d.line}`;
        }).join('\n');
        
        const blob = new Blob([diffText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diff.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <ScrollableNav items={diffNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Text 1 (Original)</label>
                                <button onClick={() => setText1('')} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                            </div>
                            <textarea
                                value={text1}
                                onChange={(e) => setText1(e.target.value)}
                                className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 focus:border-primary outline-none resize-none"
                                placeholder="Paste first text here..."
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Text 2 (Modified)</label>
                                <button onClick={() => setText2('')} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                            </div>
                            <textarea
                                value={text2}
                                onChange={(e) => setText2(e.target.value)}
                                className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 focus:border-primary outline-none resize-none"
                                placeholder="Paste second text here..."
                            />
                        </div>
                    </div>

                    {diff.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Differences</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCopy} 
                                        className={cn("p-2 rounded-lg transition-all", 
                                            copied ? "bg-emerald-500 text-white" : "bg-muted hover:bg-primary hover:text-primary-foreground"
                                        )}
                                    >
                                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                    <button 
                                        onClick={handleDownload} 
                                        className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 overflow-auto">
                                {diff.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "px-2 py-1",
                                            item.type === 'added' && "bg-emerald-500/20 text-emerald-600",
                                            item.type === 'removed' && "bg-destructive/20 text-destructive",
                                            item.type === 'unchanged' && "text-foreground"
                                        )}
                                    >
                                        <span className="font-bold mr-2">
                                            {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                                        </span>
                                        {item.line || '\n'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
