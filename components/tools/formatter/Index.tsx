"use client";
import { useState, useEffect, useCallback } from 'react';
import { Copy, CheckCircle2, Download, Maximize2, Minimize2, Code, FileCode, Braces, FileText, FileJson, ArrowRightLeft, Minimize } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { FormatterToolProps } from '@/components/types/formatter/types';
import { formatCode, minifyCode, markdownToHTML, htmlToMarkdown } from '@/components/utils/formatter/formatterProcessing';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export default function FormatterToolsIndex({ type }: FormatterToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const formatterNavTools = [
        {
            category: 'FORMAT',
            tools: [
                { id: 'html-formatter', label: 'HTML', icon: Code },
                { id: 'css-formatter', label: 'CSS', icon: FileCode },
                { id: 'javascript-formatter', label: 'JavaScript', icon: Braces },
                { id: 'xml-formatter', label: 'XML', icon: FileCode },
                { id: 'sql-formatter', label: 'SQL', icon: FileText },
            ]
        },
        {
            category: 'CONVERT',
            tools: [
                { id: 'markdown-to-html', label: 'MD to HTML', icon: FileText },
                { id: 'html-to-markdown', label: 'HTML to MD', icon: Code },
                { id: 'csv-to-json', label: 'CSV to JSON', icon: FileJson },
                { id: 'json-to-csv', label: 'JSON to CSV', icon: FileJson },
            ]
        },
        {
            category: 'OPTIMIZE',
            tools: [
                { id: 'code-minifier', label: 'Code Minifier', icon: Minimize },
            ]
        }
    ];

    useEffect(() => {
        if (!input.trim()) {
            setOutput('');
            setError('');
            return;
        }

        // Use setTimeout to avoid blocking the UI
        const timeoutId = setTimeout(() => {
            try {
                setError('');
                let result = '';

                if (type === 'markdown-to-html') {
                    result = markdownToHTML(input);
                } else if (type === 'html-to-markdown') {
                    result = htmlToMarkdown(input);
                } else if (type === 'csv-to-json') {
                    result = csvToJSON(input);
                } else if (type === 'json-to-csv') {
                    result = jsonToCSV(input);
                } else if (type === 'code-minifier') {
                    // Code minifier can handle HTML, CSS, JS
                    result = minifyCode(input, 'html-formatter');
                } else {
                    // Formatters
                    if (mode === 'beautify') {
                        result = formatCode(input, type, 2);
                    } else {
                        result = minifyCode(input, type);
                    }
                }

                setOutput(result);
            } catch (e: any) {
                setError(e.message || 'Processing failed');
                setOutput('');
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [input, mode, type]);

    const csvToJSON = useCallback((csv: string): string => {
        const lines = csv.trim().split('\n');
        if (lines.length === 0) return '[]';

        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            result.push(obj);
        }

        return JSON.stringify(result, null, 2);
    }, []);

    const jsonToCSV = useCallback((json: string): string => {
        try {
            const data = JSON.parse(json);
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('JSON must be an array of objects');
            }

            const headers = Object.keys(data[0]);
            let csv = headers.join(',') + '\n';

            data.forEach((row: any) => {
                const values = headers.map(header => {
                    const value = row[header] ?? '';
                    const stringValue = String(value);
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                });
                csv += values.join(',') + '\n';
            });

            return csv.trim();
        } catch (e: any) {
            throw new Error('Invalid JSON format. Expected an array of objects.');
        }
    }, []);

    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (output) {
            const extension = type.includes('html') ? 'html' :
                type.includes('css') ? 'css' :
                    type.includes('javascript') ? 'js' :
                        type.includes('xml') ? 'xml' :
                            type.includes('sql') ? 'sql' :
                                type.includes('markdown') ? 'md' :
                                    type.includes('json') ? 'json' :
                                        type.includes('csv') ? 'csv' : 'txt';

            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `formatted.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const showModeToggle = ['html-formatter', 'css-formatter', 'javascript-formatter', 'xml-formatter', 'sql-formatter'].includes(type);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <ScrollableNav items={formatterNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-6">
                    {showModeToggle && (
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="bg-muted p-1 rounded-xl border-2 border-border shadow-sm flex gap-1">
                                <button
                                    className={cn("px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm border", mode === 'beautify'
                                        ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                                        : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                                    )}
                                    onClick={() => setMode('beautify')}
                                >
                                    <Maximize2 className="h-4 w-4" />
                                    Beautify
                                </button>
                                <button
                                    className={cn("px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm border", mode === 'minify'
                                        ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                                        : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                                    )}
                                    onClick={() => setMode('minify')}
                                >
                                    <Minimize2 className="h-4 w-4" />
                                    Minify
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4">
                            <p className="text-sm text-destructive font-bold">{error}</p>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Input</label>
                                <button onClick={() => setInput('')} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 focus:border-primary outline-none resize-none"
                                placeholder="Paste your content here..."
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Output</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        disabled={!output}
                                        className={cn("p-2 rounded-lg transition-all",
                                            copied ? "bg-emerald-500 text-white" :
                                                output ? "bg-muted hover:bg-primary hover:text-primary-foreground" :
                                                    "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                        )}
                                    >
                                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        disabled={!output}
                                        className={cn("p-2 rounded-lg transition-all",
                                            output ? "bg-muted hover:bg-primary hover:text-primary-foreground" :
                                                "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                        )}
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={output}
                                readOnly
                                className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 resize-none"
                                placeholder="Output will appear here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
