"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, ArrowDownNarrowWide, Info, ShoppingCart } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InflationResult {
    purchasingPower: string;
    lostValue: string;
    futureCost: string;
    lossPercent: string;
}

import { useTranslations } from 'next-intl';

export function InflationCalculator() {
    const tCalc = useTranslations('Tools.CalculatorText');
    const [amount, setAmount] = useState(100);
    const [rate, setRate] = useState(4); // Default 4% inflation
    const [time, setTime] = useState(10);
    const [copied, setCopied] = useState(false);

    const result = useMemo<InflationResult | null>(() => {
        const r = rate / 100;
        const t = time;

        if (amount <= 0 || rate < 0 || time <= 0) {
            return null;
        }

        const purchasingPower = amount / Math.pow(1 + r, t);
        const lostValue = amount - purchasingPower;
        const futureCost = amount * Math.pow(1 + r, t);

        return {
            purchasingPower: purchasingPower.toFixed(2),
            lostValue: lostValue.toFixed(2),
            futureCost: futureCost.toFixed(2),
            lossPercent: ((lostValue / amount) * 100).toFixed(1)
        };
    }, [amount, rate, time]);

    const copy = () => {
        if (!result) return;
        const text = `${tCalc('amount')}: ${amount}\n${tCalc('purchasingPower')}: ${result.purchasingPower}\n${tCalc('totalValueLost')}: ${result.lostValue} (${result.lossPercent}%)`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tCalc('monetaryInputs')}</h3>
                    <ArrowDownNarrowWide size={16} className="text-rose-500" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">{tCalc('currentAmount')} ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">{tCalc('annualInflationRate')} (%)</label>
                        <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">{tCalc('timeHorizon')} ({tCalc('years')})</label>
                        <input type="number" value={time} onChange={e => setTime(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                </div>

                <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 flex items-start gap-3">
                    <Info size={16} className="text-rose-500 mt-1 flex-shrink-0" />
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        {tCalc('inflationDefinition')}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tCalc('impactProfile')}</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{tCalc('purchasingPowerInYears', { years: time })}</div>
                            <div className="text-6xl font-black text-rose-500 animate-in fade-in zoom-in duration-500">${Number(result.purchasingPower).toLocaleString()}</div>
                            <p className="text-xs font-bold text-muted-foreground">{tCalc('yourAmountWillBuyPercent', { amount: amount, percent: (100 - Number(result.lossPercent)).toFixed(1) })}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center shadow-sm">
                                <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">{tCalc('totalValueLost')}</span>
                                <span className="text-sm font-bold text-rose-500">-${result.lostValue}</span>
                            </div>
                            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center shadow-sm">
                                <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">{tCalc('costToBuySame')}</span>
                                <span className="text-sm font-bold text-primary">${result.futureCost}</span>
                            </div>
                        </div>

                        <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${result.lossPercent}%` }} />
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? tCalc('impactResultCopied') : tCalc('copyAllData')}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <ShoppingCart size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">{tCalc('seeHowTimeAffectsYourWallet')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

