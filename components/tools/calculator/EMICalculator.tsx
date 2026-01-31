"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateEMI } from '@/components/utils/calculator/calculatorProcessing';

export function EMICalculator() {
    const [emi, setEmi] = useState({ principal: '', rate: '', tenure: '', type: 'months' as 'months' | 'years' });
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const p = parseFloat(emi.principal);
        const rate = parseFloat(emi.rate) / 12 / 100;
        const n = emi.type === 'years' ? parseFloat(emi.tenure) * 12 : parseFloat(emi.tenure);
        if (!p || !rate || !n) {
            setResult(null);
            return;
        }
        const res = calculateEMI({ principal: p, rate: parseFloat(emi.rate), tenure: n });
        setResult({ monthly: res.emi, total: res.totalAmount, interest: res.totalInterest });
    }, [emi]);

    const copy = () => {
        const text = typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Inputs</h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase opacity-50">Principal Amount</label>
                        <input type="number" value={emi.principal} onChange={e => setEmi({ ...emi, principal: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="100000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Interest Rate (%)</label>
                            <input type="number" value={emi.rate} onChange={e => setEmi({ ...emi, rate: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="8.5" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Tenure</label>
                            <input type="number" value={emi.tenure} onChange={e => setEmi({ ...emi, tenure: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium rounded-b-none border-b-0" placeholder="12" />
                            <div className="bg-muted p-1 rounded-b-xl flex gap-1">
                                {['months', 'years'].map(t => (
                                    <button key={t} onClick={() => setEmi({ ...emi, type: t as any })} className={cn("flex-1 py-1 text-[9px] font-black uppercase rounded-lg", emi.type === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="w-full space-y-4">
                            {Object.entries(result).map(([k, v]: [string, any]) => (
                                <div key={k} className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{k.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-xl font-black text-foreground">{v}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter principal, rate and tenure to calculate EMI</span>
                    </div>
                )}
            </div>
        </div>
    );
}

