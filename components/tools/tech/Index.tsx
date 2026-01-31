"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Download, Code } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { TechToolProps } from '@/components/types/tech/types';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export default function TechToolsIndex({ type }: TechToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const techNavTools = [
        {
            category: 'OTHER',
            tools: [
                { id: 'html-to-jsx', label: 'HTML to JSX', icon: Code },
            ]
        }
    ];

    useEffect(() => {
        if (!input.trim()) {
            setOutput('');
            setError('');
            return;
        }

        try {
            setError('');
            let result = '';

            if (type === 'html-to-jsx') {
                result = convertHTMLToJSX(input);
            }

            setOutput(result);
        } catch (e: any) {
            setError(e.message || 'Conversion failed');
            setOutput('');
        }
    }, [input, type]);

    const convertHTMLToJSX = (html: string): string => {
        return html
            // Convert class to className
            .replace(/\bclass=/g, 'className=')
            // Convert for to htmlFor
            .replace(/\bfor=/g, 'htmlFor=')
            // Convert self-closing tags
            .replace(/<(\w+)([^>]*?)(?:\s*\/\s*>|>)/g, (match, tag, attrs) => {
                const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
                if (selfClosingTags.includes(tag.toLowerCase())) {
                    return `<${tag}${attrs} />`;
                }
                return match;
            })
            // Convert inline styles object format
            .replace(/style="([^"]*)"/g, (match, styles) => {
                const styleObj = styles.split(';').reduce((acc: any, style: string) => {
                    const [key, value] = style.split(':').map(s => s.trim());
                    if (key && value) {
                        const jsKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                        acc[jsKey] = value;
                    }
                    return acc;
                }, {});
                return `style={${JSON.stringify(styleObj)}}`;
            })
            // Convert event handlers (basic)
            .replace(/\bon(\w+)="([^"]*)"/g, (match, event, handler) => {
                const jsEvent = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
                return `${jsEvent}={${handler}}`;
            });
    };

    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
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
            a.download = 'converted.jsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <ScrollableNav items={techNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4">
                            <p className="text-sm text-destructive font-bold">{error}</p>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">HTML Input</label>
                                <button onClick={() => setInput('')} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 focus:border-primary outline-none resize-none"
                                placeholder="Paste HTML code here..."
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">JSX Output</label>
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
                                placeholder="JSX output will appear here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
