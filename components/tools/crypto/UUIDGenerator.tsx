"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { generateUUID } from '@/components/utils/crypto/cryptoProcessing';

export function UUIDGenerator() {
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        setOutput(generateUUID());
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
        }
    };

    return (
        <div className="space-y-8">
            <button
                onClick={handleGenerate}
                className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
            >
                <RefreshCw className="w-6 h-6" />
                <span className="text-lg">Generate New UUID</span>
            </button>
            {output && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Output</label>
                        <button
                            onClick={copyToClipboard}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                        >
                            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                            {copied ? 'COPIED' : 'COPY'}
                        </button>
                    </div>
                    <div className="w-full p-6 bg-muted/30 border-2 border-border rounded-3xl font-mono text-sm break-all text-primary shadow-inner min-h-[100px] whitespace-pre-wrap flex flex-col items-center justify-center">
                        {output}
                    </div>
                </div>
            )}
        </div>
    );
}

