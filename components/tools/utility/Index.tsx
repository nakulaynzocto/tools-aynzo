"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, Download, Type } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { UtilityToolProps } from '@/components/types/utility/types';
import { generateLoremIpsum } from '@/components/utils/utility/utilityProcessing';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export default function UtilityToolsIndex({ type }: UtilityToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [paragraphs, setParagraphs] = useState(3);
    const [sentencesPerParagraph, setSentencesPerParagraph] = useState(5);

    const utilityNavTools = [
        {
            category: 'GENERATORS',
            tools: [
                { id: 'lorem-ipsum', label: 'Lorem Ipsum Generator', icon: Type },
            ]
        }
    ];

    const handleGenerate = () => {
        if (type === 'lorem-ipsum') {
            const result = generateLoremIpsum(paragraphs, sentencesPerParagraph);
            setOutput(result);
        }
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
            a.download = 'lorem-ipsum.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    if (type === 'lorem-ipsum') {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <ScrollableNav items={utilityNavTools} activeToolId={type} />
                <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">Number of Paragraphs</label>
                                <input
                                    type="number"
                                    value={paragraphs}
                                    onChange={(e) => setParagraphs(Number(e.target.value))}
                                    min={1}
                                    max={50}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">Sentences per Paragraph</label>
                                <input
                                    type="number"
                                    value={sentencesPerParagraph}
                                    onChange={(e) => setSentencesPerParagraph(Number(e.target.value))}
                                    min={1}
                                    max={20}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <Type size={16} />
                            Generate Lorem Ipsum
                        </button>
                        
                        {output && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold">Generated Text</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCopy}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
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
                                <textarea
                                    value={output}
                                    readOnly
                                    className="w-full h-96 p-4 text-sm border-2 border-border rounded-xl bg-muted/30 resize-none leading-relaxed"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 text-center">
                    <p className="text-lg font-bold text-foreground mb-2">Tool Implementation Coming Soon</p>
                    <p className="text-sm text-muted-foreground">The {type} tool is currently under development.</p>
                </div>
            </div>
        </div>
    );
}
