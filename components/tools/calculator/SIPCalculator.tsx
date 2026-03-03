"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, BarChart3, Info, Wallet } from 'lucide-react';

interface SIPResult {
    futureValue: string;
    totalInvested: string;
    totalReturns: string;
}

export function SIPCalculator() {
    const [monthlyAmount, setMonthlyAmount] = useState(5000);
    const [rate, setRate] = useState(12);
    const [time, setTime] = useState(10);
    const [copied, setCopied] = useState(false);

    const result = useMemo<SIPResult | null>(() => {
        // SIP Formula: FV = P × [((1 + i)^n - 1) / i] × (1 + i)
        // P = monthly amount, i = monthly interest rate, n = number of months
        
        const P = monthlyAmount;
        const i = rate / 100 / 12;
        const n = time * 12;

        if (P <= 0 || rate <= 0 || time <= 0) {
            return null;
        }

        const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const totalInvested = P * n;
        const totalReturns = futureValue - totalInvested;

        return {
            futureValue: futureValue.toFixed(0),
            totalInvested: totalInvested.toFixed(0),
            totalReturns: totalReturns.toFixed(0)
        };
    }, [monthlyAmount, rate, time]);

    const copy = () => {
        if (!result) return;
        const text = `Future Value: ₹${result.futureValue}\nTotal Invested: ₹${result.totalInvested}\nEstimated Returns: ₹${result.totalReturns}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investment Plan</h3>
                    <BarChart3 size={16} className="text-primary" />
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-foreground">Monthly Investment</label>
                            <span className="text-sm font-black text-primary">₹{monthlyAmount.toLocaleString()}</span>
                        </div>
                        <input type="range" min="500" max="100000" step="500" value={monthlyAmount} onChange={e => setMonthlyAmount(Number(e.target.value))} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-foreground">Expected Return Rate (p.a)</label>
                            <span className="text-sm font-black text-primary">{rate}%</span>
                        </div>
                        <input type="range" min="1" max="30" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-foreground">Time Period (Years)</label>
                            <span className="text-sm font-black text-primary">{time} Years</span>
                        </div>
                        <input type="range" min="1" max="40" step="1" value={time} onChange={e => setTime(Number(e.target.value))} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                    <Info size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        A Systematic Investment Plan (SIP) allows you to invest small amounts regularly in mutual funds, benefiting from Rupee Cost Averaging and Power of Compounding.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investment Growth Projection</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Estimated Future Value</div>
                            <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">₹{Number(result.futureValue).toLocaleString()}</div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1 font-mono tracking-tighter">Invested Amount</div>
                                    <div className="text-lg font-bold text-foreground">₹{Number(result.totalInvested).toLocaleString()}</div>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1 font-mono tracking-tighter">Est. Returns</div>
                                    <div className="text-lg font-bold text-emerald-500">₹{Number(result.totalReturns).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-muted/30 h-3 rounded-full overflow-hidden flex mt-4 border border-border">
                            <div 
                                className="h-full bg-muted-foreground/30 transition-all duration-1000" 
                                style={{ width: `${(Number(result.totalInvested) / Number(result.futureValue)) * 100}%` }} 
                            />
                            <div 
                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                style={{ width: `${(Number(result.totalReturns) / Number(result.futureValue)) * 100}%` }} 
                            />
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Projection Copied' : 'Copy All Data'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Wallet size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Slide to see your money grow</span>
                    </div>
                )}
            </div>
        </div>
    );
}

