"use client";
import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, FileCode, AlertCircle, Copy, CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

interface JSONFormatterProps {
    input: string;
    setInput: (value: string) => void;
    output: string;
    setOutput: (value: string) => void;
    jsonMode: 'beautify' | 'minify';
    setJsonMode: (mode: 'beautify' | 'minify') => void;
    validationError: string;
    setValidationError: (error: string) => void;
    showConverters: boolean;
    setShowConverters: (show: boolean) => void;
    onConvertToCSV: () => void;
    onConvertToXML: () => void;
    copied: boolean;
    onCopy: () => void;
    onDownload: () => void;
}

export function JSONFormatter({
    input, setInput, output, setOutput, jsonMode, setJsonMode,
    validationError, showConverters, setShowConverters,
    onConvertToCSV, onConvertToXML, copied, onCopy, onDownload
}: JSONFormatterProps) {
    return (
        <>
            <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-muted p-1 rounded-xl border-2 border-border shadow-sm flex gap-1">
                    <button
                        className={cn("px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm border", jsonMode === 'beautify'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                            : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                        )}
                        onClick={() => setJsonMode('beautify')}
                    >
                        <Maximize2 className="h-4 w-4" />
                        Beautify
                    </button>
                    <button
                        className={cn("px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm border", jsonMode === 'minify'
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                            : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                        )}
                        onClick={() => setJsonMode('minify')}
                    >
                        <Minimize2 className="h-4 w-4" />
                        Minify
                    </button>
                </div>
                <button
                    onClick={() => setShowConverters(!showConverters)}
                    disabled={!input.trim()}
                    className="px-4 py-3 bg-secondary text-foreground border-2 border-border rounded-xl hover:border-accent transition-all font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileCode className="h-4 w-4" />
                    Converters
                </button>
            </div>

            {validationError && (
                <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-destructive mb-1">Invalid JSON</h4>
                        <p className="text-sm text-destructive/80">{validationError}</p>
                    </div>
                </div>
            )}

            {showConverters && (
                <div className="bg-muted/30 border-2 border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-lg">Convert JSON To</h3>
                    <div className="flex gap-3">
                        <button onClick={onConvertToCSV} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all">
                            CSV
                        </button>
                        <button onClick={onConvertToXML} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all">
                            XML
                        </button>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold">Input JSON</label>
                        <button onClick={() => setInput('')} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-96 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 focus:border-primary outline-none resize-none"
                        placeholder='{"key": "value"}'
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


