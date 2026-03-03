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
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Briefcase className="w-8 h-8 text-primary" /></div>
                        FREELANCE TAX ESTIMATOR
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Estimate quarterly taxes as a self-employed individual.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY ESTIMATE'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Income & Expenses
                    </h3>

                    {[
                        { label: 'Annual Gross Income', value: annualIncome, setter: setAnnualIncome },
                        { label: 'Business Expenses', value: expenses, setter: setExpenses },
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
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">State Income Tax Rate <span>{state}%</span></label>
                        <input type="range" min="0" max="13" step="0.1" value={state} onChange={e => setState(Number(e.target.value))} className="w-full accent-primary" />
                        <p className="text-xs text-muted-foreground">Common rates: CA 9.3%, NY 6.8%, TX 0%, FL 0%</p>
                    </div>

                    <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-2xl p-4">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400">⚠️ Estimates only. Based on 2024 US tax brackets. Consult a tax professional.</p>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <PieChart className="w-5 h-5" /> Quarterly Tax Payment
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {fmt(result.quarterlyEst)}
                            </h2>
                            <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>Effective rate: {result.effectiveRate.toFixed(1)}% of net profit</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Net Profit', value: fmt(result.netProfit), icon: DollarSign, colBg: 'bg-green-500/10', colText: 'text-green-500', desc: 'Income minus expenses' },
                            { label: 'SE Tax (15.3%)', value: fmt(result.seTax), icon: Percent, colBg: 'bg-red-500/10', colText: 'text-red-500', desc: 'Social Security + Medicare' },
                            { label: 'Federal Tax', value: fmt(result.fedTax), icon: Briefcase, colBg: 'bg-blue-500/10', colText: 'text-blue-500', desc: 'US income tax' },
                            { label: 'State Tax', value: fmt(result.stateTax), icon: PieChart, colBg: 'bg-purple-500/10', colText: 'text-purple-500', desc: `At ${state}% rate` },
                        ].map(({ label, value, icon: Icon, colBg, colText, desc }) => (
                            <div key={label} className="bg-card border-2 border-border p-5 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={cn('p-2.5 rounded-2xl group-hover:scale-110 transition-transform', colBg)}>
                                        <Icon className={cn('w-5 h-5', colText)} />
                                    </div>
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</span>
                                </div>
                                <p className="text-xl font-black text-foreground">{value}</p>
                                <p className="text-xs text-muted-foreground font-medium mt-1">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Freelancer Tax Tip</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Set aside <strong>25–30%</strong> of every payment received. Track all business expenses — software, equipment, home office — to legally reduce your taxable income.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
