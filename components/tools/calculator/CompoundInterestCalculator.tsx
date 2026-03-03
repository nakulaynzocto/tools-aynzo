"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CompoundResult {
    totalAmount: string;
    totalInvested: string;
    totalInterest: string;
}

export function CompoundInterestCalculator() {
    const t = useTranslations('Calculators.CompoundInterest');
    const ct = useTranslations('Common');
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(8);
    const [time, setTime] = useState(10);
    const [frequency, setFrequency] = useState(12); // Monthly by default
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [copied, setCopied] = useState(false);

    const result = useMemo<CompoundResult | null>(() => {
        const P = principal;
        const r = rate / 100;
        const t_val = time;
        const n = frequency;
        const PMT = monthlyContribution;

        if (P < 0 || r < 0 || t_val < 0) {
            return null;
        }

        const compoundInterestBase = P * Math.pow(1 + r / n, n * t_val);
        const annuityFutureValue = PMT * ((Math.pow(1 + r / n, n * t_val) - 1) / (r / n));
        
        const totalAmount = compoundInterestBase + (frequency === 12 ? annuityFutureValue : 0); 
        const totalInvested = P + (frequency === 12 ? PMT * 12 * t_val : 0);

        return {
            totalAmount: totalAmount.toFixed(2),
            totalInvested: totalInvested.toFixed(2),
            totalInterest: (totalAmount - totalInvested).toFixed(2),
        };
    }, [principal, rate, time, frequency, monthlyContribution]);

    const copy = () => {
        if (!result) return;
        const text = `${t('totalFutureValue')}: $${result.totalAmount}\n${t('totalInvested')}: $${result.totalInvested}\n${t('interestAccrued')}: $${result.totalInterest}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('inputsTitle')}</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{t('initialPrincipal')}</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                            <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">{t('annualRate')}</label>
                            <div className="relative group">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full pl-4 pr-10 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">{t('timeInYears')}</label>
                            <input type="number" value={time} onChange={e => setTime(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{t('compoundingFrequency')}</label>
                        <select value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base appearance-none">
                            <option value={1}>{t('freqAnnually')}</option>
                            <option value={2}>{t('freqSemiAnnually')}</option>
                            <option value={4}>{t('freqQuarterly')}</option>
                            <option value={12}>{t('freqMonthly')}</option>
                            <option value={365}>{t('freqDaily')}</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{t('monthlyContribution')}</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                            <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('resultTitle')}</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                        <div className="text-center space-y-4 w-full">
                            <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                                ${Number(result.totalAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                {t('totalFutureValue')}
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t('totalInvested')}</span>
                                    <span className="block text-lg font-black text-foreground">${Number(result.totalInvested).toLocaleString()}</span>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center text-emerald-500">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t('interestAccrued')}</span>
                                    <span className="block text-lg font-black">+${Number(result.totalInterest).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? ct('linkCopied') : t('copyFullBreakdown')}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <TrendingUp size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">{t('emptyPrompt')}</span>
                    </div>
                )}

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {t('wealthInfo')}
                    </p>
                </div>
            </div>
        </div>
    );
}


