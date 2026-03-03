"use client";
import { useState, useMemo } from 'react';
import { CreditCard, DollarSign, TrendingDown, Copy, Check, Info, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function CreditCardPayoffCalculator() {
    const [balance, setBalance] = useState<number>(5000);
    const [apr, setApr] = useState<number>(24);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(200);
    const [mode, setMode] = useState<'payment' | 'months'>('payment');
    const [targetMonths, setTargetMonths] = useState<number>(24);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const monthlyRate = apr / 100 / 12;
        let months = 0, totalInterest = 0, bal = balance;

        if (mode === 'payment') {
            if (monthlyPayment <= bal * monthlyRate) return { months: 999, totalInterest: 0, requiredPayment: monthlyPayment, totalPaid: 0, impossible: true };
            while (bal > 0.01 && months < 600) {
                const interest = bal * monthlyRate;
                totalInterest += interest;
                bal = bal + interest - monthlyPayment;
                months++;
            }
            return { months, totalInterest, requiredPayment: monthlyPayment, totalPaid: monthlyPayment * months, impossible: false };
        } else {
            const req = monthlyRate === 0
                ? balance / targetMonths
                : balance * monthlyRate / (1 - Math.pow(1 + monthlyRate, -targetMonths));
            let b = balance;
            for (let i = 0; i < targetMonths; i++) {
                const int = b * monthlyRate;
                totalInterest += int;
                b = b + int - req;
            }
            return { months: targetMonths, totalInterest, requiredPayment: req, totalPaid: req * targetMonths, impossible: false };
        }
    }, [balance, apr, monthlyPayment, mode, targetMonths]);

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    const fmtFull = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Credit Card Payoff:\nBalance: ${fmt(balance)}\nAPR: ${apr}%\nPayoff: ${result.impossible ? 'Not possible' : `${result.months} months`}\nTotal Interest: ${fmt(result.totalInterest)}\nRequired Monthly Payment: ${fmtFull(result.requiredPayment)}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Card Details</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Current Balance</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground">Annual APR ({apr}%)</label>
                        <input type="range" min="1" max="36" step="0.1" value={apr} onChange={e => setApr(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Calculation Mode</label>
                        <div className="flex gap-2">
                            {[{ id: 'payment', label: 'By Payment' }, { id: 'months', label: 'By Timeline' }].map(m => (
                                <button key={m.id} onClick={() => setMode(m.id as any)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all', mode === m.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {mode === 'payment' ? (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Monthly Payment</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground">Payoff in {targetMonths} Months</label>
                            <input type="range" min="3" max="120" value={targetMonths} onChange={e => setTargetMonths(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payoff Strategy</h3>

                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                    {result.impossible ? (
                        <div className="text-center space-y-4">
                            <div className="text-5xl font-black text-red-500">Impossible</div>
                            <p className="text-sm font-bold text-muted-foreground">Payment does not cover interest</p>
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs font-medium text-red-600">
                                Minimum required: {fmtFull(balance * (apr / 100 / 12) + 1)}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 w-full">
                            <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">
                                {result.months}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Months to be Debt-Free
                            </div>
                            <div className="flex gap-4 opacity-80 flex-wrap justify-center">
                                <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-xs shadow-sm">
                                    Total Interest: {fmt(result.totalInterest)}
                                </div>
                                <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-xs shadow-sm">
                                    Total Paid: {fmt(result.totalPaid)}
                                </div>
                            </div>
                            
                            <div className="pt-4 mt-4 border-t border-border/50 w-full">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Required Payment</p>
                                <p className="text-2xl font-black text-foreground">{fmtFull(result.requiredPayment)}/mo</p>
                            </div>
                        </div>
                    )}

                    {!result.impossible && (
                        <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy Payoff Plan'}
                        </button>
                    )}
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Increasing your payment by even <strong>$50/month</strong> can save you thousands in interest and shave years off your timeline.
                    </p>
                </div>
            </div>
        </div>
    );
}
