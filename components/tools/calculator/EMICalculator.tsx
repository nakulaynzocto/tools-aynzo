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
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loan Details</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Principal Amount</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                            <input type="number" value={inputs.principal} onChange={e => setInputs({ ...inputs, principal: e.target.value })} className="w-full pl-8 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" placeholder="100000" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Interest Rate</label>
                            <div className="relative group">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                                <input type="number" value={inputs.rate} onChange={e => setInputs({ ...inputs, rate: e.target.value })} className="w-full pl-4 pr-10 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" placeholder="8.5" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Loan Tenure</label>
                            <input type="number" value={inputs.tenure} onChange={e => setInputs({ ...inputs, tenure: e.target.value })} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" placeholder="12" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Tenure Type</label>
                        <div className="flex p-1 bg-muted/20 rounded-xl gap-1">
                            {['months', 'years'].map(t => (
                                <button key={t} onClick={() => setInputs({ ...inputs, type: t as any })} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all", inputs.type === t ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}>{t}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">EMI Result</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                        <div className="text-center space-y-4 w-full">
                            <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                                ${result.monthly}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Monthly EMI Amount
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center text-emerald-500">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Interest</span>
                                    <span className="block text-lg font-black">${result.interest}</span>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Payment</span>
                                    <span className="block text-lg font-black text-foreground">${result.total}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy Loan Details'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter loan details to see EMI</span>
                    </div>
                )}
            </div>
        </div>
    );
}



