"use client";
import { useState, useMemo } from 'react';
import { Briefcase, DollarSign, PieChart, Copy, Check, Info, ArrowUpRight, Percent } from 'lucide-react';
import { cn } from '@/utils/cn';

const US_TAX_BRACKETS_2024 = [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
];

export function FreelanceTaxCalculator() {
    const [annualIncome, setAnnualIncome] = useState<number>(80000);
    const [expenses, setExpenses] = useState<number>(10000);
    const [state, setState] = useState<number>(5);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const netProfit = Math.max(0, annualIncome - expenses);
        // Self-employment tax (15.3% on 92.35% of net profit)
        const seTaxable = netProfit * 0.9235;
        const seTax = seTaxable * 0.153;
        // SE tax deduction (half of SE tax)
        const seDeduction = seTax * 0.5;
        const agi = netProfit - seDeduction;

        // Federal income tax
        let fedTax = 0;
        for (const bracket of US_TAX_BRACKETS_2024) {
            if (agi <= bracket.min) break;
            const taxableInBracket = Math.min(agi, bracket.max) - bracket.min;
            fedTax += taxableInBracket * bracket.rate;
        }

        const stateTax = agi * (state / 100);
        const totalTax = seTax + fedTax + stateTax;
        const quarterlyEst = totalTax / 4;
        const effectiveRate = netProfit > 0 ? (totalTax / netProfit) * 100 : 0;

        return { netProfit, seTax, fedTax, stateTax, totalTax, quarterlyEst, effectiveRate };
    }, [annualIncome, expenses, state]);

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Freelance Tax Estimate:\nGross Income: ${fmt(annualIncome)}\nBusiness Expenses: ${fmt(expenses)}\nNet Profit: ${fmt(result.netProfit)}\nSelf-Employment Tax: ${fmt(result.seTax)}\nFederal Income Tax: ${fmt(result.fedTax)}\nState Tax (${state}%): ${fmt(result.stateTax)}\nTotal Tax Owed: ${fmt(result.totalTax)}\nQuarterly Payments: ${fmt(result.quarterlyEst)}\nEffective Tax Rate: ${result.effectiveRate.toFixed(1)}%`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Income & Expenses</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Annual Gross Income</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Business Expenses</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">State Tax Rate ({state}%)</label>
                        <input type="range" min="0" max="13" step="0.1" value={state} onChange={e => setState(Number(e.target.value))} className="w-full accent-primary" />
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                            <span>NY: 6.8%</span>
                            <span>CA: 9.3%</span>
                            <span>TX/FL: 0%</span>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest text-center">Based on 2024 US tax brackets</p>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tax Estimate Result</h3>
                
                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="text-center space-y-4 w-full">
                        <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                            {fmt(result.quarterlyEst)}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Estimated Quarterly Payment
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full mt-6">
                            {[
                                { label: 'Net Profit', value: fmt(result.netProfit) },
                                { label: 'Effective Rate', value: `${result.effectiveRate.toFixed(1)}%` },
                            ].map(item => (
                                <div key={item.label} className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</span>
                                    <span className="block text-lg font-black text-foreground">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="w-full space-y-3 bg-card/50 p-6 rounded-2xl border border-border/50 text-left mt-4 text-xs font-bold transition-all">
                            <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                                <span className="text-muted-foreground uppercase tracking-wider">Self-Employment (15.3%)</span>
                                <span className="text-foreground">{fmt(result.seTax)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                                <span className="text-muted-foreground uppercase tracking-wider">Federal Income Tax</span>
                                <span className="text-foreground">{fmt(result.fedTax)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                                <span className="text-muted-foreground uppercase tracking-wider">State Income Tax</span>
                                <span className="text-foreground">{fmt(result.stateTax)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 text-primary font-black">
                                <span className="uppercase tracking-widest">Total Annual Owed</span>
                                <span>{fmt(result.totalTax)}</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'Copied to Clipboard' : 'Copy Full Estimate'}
                    </button>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Setting aside <strong>30%</strong> of your gross income for taxes is a safe rule of thumb for most US-based freelancers.
                    </p>
                </div>
            </div>
        </div>
    );
}
