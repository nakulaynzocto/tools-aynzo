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
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investment Plan</h3>
                
                <div className="space-y-8 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Monthly Investment</span>
                            <span className="text-primary text-base">₹{monthlyAmount.toLocaleString()}</span>
                        </div>
                        <input 
                            type="range" min="500" max="100000" step="500" value={monthlyAmount} 
                            onChange={e => setMonthlyAmount(Number(e.target.value))} 
                            style={getSliderStyle(monthlyAmount, 500, 100000)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Expected Return Rate</span>
                            <span className="text-primary text-base">{rate}% p.a</span>
                        </div>
                        <input 
                            type="range" min="1" max="30" step="0.5" value={rate} 
                            onChange={e => setRate(Number(e.target.value))} 
                            style={getSliderStyle(rate, 1, 30)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-foreground">
                            <span className="uppercase tracking-wider">Time Period</span>
                            <span className="text-primary text-base">{time} Years</span>
                        </div>
                        <input 
                            type="range" min="1" max="40" step="1" value={time} 
                            onChange={e => setTime(Number(e.target.value))} 
                            style={getSliderStyle(time, 1, 40)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#074463] [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,1)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#074463] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#074463] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#074463] transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth Ratio</label>
                            <div className="text-sm font-bold text-foreground">
                                {(Number(result?.futureValue) / Number(result?.totalInvested) || 1).toFixed(2)}x Return
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Months</label>
                            <div className="text-sm font-bold text-foreground">
                                {time * 12} Installments
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4 transition-all hover:bg-primary/10">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        SIPs use <strong>Rupee Cost Averaging</strong> to lower your average cost per unit over time. Compounding works best with consistency.
                    </p>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investment Growth Projection</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                        <div className="text-center space-y-4 w-full">
                            <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                                ₹{Number(result.futureValue).toLocaleString()}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Estimated Portfolio Value
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Invested</span>
                                    <span className="block text-lg font-black text-foreground">₹{Number(result.totalInvested).toLocaleString()}</span>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center text-emerald-500">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Est. Returns</span>
                                    <span className="block text-lg font-black">+₹{Number(result.totalReturns).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="w-full space-y-2 mt-4 text-left">
                                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mb-1">
                                    <span>Invested vs Returns</span>
                                    <span>{((Number(result.totalReturns) / Number(result.futureValue)) * 100).toFixed(0)}% Growth</span>
                                </div>
                                <div className="w-full bg-card h-3 rounded-full overflow-hidden flex border border-border/50">
                                    <div 
                                        className="h-full bg-muted-foreground/30 transition-all duration-1000" 
                                        style={{ width: `${(Number(result.totalInvested) / Number(result.futureValue)) * 100}%` }} 
                                    />
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-1000" 
                                        style={{ width: `${(Number(result.totalReturns) / Number(result.futureValue)) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Projection Copied' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <BarChart3 size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Adjust inputs to see projection</span>
                    </div>
                )}
            </div>
        </div>
    );
}

