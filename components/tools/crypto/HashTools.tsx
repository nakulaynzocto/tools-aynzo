"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { generateMD5, generateSHA256, generateSHA512 } from '@/components/utils/crypto/cryptoProcessing';

interface HashToolsProps {
    type: 'md5-hash' | 'sha256-hash' | 'sha512-hash';
}

export function HashTools({ type }: HashToolsProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!input) {
            setOutput('');
            return;
        }
        try {
            if (type === 'md5-hash') {
                setOutput(generateMD5(input));
            } else if (type === 'sha256-hash') {
                setOutput(generateSHA256(input));
            } else if (type === 'sha512-hash') {
                setOutput(generateSHA512(input));
            }
        } catch (error: any) {
            setOutput('Error: ' + error.message);
        }
    }, [input, type]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Input Data</label>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold">{input.length} Chars</span>
                </div>
                <textarea
                    className="w-full p-6 border-2 border-border rounded-3xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground placeholder-muted-foreground min-h-[300px] shadow-inner transition-all"
                    placeholder="Enter text to hash..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    rows={8}
                />
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Output</label>
                    <button
                        onClick={copyToClipboard}
                        disabled={!output}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all disabled:opacity-30 ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                    >
                        {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                        {copied ? 'COPIED' : 'COPY'}
                    </button>
                </div>
                <div className="w-full p-6 bg-muted/30 border-2 border-border rounded-3xl font-mono text-sm break-all text-primary shadow-inner min-h-[300px] whitespace-pre-wrap flex flex-col items-center justify-center">
                    {output ? output : (
                        <div className="text-muted-foreground/30 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest">Waiting for input...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


