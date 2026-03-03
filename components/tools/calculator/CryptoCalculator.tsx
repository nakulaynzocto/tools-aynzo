"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CryptoResult {
    coinAmount: string;
    netProfit: string;
    profitPercent: string;
    totalSellValue: string;
    totalFees: string;
    isProfit: boolean;
}

export function CryptoCalculator() {
    const [investment, setInvestment] = useState(1000);
    const [buyPrice, setBuyPrice] = useState(50000);
    const [sellPrice, setSellPrice] = useState(65000);
    const [fee, setFee] = useState(0.1); // % fee
    const [copied, setCopied] = useState(false);

    const result = useMemo<CryptoResult | null>(() => {
        if (investment <= 0 || buyPrice <= 0 || sellPrice <= 0) {
            return null;
        }

        const coinAmount = investment / buyPrice;
        const totalBuyFee = investment * (fee / 100);
        const totalSellValue = coinAmount * sellPrice;
        const totalSellFee = totalSellValue * (fee / 100);
        
        const netProfit = totalSellValue - investment - totalBuyFee - totalSellFee;
        const profitPercent = (netProfit / investment) * 100;

        return {
            coinAmount: coinAmount.toFixed(8),
            netProfit: netProfit.toFixed(2),
            profitPercent: profitPercent.toFixed(2),
            totalSellValue: totalSellValue.toFixed(2),
            totalFees: (totalBuyFee + totalSellFee).toFixed(2),
            isProfit: netProfit >= 0
        };
    }, [investment, buyPrice, sellPrice, fee]);

    const copy = () => {
        if (!result) return;
        const text = `Investment: $${investment}\nProfit/Loss: $${result.netProfit} (${result.profitPercent}%)\nCoin Amount: ${result.coinAmount}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Trade Configuration</h3>
                    <Coins size={16} className="text-yellow-500" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Investment Amount ($)</label>
                        <input type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Buy Price ($)</label>
                            <input type="number" value={buyPrice} onChange={e => setBuyPrice(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Sell Price ($)</label>
                            <input type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Exchange Fees (%)</label>
                        <input type="number" step="0.01" value={fee} onChange={e => setFee(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Trade Outcome</h3>
                {result ? (
                    <div className={cn(
                        "border-2 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm transition-colors duration-500",
                        result.isProfit ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                    )}>
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                {result.isProfit ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                                {result.isProfit ? 'Estimated Profit' : 'Estimated Loss'}
                            </div>
                            <div className={cn(
                                "text-6xl font-black animate-in zoom-in duration-500",
                                result.isProfit ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {result.isProfit ? '+' : ''}${Math.abs(Number(result.netProfit)).toLocaleString()}
                            </div>
                            <div className={cn(
                                "inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest border capitalize",
                                result.isProfit ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                            )}>
                                {result.profitPercent}% ROI
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">Fee Total</span>
                                <span className="text-sm font-bold text-foreground">${result.totalFees}</span>
                            </div>
                            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">Coin Units</span>
                                <span className="text-xs font-black font-mono text-primary truncate max-w-full">{result.coinAmount}</span>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Trade Copied' : 'Copy Breakdown'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Coins size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Calculate your crypto moonshot</span>
                    </div>
                )}
            </div>
        </div>
    );
}

