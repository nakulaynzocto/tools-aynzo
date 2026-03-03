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

    const getSliderStyle = (value: number, min: number, max: number) => {
        const percentage = ((value - min) / (max - min)) * 100;
        return {
            background: `linear-gradient(to right, #074463 ${percentage}%, #e5e7eb ${percentage}%)`
        };
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Savings Strategy</h3>
                
                <div className="space-y-8 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Savings Goal</span>
                            <span className="text-primary text-base">{fmt(goal)}</span>
                        </div>
                        <input 
                            type="range" min="1000" max="1000000" step="1000" value={goal} 
                            onChange={e => setGoal(Number(e.target.value))} 
                            style={getSliderStyle(goal, 1000, 1000000)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Current Savings</span>
                            <span className="text-primary text-base">{fmt(currentSavings)}</span>
                        </div>
                        <input 
                            type="range" min="0" max={goal} step="500" value={currentSavings} 
                            onChange={e => setCurrentSavings(Number(e.target.value))} 
                            style={getSliderStyle(currentSavings, 0, goal)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Monthly Contribution</span>
                            <span className="text-primary text-base">{fmt(monthlyContrib)}/mo</span>
                        </div>
                        <input 
                            type="range" min="10" max="20000" step="50" value={monthlyContrib} 
                            onChange={e => setMonthlyContrib(Number(e.target.value))} 
                            style={getSliderStyle(monthlyContrib, 10, 20000)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Annual Interest Rate</span>
                            <span className="text-primary text-base">{annualRate}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="20" step="0.1" value={annualRate} 
                            onChange={e => setAnnualRate(Number(e.target.value))} 
                            style={getSliderStyle(annualRate, 0, 20)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth Ratio</label>
                            <div className="text-sm font-bold text-foreground">
                                {((result.totalContrib + result.totalInterest + currentSavings) / (result.totalContrib + currentSavings) || 1).toFixed(2)}x Wealth
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progress</label>
                            <div className="text-sm font-bold text-foreground">
                                {pct.toFixed(0)}% Achieved
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4 transition-all hover:bg-primary/10">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Consistency is the key to reaching your <strong>Financial Goals</strong>. Automating your savings is the most proven way to stay on track.
                    </p>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time Horizon Projection</h3>
                
                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="text-center space-y-4 w-full">
                        <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                            {result.achieved ? '0' : result.months} <span className="text-4xl text-muted-foreground">mo</span>
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Months to Reach Your Goal
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full mt-6">
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Saved</span>
                                <span className="block text-lg font-black text-foreground">{fmt(result.totalContrib + currentSavings)}</span>
                            </div>
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center text-emerald-500">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Interest Earned</span>
                                <span className="block text-lg font-black">+{fmt(result.totalInterest)}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-2 mt-4 text-left">
                            <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mb-1">
                                <span>Progress to Goal</span>
                                <span>{pct.toFixed(0)}% Milestones</span>
                            </div>
                            <div className="w-full bg-card h-3 rounded-full overflow-hidden flex border border-border/50">
                                <div 
                                    className="h-full bg-primary transition-all duration-1000" 
                                    style={{ width: `${pct}%` }} 
                                />
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <Check className="text-emerald-500" size={12} /> : <Copy size={12} />}
                        {copied ? 'Projection Copied' : 'Copy All Results'}
                    </button>
                </div>
            </div>
        </div>
    );
}
