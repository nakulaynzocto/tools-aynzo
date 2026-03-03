"use client";
import { useState, useMemo } from 'react';
import { Car, DollarSign, TrendingUp, Copy, Check, Info, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function CarLoanCalculator() {
    const [price, setPrice] = useState<number>(30000);
    const [downPayment, setDownPayment] = useState<number>(5000);
    const [tradeIn, setTradeIn] = useState<number>(0);
    const [rate, setRate] = useState<number>(6.5);
    const [term, setTerm] = useState<number>(60);
    const [salesTax, setSalesTax] = useState<number>(8);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const taxAmount = price * (salesTax / 100);
        const loanAmount = Math.max(0, price + taxAmount - downPayment - tradeIn);
        const monthlyRate = rate / 100 / 12;
        const monthly = monthlyRate === 0
            ? loanAmount / term
            : loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
        const totalPayment = monthly * term;
        const totalInterest = totalPayment - loanAmount;
        return { monthly, totalPayment, totalInterest, loanAmount, taxAmount };
    }, [price, downPayment, tradeIn, rate, term, salesTax]);

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Car Loan Summary:\nMonthly Payment: ${fmt(result.monthly)}\nLoan Amount: ${fmt(result.loanAmount)}\nTotal Interest: ${fmt(result.totalInterest)}\nTotal Cost: ${fmt(result.totalPayment + downPayment + tradeIn)}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const termOptions = [24, 36, 48, 60, 72, 84];

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Loan Details</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'Vehicle Price', value: price, setter: setPrice },
                            { label: 'Down Payment', value: downPayment, setter: setDownPayment },
                            { label: 'Trade-In Value', value: tradeIn, setter: setTradeIn },
                        ].map(({ label, value, setter }) => (
                            <div key={label} className="space-y-3">
                                <label className="text-sm font-bold text-foreground uppercase tracking-wider">{label}</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input type="number" value={value} onChange={e => setter(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                                </div>
                            </div>
                        ))}

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground">Interest Rate ({rate}%)</label>
                            <input type="range" min="0" max="25" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground">Sales Tax ({salesTax}%)</label>
                        <input type="range" min="0" max="15" step="0.1" value={salesTax} onChange={e => setSalesTax(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Loan Term</label>
                        <div className="flex gap-2 flex-wrap">
                            {termOptions.map(t => (
                                <button key={t} onClick={() => setTerm(t)} className={cn('px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all', term === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>
                                    {t} mo
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payment Summary</h3>

                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                    <div className="text-center space-y-4">
                        <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">
                            {fmt(result.monthly)}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Estimated Monthly Payment
                        </div>
                        <div className="flex gap-4 opacity-80 flex-wrap justify-center">
                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-xs shadow-sm">
                                Loan: {fmt(result.loanAmount)}
                            </div>
                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-xs shadow-sm">
                                Interest: {fmt(result.totalInterest)}
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-4 bg-card/50 p-6 rounded-2xl border border-border/50">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Total Cost</span>
                            <span className="text-foreground">{fmt(result.totalPayment + downPayment + tradeIn)}</span>
                        </div>
                        <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(result.loanAmount / (result.totalPayment + downPayment + tradeIn)) * 100}%` }} />
                        </div>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'Copied to Clipboard' : 'Copy Loan Summary'}
                    </button>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        A larger <strong>down payment</strong> reduces your monthly costs and total interest paid significantly.
                    </p>
                </div>
            </div>
        </div>
    );
}
