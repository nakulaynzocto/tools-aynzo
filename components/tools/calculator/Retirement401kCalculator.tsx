"use client";
import React, { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Info } from 'lucide-react';


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
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Retirement Plan</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Current Age</span>
                            <span className="text-primary text-base">{currentAge} Years</span>
                        </div>
                        <input 
                            type="range" min="18" max="75" value={currentAge} 
                            onChange={e => setCurrentAge(Number(e.target.value))} 
                            style={getSliderStyle(currentAge, 18, 75)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Retirement Age</span>
                            <span className="text-primary text-base">{retirementAge} Years</span>
                        </div>
                        <input 
                            type="range" min={currentAge + 1} max="90" value={retirementAge} 
                            onChange={e => setRetirementAge(Number(e.target.value))} 
                            style={getSliderStyle(retirementAge, currentAge + 1, 90)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Annual Salary</span>
                            <span className="text-primary text-base">${annualSalary.toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" min="10000" max="500000" step="1000" value={annualSalary} 
                            onChange={e => setAnnualSalary(Number(e.target.value))} 
                            style={getSliderStyle(annualSalary, 10000, 500000)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Current 401k Balance</span>
                            <span className="text-primary text-base">${currentBalance.toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" min="0" max="1000000" step="5000" value={currentBalance} 
                            onChange={e => setCurrentBalance(Number(e.target.value))} 
                            style={getSliderStyle(currentBalance, 0, 1000000)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/30">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                <span>Contribution</span>
                                <span className="text-primary text-xs">{contributionRate}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="30" value={contributionRate} 
                                onChange={e => setContributionRate(Number(e.target.value))} 
                                style={getSliderStyle(contributionRate, 0, 30)}
                                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                <span>Expected Return</span>
                                <span className="text-primary text-xs">{expectedReturn}%</span>
                            </div>
                            <input 
                                type="range" min="1" max="15" step="0.5" value={expectedReturn} 
                                onChange={e => setExpectedReturn(Number(e.target.value))} 
                                style={getSliderStyle(expectedReturn, 1, 15)}
                                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                <span>Employer Match</span>
                                <span className="text-primary text-xs">{employerMatch}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="15" value={employerMatch} 
                                onChange={e => setEmployerMatch(Number(e.target.value))} 
                                style={getSliderStyle(employerMatch, 0, 15)}
                                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                <span>Salary Increase</span>
                                <span className="text-primary text-xs">{salaryIncrease}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="10" step="0.1" value={salaryIncrease} 
                                onChange={e => setSalaryIncrease(Number(e.target.value))} 
                                style={getSliderStyle(salaryIncrease, 0, 10)}
                                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth Ratio</label>
                            <div className="text-sm font-bold text-foreground">
                                {(result.totalSavings / (result.employeeContributions + result.employerMatch + (currentBalance || 1)) || 1).toFixed(2)}x Return
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Time Horizon</label>
                            <div className="text-sm font-bold text-foreground">
                                {retirementAge - currentAge} Years
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4 transition-all hover:bg-primary/10">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Maxing out your 401k contribution and catching the full <strong>Employer Match</strong> is one of the most effective ways to build retirement wealth.
                    </p>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Retirement Projection</h3>
                
                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="text-center space-y-4 w-full">
                        <div className="text-6xl md:text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                            {formatCurrency(result.totalSavings)}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Est. Balance at Age {retirementAge}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-6">
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">My Savings</span>
                                <span className="block text-base font-black text-foreground">{formatCurrency(result.employeeContributions)}</span>
                            </div>
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Employer Match</span>
                                <span className="block text-base font-black text-foreground">{formatCurrency(result.employerMatch)}</span>
                            </div>
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center text-emerald-500 col-span-2 md:col-span-1">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Interest</span>
                                <span className="block text-base font-black">+{formatCurrency(result.totalInterest)}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-2 mt-4 text-left">
                            <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mb-1">
                                <span>Interest vs Contributions</span>
                                <span>{((result.totalInterest / result.totalSavings) * 100).toFixed(0)}% Compound Growth</span>
                            </div>
                            <div className="w-full bg-card h-3 rounded-full overflow-hidden flex border border-border/50">
                                <div 
                                    className="h-full bg-muted-foreground/30 transition-all duration-1000" 
                                    style={{ width: `${((result.employeeContributions + result.employerMatch + currentBalance) / result.totalSavings) * 100}%` }} 
                                />
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-1000" 
                                    style={{ width: `${(result.totalInterest / result.totalSavings) * 100}%` }} 
                                />
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'Projection Copied' : 'Copy All Results'}
                    </button>
                </div>
            </div>
        </div>
    );
}
