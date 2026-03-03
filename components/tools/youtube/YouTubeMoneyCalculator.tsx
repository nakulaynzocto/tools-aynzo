"use client";
import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Eye, Copy, Check, Youtube, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export function YouTubeMoneyCalculator() {
    const [dailyViews, setDailyViews] = useState<number>(10000);
    const [rpmMin, setRpmMin] = useState<number>(2);
    const [rpmMax, setRpmMax] = useState<number>(5);
    const [ctr, setCtr] = useState<number>(50); // what % of views are monetized
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const monetizedViews = dailyViews * (ctr / 100);
        const dailyMin = (monetizedViews / 1000) * rpmMin;
        const dailyMax = (monetizedViews / 1000) * rpmMax;
        return {
            dailyMin, dailyMax,
            monthlyMin: dailyMin * 30,
            monthlyMax: dailyMax * 30,
            yearlyMin: dailyMin * 365,
            yearlyMax: dailyMax * 365,
        };
    }, [dailyViews, rpmMin, rpmMax, ctr]);

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    const fmtRange = (min: number, max: number) => `${fmt(min)} – ${fmt(max)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(`YouTube Earnings Estimate:\nDaily: ${fmtRange(result.dailyMin, result.dailyMax)}\nMonthly: ${fmtRange(result.monthlyMin, result.monthlyMax)}\nYearly: ${fmtRange(result.yearlyMin, result.yearlyMax)}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div />
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY ESTIMATE'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-muted/10 p-7 rounded-[2rem] border-2 border-border/50 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex justify-between">Daily Video Views <span>{dailyViews.toLocaleString()}</span></label>
                        <input type="range" min="100" max="10000000" step="100" value={dailyViews} onChange={e => setDailyViews(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex justify-between">RPM Min <span>${rpmMin}</span></label>
                        <input type="range" min="0.5" max="20" step="0.5" value={rpmMin} onChange={e => setRpmMin(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex justify-between">RPM Max <span>${rpmMax}</span></label>
                        <input type="range" min={rpmMin} max="30" step="0.5" value={rpmMax} onChange={e => setRpmMax(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex justify-between">Monetized Views % <span>{ctr}%</span></label>
                        <input type="range" min="10" max="100" value={ctr} onChange={e => setCtr(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4 text-sm text-muted-foreground font-medium">
                        <strong className="text-foreground">RPM</strong> (Revenue per Mille) varies by niche: Finance ($10-30), Tech ($5-15), Entertainment ($2-5).
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="bg-gradient-to-br from-red-600 to-red-500 p-8 rounded-[2.5rem] text-white text-center shadow-2xl">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 text-red-200" />
                        <p className="text-red-100 font-black uppercase tracking-widest text-sm mb-2">Daily Earnings</p>
                        <p className="text-5xl font-black">{fmtRange(result.dailyMin, result.dailyMax)}</p>
                        <p className="text-red-200 font-bold mt-2">based on {dailyViews.toLocaleString()} views/day</p>
                    </div>
                    {[
                        { label: 'Monthly Revenue', min: result.monthlyMin, max: result.monthlyMax, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { label: 'Yearly Revenue', min: result.yearlyMin, max: result.yearlyMax, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map(({ label, min, max, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-card border-2 border-border rounded-3xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                                <p className={`text-2xl font-black ${color}`}>{fmtRange(min, max)}</p>
                            </div>
                            <div className={`p-3 ${bg} rounded-2xl`}><Icon className={`w-7 h-7 ${color}`} /></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">How YouTube Earnings Work</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed"><strong>RPM</strong> (Revenue per Mille) varies widely by niche: Finance/Legal ($10–30), Tech/Software ($5–15), Entertainment ($2–5). Only ~40–60% of views are monetized — the rest come from viewers in low-CPM regions or using ad blockers.</p>
                </div>
            </div>
        </div>
    );
}
