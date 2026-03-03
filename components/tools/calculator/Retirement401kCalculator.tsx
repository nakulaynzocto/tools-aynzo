"use client";
import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, PieChart, Briefcase, Info, ArrowUpRight, Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RetirementResult {
    totalSavings: number;
    employeeContributions: number;
    employerMatch: number;
    totalInterest: number;
}

export function Retirement401kCalculator() {
    const [currentAge, setCurrentAge] = useState<number>(30);
    const [retirementAge, setRetirementAge] = useState<number>(65);
    const [annualSalary, setAnnualSalary] = useState<number>(75000);
    const [currentBalance, setCurrentBalance] = useState<number>(10000);
    const [contributionRate, setContributionRate] = useState<number>(6);
    const [employerMatch, setEmployerMatch] = useState<number>(3);
    const [employerLimit, setEmployerLimit] = useState<number>(100);
    const [expectedReturn, setExpectedReturn] = useState<number>(7);
    const [salaryIncrease, setSalaryIncrease] = useState<number>(3);
    const [copied, setCopied] = useState(false);

    const result = useMemo<RetirementResult>(() => {
        let totalSavings = currentBalance;
        let employeeContributions = 0;
        let totalEmployerMatch = 0;
        let currentSalary = annualSalary;
        const yearsToRetirement = retirementAge - currentAge;

        if (yearsToRetirement <= 0) {
            return {
                totalSavings: currentBalance,
                employeeContributions: 0,
                employerMatch: 0,
                totalInterest: 0
            };
        }

        for (let i = 0; i < yearsToRetirement; i++) {
            const annualContribution = currentSalary * (contributionRate / 100);
            const annualMatch = currentSalary * (Math.min(contributionRate, employerMatch) / 100) * (employerLimit / 100);
            
            totalSavings += annualContribution + annualMatch;
            employeeContributions += annualContribution;
            totalEmployerMatch += annualMatch;
            
            // Apply return (compounded annually)
            totalSavings *= (1 + expectedReturn / 100);
            
            // Salary growth
            currentSalary *= (1 + salaryIncrease / 100);
        }

        return {
            totalSavings,
            employeeContributions,
            employerMatch: totalEmployerMatch,
            totalInterest: totalSavings - currentBalance - employeeContributions - totalEmployerMatch
        };
    }, [currentAge, retirementAge, annualSalary, currentBalance, contributionRate, employerMatch, employerLimit, expectedReturn, salaryIncrease]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleCopy = () => {
        const text = `401k Retirement Projection:\nTotal Savings: ${formatCurrency(result.totalSavings)}\nMy Contributions: ${formatCurrency(result.employeeContributions)}\nEmployer Match: ${formatCurrency(result.employerMatch)}\nTotal Interest: ${formatCurrency(result.totalInterest)}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        401k RETIREMENT PLANNER
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">
                        Visualize your future wealth with employer matching.
                    </p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY PROJECTION'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <div className="space-y-4 col-span-full">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Personal & Salary Details
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Current Age <span>{currentAge} yrs</span>
                        </label>
                        <input
                            type="range"
                            min="18"
                            max="75"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Retirement Age <span>{retirementAge} yrs</span>
                        </label>
                        <input
                            type="range"
                            min={currentAge + 1}
                            max="90"
                            value={retirementAge}
                            onChange={(e) => setRetirementAge(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Current Annual Salary</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="number"
                                value={annualSalary}
                                onChange={(e) => setAnnualSalary(Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Initial 401k Balance</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="number"
                                value={currentBalance}
                                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                                className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 col-span-full pt-4 border-t border-border/50">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Contributions & Returns
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Contribution Rate <span>{contributionRate}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            value={contributionRate}
                            onChange={(e) => setContributionRate(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Expected Rate of Return <span>{expectedReturn}%</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="12"
                            step="0.1"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Employer Match up to <span>{employerMatch}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={employerMatch}
                            onChange={(e) => setEmployerMatch(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">
                            Annual Salary Increase <span>{salaryIncrease}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={salaryIncrease}
                            onChange={(e) => setSalaryIncrease(Number(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Est. Balance at Age {retirementAge}
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {formatCurrency(result.totalSavings)}
                            </h2>
                            <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>Based on {retirementAge - currentAge} years of growth</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <DollarSign className="w-6 h-6 text-blue-500" />
                                </div>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">My Savings</span>
                            </div>
                            <p className="text-2xl font-black text-foreground">{formatCurrency(result.employeeContributions)}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Total personal contributions</p>
                        </div>

                        <div className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <PieChart className="w-6 h-6 text-purple-500" />
                                </div>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Employer Match</span>
                            </div>
                            <p className="text-2xl font-black text-foreground">{formatCurrency(result.employerMatch)}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Free money from matching</p>
                        </div>

                        <div className="bg-card border-2 border-border p-6 rounded-3xl col-span-full hover:border-primary/50 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-3 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Total Interest Earned</span>
                                    <p className="text-3xl font-black text-foreground">{formatCurrency(result.totalInterest)}</p>
                                </div>
                            </div>
                            <div className="w-full bg-muted/30 h-3 rounded-full overflow-hidden mt-4 border border-border">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                                    style={{ width: `${(result.totalInterest / result.totalSavings) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground font-bold mt-3 text-center uppercase tracking-widest">
                                Interest makes up {((result.totalInterest / result.totalSavings) * 100).toFixed(1)}% of your total wealth
                            </p>
                        </div>
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Retirement Tip</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Always contribute at least enough to get the full **Employer Match**. It's effectively a 100% immediate return on your investment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
