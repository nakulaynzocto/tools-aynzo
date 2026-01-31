"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Settings } from 'lucide-react';
import { generateBcrypt } from '@/components/utils/crypto/cryptoProcessing';

export function BcryptGenerator() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [rounds, setRounds] = useState(10);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!input) {
            setOutput('');
            return;
        }
        const timeoutId = setTimeout(async () => {
            try {
                const hash = await generateBcrypt(input, rounds);
                setOutput(hash);
            } catch (error: any) {
                setOutput('Error: ' + error.message);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [input, rounds]);

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
            <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Input Data</label>
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold">{input.length} Chars</span>
                        </div>
                        <textarea
                            className="w-full p-6 border-2 border-border rounded-3xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground placeholder-muted-foreground min-h-[300px] shadow-inner transition-all"
                            placeholder="Enter password to hash..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            rows={8}
                        />
                    </div>
                    <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border space-y-4 max-w-md">
                        <h4 className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-2">
                            <Settings size={12} /> Rounds
                        </h4>
                        <div className="flex items-center gap-6">
                            <div className="flex-1 space-y-2">
                                <input
                                    type="range"
                                    min="4"
                                    max="14"
                                    step="1"
                                    value={rounds}
                                    onChange={(e) => setRounds(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] font-black opacity-50 uppercase">
                                    <span>Fast ({rounds})</span>
                                    <span>Secure (14)</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </div>
    );
}


