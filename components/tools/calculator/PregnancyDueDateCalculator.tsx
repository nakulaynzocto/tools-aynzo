"use client";
import { useState, useMemo } from 'react';
import { Baby, Calendar, Heart, Copy, Check, Info, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const TRIMESTERS = [
    { label: '1st Trimester', desc: 'Weeks 1–12', weeks: [1, 12] },
    { label: '2nd Trimester', desc: 'Weeks 13–26', weeks: [13, 26] },
    { label: '3rd Trimester', desc: 'Weeks 27–40', weeks: [27, 40] },
];

const MILESTONES = [
    { week: 6, event: 'Heartbeat detectable' },
    { week: 12, event: 'End of 1st trimester' },
    { week: 16, event: 'Gender may be visible' },
    { week: 20, event: 'Anatomy ultrasound' },
    { week: 24, event: 'Viability milestone' },
    { week: 28, event: '3rd trimester begins' },
    { week: 36, event: 'Full term approaching' },
    { week: 40, event: '🎉 Estimated due date' },
];

import { useTranslations, useLocale } from 'next-intl';

export function PregnancyDueDateCalculator() {
    const tCalc = useTranslations('Tools.CalculatorText');
    const locale = useLocale();
    const [lmpDate, setLmpDate] = useState<string>('');
    const [method, setMethod] = useState<'lmp' | 'conception' | 'ivf'>('lmp');
    const [conceptionDate, setConceptionDate] = useState<string>('');
    const [ivfDate, setIvfDate] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        let baseDate: Date | null = null;
        if (method === 'lmp' && lmpDate) {
            baseDate = new Date(lmpDate);
        } else if (method === 'conception' && conceptionDate) {
            baseDate = new Date(conceptionDate);
            baseDate.setDate(baseDate.getDate() - 14);
        } else if (method === 'ivf' && ivfDate) {
            baseDate = new Date(ivfDate);
            baseDate.setDate(baseDate.getDate() - 14);
        }
        if (!baseDate) return null;

        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + 280);

        const today = new Date();
        const daysPregnant = Math.floor((today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
        const weeksPregnant = Math.floor(daysPregnant / 7);
        const daysRemainder = daysPregnant % 7;
        const daysLeft = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

        const trimester = weeksPregnant <= 12 ? '1st' : weeksPregnant <= 26 ? '2nd' : '3rd';

        const upcoming = MILESTONES.map(m => ({
            week: m.week,
            eventKey: m.event === 'Heartbeat detectable' ? 'heartbeatDetectable' :
                      m.event === 'End of 1st trimester' ? 'endOf1stTrimester' :
                      m.event === 'Gender may be visible' ? 'genderMayBeVisible' :
                      m.event === 'Anatomy ultrasound' ? 'anatomyUltrasound' :
                      m.event === 'Viability milestone' ? 'viabilityMilestone' :
                      m.event === '3rd trimester begins' ? '3rdTrimesterBegins' :
                      m.event === 'Full term approaching' ? 'fullTermApproaching' : 'estimatedDueDateEvent'
        })).filter(m => m.week > weeksPregnant).slice(0, 3);

        return { dueDate, daysPregnant, weeksPregnant, daysRemainder, daysLeft, trimester, upcoming };
    }, [method, lmpDate, conceptionDate, ivfDate]);

    const fmt = (d: Date) => d.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(`Pregnancy Due Date:\nDue Date: ${fmt(result.dueDate)}\nCurrently: ${result.weeksPregnant} weeks ${result.daysRemainder} days\nTrimester: ${result.trimester}\nDays Remaining: ${result.daysLeft}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const activeInput = method === 'lmp' ? lmpDate : method === 'conception' ? conceptionDate : ivfDate;

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tCalc('calculationDetails')}</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{tCalc('method')}</label>
                        <div className="flex flex-wrap gap-2">
                            {([
                                { id: 'lmp', label: tCalc('lastPeriod') },
                                { id: 'conception', label: tCalc('conception') },
                                { id: 'ivf', label: tCalc('ivfTransfer') },
                            ] as const).map(m => (
                                <button key={m.id} onClick={() => setMethod(m.id)} className={cn('px-4 py-2 rounded-xl font-bold text-xs border-2 transition-all', method === m.id ? 'bg-pink-500 text-white border-pink-500' : 'border-border hover:border-pink-500/40')}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">
                            {method === 'lmp' ? tCalc('firstDayLastPeriod') : method === 'conception' ? tCalc('conceptionDate') : tCalc('transferDate')}
                        </label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-pink-500 transition-colors" />
                            <input
                                type="date"
                                value={method === 'lmp' ? lmpDate : method === 'conception' ? conceptionDate : ivfDate}
                                onChange={e => method === 'lmp' ? setLmpDate(e.target.value) : method === 'conception' ? setConceptionDate(e.target.value) : setIvfDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full pl-11 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-pink-500 transition-all font-bold text-base"
                            />
                        </div>
                    </div>

                    {result && (
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{tCalc('trimesterProgress')}</label>
                            <div className="grid grid-cols-1 gap-2">
                                {TRIMESTERS.map((t, idx) => {
                                    const current = result.weeksPregnant >= t.weeks[0] && result.weeksPregnant <= t.weeks[1];
                                    const past = result.weeksPregnant > t.weeks[1];
                                    const tKey = idx === 0 ? 'trimester1' : idx === 1 ? 'trimester2' : 'trimester3';
                                    const dKey = idx === 0 ? 'weeks1To12' : idx === 1 ? 'weeks13To26' : 'weeks27To40';
                                    return (
                                        <div key={t.label} className={cn('px-4 py-2.5 rounded-xl border-2 transition-all flex justify-between items-center', current ? 'border-pink-500 bg-pink-500/10' : past ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-muted/5 opacity-50')}>
                                            <span className="font-bold text-xs">{tCalc(tKey)}</span>
                                            <span className="text-[10px] font-black text-muted-foreground uppercase">{tCalc(dKey)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tCalc('dueDateResult')}</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                        <div className="text-center space-y-4 w-full">
                            <div className="text-4xl md:text-5xl font-black text-pink-500 drop-shadow-sm leading-tight animate-in fade-in zoom-in duration-500">
                                {fmt(result.dueDate)}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{tCalc('estimatedDueDate')}</div>

                            <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{tCalc('currentProgress')}</span>
                                    <span className="block text-lg font-black text-pink-500">{result.weeksPregnant}w {result.daysRemainder}d</span>
                                </div>
                                <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{tCalc('daysRemaining')}</span>
                                    <span className="block text-lg font-black text-pink-500">{result.daysLeft}</span>
                                </div>
                            </div>

                            {result.upcoming.length > 0 && (
                                <div className="bg-card/50 p-6 rounded-2xl border border-border/50 text-left mt-4">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3">{tCalc('upcomingMilestones')}</span>
                                    <div className="space-y-2">
                                        {result.upcoming.map(m => (
                                            <div key={m.week} className="flex justify-between items-center text-xs font-bold py-1.5 border-b border-border/30 last:border-0 last:pb-0">
                                                <span className="text-foreground">{tCalc(m.eventKey)}</span>
                                                <span className="text-pink-500 px-2 py-0.5 bg-pink-500/10 rounded-md">{tCalc('week')} {m.week}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-pink-500 transition-all mt-4">
                            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? tCalc('copied') : tCalc('copyPregnancyPlan')}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <Baby size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">{tCalc('selectADateToCalculate')}</span>
                    </div>
                )}

                <div className="bg-pink-500/5 border-2 border-pink-500/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {tCalc('pregnancyDueDateDisclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
}
