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
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Car className="w-8 h-8 text-primary" /></div>
                        CAR LOAN CALCULATOR
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Calculate your monthly car payments and total cost.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY SUMMARY'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <div className="space-y-4 col-span-full">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Car className="w-4 h-4" /> Vehicle & Loan Details
                        </h3>
                    </div>

                    {[
                        { label: 'Vehicle Price', value: price, setter: setPrice },
                        { label: 'Down Payment', value: downPayment, setter: setDownPayment },
                        { label: 'Trade-In Value', value: tradeIn, setter: setTradeIn },
                    ].map(({ label, value, setter }) => (
                        <div key={label} className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase">{label}</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input type="number" value={value} onChange={e => setter(Number(e.target.value))} className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-lg" />
                            </div>
                        </div>
                    ))}

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Interest Rate <span>{rate}%</span>
                        </label>
                        <input type="range" min="0" max="25" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Sales Tax <span>{salesTax}%</span>
                        </label>
                        <input type="range" min="0" max="15" step="0.1" value={salesTax} onChange={e => setSalesTax(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3 col-span-full">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Loan Term</label>
                        <div className="flex gap-2 flex-wrap">
                            {termOptions.map(t => (
                                <button key={t} onClick={() => setTerm(t)} className={cn('px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all', term === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>
                                    {t} mo
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <Car className="w-5 h-5" /> Monthly Payment
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {fmt(result.monthly)}
                            </h2>
                            <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>Over {term} months at {rate}% APR</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Loan Amount', value: fmt(result.loanAmount), icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'After down payment & trade-in' },
                            { label: 'Total Interest', value: fmt(result.totalInterest), icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Extra cost of financing' },
                        ].map(({ label, value, icon: Icon, color, bg, desc }) => (
                            <div key={label} className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn('p-3 rounded-2xl group-hover:scale-110 transition-transform', bg)}>
                                        <Icon className={cn('w-6 h-6', color)} />
                                    </div>
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{value}</p>
                                <p className="text-sm text-muted-foreground font-medium mt-1">{desc}</p>
                            </div>
                        ))}

                        <div className="bg-card border-2 border-border p-6 rounded-3xl col-span-full hover:border-primary/50 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <DollarSign className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Total Vehicle Cost</span>
                                    <p className="text-3xl font-black text-foreground">{fmt(result.totalPayment + downPayment + tradeIn)}</p>
                                </div>
                            </div>
                            <div className="w-full bg-muted/30 h-3 rounded-full overflow-hidden mt-4 border border-border">
                                <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000" style={{ width: `${(result.loanAmount / (result.totalPayment + downPayment + tradeIn)) * 100}%` }} />
                            </div>
                            <p className="text-xs text-muted-foreground font-bold mt-3 text-center uppercase tracking-widest">
                                Interest is {result.loanAmount > 0 ? ((result.totalInterest / result.loanAmount) * 100).toFixed(1) : 0}% of the financed amount
                            </p>
                        </div>
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Car Buying Tip</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">A larger down payment (20%+) significantly reduces monthly payments and total interest. Getting pre-approved by a bank before visiting the dealership gives you negotiating leverage.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
