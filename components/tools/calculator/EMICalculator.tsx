"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EMIResult {
    monthly: string;
    total: string;
    interest: string;
}

export function EMICalculator() {
    const [inputs, setInputs] = useState({ principal: '', rate: '', tenure: '', type: 'months' as 'months' | 'years' });
    const [copied, setCopied] = useState(false);

    const result = useMemo<EMIResult | null>(() => {
        const p = parseFloat(inputs.principal);
        const r = parseFloat(inputs.rate);
        const t = parseFloat(inputs.tenure);

        if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) {
            return null;
        }

        const monthlyRate = r / 12 / 100;
        const totalMonths = inputs.type === 'years' ? t * 12 : t;

        const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const totalAmount = emi * totalMonths;
        const totalInterest = totalAmount - p;

        return {
            monthly: emi.toFixed(2),
            total: totalAmount.toFixed(2),
            interest: totalInterest.toFixed(2)
        };
    }, [inputs]);

    const copy = () => {
        if (!result) return;
        const text = `Monthly EMI: ${result.monthly}\nTotal Interest: ${result.interest}\nTotal Amount: ${result.total}`;
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
                        <label className="text-xs font-bold uppercase opacity-50">Principal Amount</label>
                        <input type="number" value={inputs.principal} onChange={e => setInputs({ ...inputs, principal: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="100000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Interest Rate (%)</label>
                            <input type="number" value={inputs.rate} onChange={e => setInputs({ ...inputs, rate: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="8.5" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Tenure</label>
                            <input type="number" value={inputs.tenure} onChange={e => setInputs({ ...inputs, tenure: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium rounded-b-none border-b-0 focus:border-primary outline-none" placeholder="12" />
                            <div className="bg-muted p-1 rounded-b-xl flex gap-1">
                                {['months', 'years'].map(t => (
                                    <button key={t} onClick={() => setInputs({ ...inputs, type: t as any })} className={cn("flex-1 py-1 text-[9px] font-black uppercase rounded-lg transition-all", inputs.type === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{t}</button>
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly EMI</span>
                                <span className="text-xl font-black text-primary">${result.monthly}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Interest</span>
                                <span className="text-xl font-black text-emerald-500">${result.interest}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Amount</span>
                                <span className="text-xl font-black text-foreground">${result.total}</span>
                            </div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter principal, rate and tenure to calculate EMI</span>
                    </div>
                )}
            </div>
        </div>
    );
}



