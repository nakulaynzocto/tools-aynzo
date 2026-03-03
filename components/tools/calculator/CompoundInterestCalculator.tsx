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
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('inputsTitle')}</h3>
                    <TrendingUp size={16} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">{t('initialPrincipal')}</label>
                        <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">{t('annualRate')}</label>
                            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">{t('timeInYears')}</label>
                            <input type="number" value={time} onChange={e => setTime(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">{t('compoundingFrequency')}</label>
                        <select value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent">
                            <option value={1}>{t('freqAnnually')}</option>
                            <option value={2}>{t('freqSemiAnnually')}</option>
                            <option value={4}>{t('freqQuarterly')}</option>
                            <option value={12}>{t('freqMonthly')}</option>
                            <option value={365}>{t('freqDaily')}</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">{t('monthlyContribution')}</label>
                        <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('resultTitle')}</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{t('totalFutureValue')}</div>
                            <div className="text-5xl font-black text-primary animate-in fade-in zoom-in duration-500">${Number(result.totalAmount).toLocaleString()}</div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">{t('totalInvested')}</div>
                                    <div className="text-lg font-bold text-foreground">${Number(result.totalInvested).toLocaleString()}</div>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">{t('interestAccrued')}</div>
                                    <div className="text-lg font-bold text-emerald-500">+${Number(result.totalInterest).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3 mt-4">
                            <Info size={16} className="text-primary mt-1 flex-shrink-0" />
                            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                {t('wealthInfo')}
                            </p>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? ct('linkCopied') : t('copyFullBreakdown')}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <TrendingUp size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">{t('emptyPrompt')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}


