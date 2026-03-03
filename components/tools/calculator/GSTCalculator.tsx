"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GSTResult {
    tax: string;
    total?: string;
    original?: string;
    label: string;
}

export function GSTCalculator() {
    const [inputs, setInputs] = useState({ amount: '', rate: '18', type: 'inclusive' as 'inclusive' | 'exclusive' });
    const [copied, setCopied] = useState(false);

    const result = useMemo<GSTResult | null>(() => {
        const amt = parseFloat(inputs.amount);
        const r = parseFloat(inputs.rate);
        if (!amt || !r || isNaN(amt) || isNaN(r)) {
            return null;
        }

        if (inputs.type === 'exclusive') {
            const tax = (amt * r) / 100;
            return {
                tax: tax.toFixed(2),
                total: (amt + tax).toFixed(2),
                label: 'Total with GST'
            };
        } else {
            const base = (amt * 100) / (100 + r);
            const tax = amt - base;
            return {
                tax: tax.toFixed(2),
                original: base.toFixed(2),
                label: 'Base Amount'
            };
        }
    }, [inputs]);

    const copy = () => {
        if (!result) return;
        const text = `GST Tax: ${result.tax}\n${result.label}: ${result.total || result.original}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Inputs</h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase opacity-50">Amount</label>
                        <input type="number" value={inputs.amount} onChange={e => setInputs({ ...inputs, amount: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="1000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">GST Rate (%)</label>
                            <input type="number" value={inputs.rate} onChange={e => setInputs({ ...inputs, rate: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-bold focus:border-primary outline-none" placeholder="18" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Tax Type</label>
                            <div className="bg-muted p-1 rounded-xl flex gap-1 h-[60px]">
                                {['inclusive', 'exclusive'].map(t => (
                                    <button key={t} onClick={() => setInputs({ ...inputs, type: t as any })} className={cn("flex-1 text-[10px] font-black uppercase rounded-lg transition-all", inputs.type === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">GST Tax</span>
                                <span className="text-xl font-black text-emerald-500">${result.tax}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{result.label}</span>
                                <span className="text-xl font-black text-primary">${result.total || result.original}</span>
                            </div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter amount and GST rate to calculate</span>
                    </div>
                )}
            </div>
        </div>
    );
}



