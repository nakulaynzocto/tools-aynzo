"use client";
import { Copy, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

interface URLEncoderDecoderProps {
    input: string;
    setInput: (value: string) => void;
    output: string;
    mode: 'encode' | 'decode';
    setMode: (mode: 'encode' | 'decode') => void;
    copied: boolean;
    onCopy: () => void;
    onDownload: () => void;
}

export function URLEncoderDecoder({ input, setInput, output, mode, setMode, copied, onCopy, onDownload }: URLEncoderDecoderProps) {
    return (
        <>
            <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-muted p-1 rounded-xl border-2 border-border shadow-sm flex gap-1">
                    <button
                        className={cn("px-6 py-2 rounded-lg font-bold transition-all text-sm border", mode === 'encode'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                            : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                        )}
                        onClick={() => setMode('encode')}
                    >
                        Encode
                    </button>
                    <button
                        className={cn("px-6 py-2 rounded-lg font-bold transition-all text-sm border", mode === 'decode'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                            : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                        )}
                        onClick={() => setMode('decode')}
                    >
                        Decode
                    </button>
                </div>
            </div>

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
                        placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL...'}
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold">Output</label>
                        <div className="flex gap-2">
                            <button onClick={onCopy} className={cn("p-2 rounded-lg transition-all", copied ? "bg-emerald-500 text-white" : "bg-muted hover:bg-primary hover:text-primary-foreground")}>
                                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <button onClick={onDownload} className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 resize-none"
                    />
                </div>
            </div>
        </>
    );
}


