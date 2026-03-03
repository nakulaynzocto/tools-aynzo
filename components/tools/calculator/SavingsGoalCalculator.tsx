"use client";
import { useState, useMemo } from 'react';
import { Target, DollarSign, TrendingUp, Copy, Check, Info, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function SavingsGoalCalculator() {
    const [goal, setGoal] = useState<number>(20000);
    const [currentSavings, setCurrentSavings] = useState<number>(2000);
    const [monthlyContrib, setMonthlyContrib] = useState<number>(500);
    const [annualRate, setAnnualRate] = useState<number>(4.5);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const remaining = Math.max(0, goal - currentSavings);
        if (remaining === 0) return { months: 0, years: 0, totalContrib: 0, totalInterest: 0, achieved: true };
        const monthlyRate = annualRate / 100 / 12;
        let bal = currentSavings, months = 0, totalContrib = 0, totalInterest = 0;
        while (bal < goal && months < 1200) {
            const interest = bal * monthlyRate;
            totalInterest += interest;
            bal += interest + monthlyContrib;
            totalContrib += monthlyContrib;
            months++;
        }
        return { months, years: (months / 12).toFixed(1), totalContrib, totalInterest, achieved: false };
    }, [goal, currentSavings, monthlyContrib, annualRate]);

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    const pct = Math.min(100, (currentSavings / goal) * 100);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Savings Goal Tracker:\nGoal: ${fmt(goal)}\nCurrent Savings: ${fmt(currentSavings)}\nMonthly Contribution: ${fmt(monthlyContrib)}\nTime to Reach Goal: ${result.months} months (${result.years} years)\nTotal Interest Earned: ${fmt(result.totalInterest)}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Target className="w-8 h-8 text-primary" /></div>
                        SAVINGS GOAL TRACKER
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Find out when you'll reach your financial goal.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY RESULTS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <div className="space-y-4 col-span-full">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-4 h-4" /> Goal Details
                        </h3>
                    </div>

                    {[
                        { label: 'Savings Goal ($)', value: goal, setter: setGoal },
                        { label: 'Current Savings ($)', value: currentSavings, setter: setCurrentSavings },
                        { label: 'Monthly Contribution ($)', value: monthlyContrib, setter: setMonthlyContrib },
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
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Annual Interest Rate <span>{annualRate}%</span></label>
                        <input type="range" min="0" max="15" step="0.1" value={annualRate} onChange={e => setAnnualRate(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3 col-span-full pt-4 border-t border-border/50">
                        <div className="flex justify-between text-sm font-bold text-muted-foreground">
                            <span>Progress to Goal</span>
                            <span>{pct.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted/30 h-4 rounded-full overflow-hidden border border-border">
                            <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                            <span>{fmt(currentSavings)} saved</span>
                            <span>{fmt(goal)} goal</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <Calendar className="w-5 h-5" /> Time to Reach Goal
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {result.achieved ? '0' : result.months} <span className="text-4xl">mo</span>
                            </h2>
                            <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>{result.achieved ? 'Goal already achieved! 🎉' : `~${result.years} years at ${fmt(monthlyContrib)}/mo`}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Total Contributions', value: fmt(result.totalContrib), icon: DollarSign, colBg: 'bg-blue-500/10', colText: 'text-blue-500', desc: 'Your own deposits' },
                            { label: 'Interest Earned', value: fmt(result.totalInterest), icon: TrendingUp, colBg: 'bg-green-500/10', colText: 'text-green-500', desc: 'From compounding' },
                        ].map(({ label, value, icon: Icon, colBg, colText, desc }) => (
                            <div key={label} className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn('p-3 rounded-2xl group-hover:scale-110 transition-transform', colBg)}>
                                        <Icon className={cn('w-6 h-6', colText)} />
                                    </div>
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</span>
                                </div>
                                <p className="text-2xl font-black text-foreground">{value}</p>
                                <p className="text-sm text-muted-foreground font-medium mt-1">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Smart Saving Tip</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Automate your monthly contributions so you pay yourself first. Even small increases — like an extra <strong>$50/month</strong> — can shave months off your timeline significantly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
