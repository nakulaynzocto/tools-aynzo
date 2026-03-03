"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Target, Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ROIResult {
    roi: string;
    netProfit: string;
    isProfit: boolean;
}

export function ROICalculator() {
    const [investment, setInvestment] = useState(10000);
    const [returns, setReturns] = useState(15000);
    const [copied, setCopied] = useState(false);

    const result = useMemo<ROIResult | null>(() => {
        if (investment <= 0) {
            return null;
        }

        const roi = ((returns - investment) / investment) * 100;
        const netProfit = returns - investment;

        return {
            roi: roi.toFixed(2),
            netProfit: netProfit.toFixed(2),
            isProfit: netProfit >= 0
        };
    }, [investment, returns]);

    const copy = () => {
        if (!result) return;
        const text = `Investment: $${investment}\nReturns: $${returns}\nROI: ${result.roi}%\nNet Profit: $${result.netProfit}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investment Metrics</h3>
                    <Target size={16} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Amount Invested ($)</label>
                        <input type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Amount Returned ($)</label>
                        <input type="number" value={returns} onChange={e => setReturns(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                    <Percent size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        Return on Investment (ROI) is a performance measure used to evaluate the efficiency of an investment or compare the efficiency of several different investments.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">ROI Analysis</h3>
                {result ? (
                    <div className={cn(
                        "border-2 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm",
                        result.isProfit ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                    )}>
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                {result.isProfit ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                                {result.isProfit ? 'Positive ROI' : 'Negative ROI'}
                            </div>
                            <div className={cn(
                                "text-7xl font-black animate-in zoom-in duration-500",
                                result.isProfit ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {result.roi}%
                            </div>
                            <div className="text-sm font-bold text-muted-foreground">
                                Net {result.isProfit ? 'Profit' : 'Loss'}: <span className={result.isProfit ? 'text-emerald-500' : 'text-rose-500'}>${Math.abs(Number(result.netProfit)).toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Outcome Copied' : 'Copy All Data'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Target size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter data to evaluate performance</span>
                    </div>
                )}
            </div>
        </div>
    );
}

