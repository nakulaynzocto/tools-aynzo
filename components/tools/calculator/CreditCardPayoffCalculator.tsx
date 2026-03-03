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
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><CreditCard className="w-8 h-8 text-primary" /></div>
                        CREDIT CARD PAYOFF
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">See exactly when you'll be debt-free.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY RESULTS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Card Details
                    </h3>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Current Balance</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-lg" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Annual APR <span>{apr}%</span></label>
                        <input type="range" min="1" max="36" step="0.1" value={apr} onChange={e => setApr(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase">Calculation Mode</label>
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
                            <label className="text-sm font-bold text-muted-foreground uppercase">Monthly Payment</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(Number(e.target.value))} className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-lg" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Payoff in Months <span>{targetMonths} mo</span></label>
                            <input type="range" min="3" max="120" value={targetMonths} onChange={e => setTargetMonths(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    {result.impossible ? (
                        <div className="bg-gradient-to-br from-red-600 to-red-500 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                            <div className="relative z-10 text-center space-y-3">
                                <p className="font-black uppercase tracking-widest text-sm text-white/80">Warning</p>
                                <h2 className="text-3xl font-black">Payment Too Low!</h2>
                                <p className="text-white/80">Your payment doesn't cover the interest. Increase your monthly payment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                            <div className="relative z-10 space-y-4">
                                <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                    <Calendar className="w-5 h-5" /> Time to Be Debt-Free
                                </p>
                                <h2 className="text-6xl font-black tracking-tighter drop-shadow-lg">
                                    {result.months} <span className="text-4xl">months</span>
                                </h2>
                                <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                    <ArrowUpRight className="w-5 h-5" />
                                    <span>Required payment: {fmtFull(result.requiredPayment)}/mo</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!result.impossible && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-red-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                        <TrendingDown className="w-6 h-6 text-red-500" />
                                    </div>
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Interest Paid</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{fmt(result.totalInterest)}</p>
                                <p className="text-sm text-muted-foreground font-medium mt-1">Total interest cost</p>
                            </div>
                            <div className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                        <DollarSign className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Paid</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{fmt(result.totalPaid)}</p>
                                <p className="text-sm text-muted-foreground font-medium mt-1">Principal + interest</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Payoff Strategy</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Doubling your minimum payment can cut payoff time by <strong>50% or more</strong>. Consider the <strong>avalanche method</strong>: pay off highest APR cards first to minimize total interest paid.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
