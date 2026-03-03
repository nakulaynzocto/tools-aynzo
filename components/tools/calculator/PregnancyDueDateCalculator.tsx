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

export function PregnancyDueDateCalculator() {
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

        const upcoming = MILESTONES.filter(m => m.week > weeksPregnant).slice(0, 3);

        return { dueDate, daysPregnant, weeksPregnant, daysRemainder, daysLeft, trimester, upcoming };
    }, [method, lmpDate, conceptionDate, ivfDate]);

    const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(`Pregnancy Due Date:\nDue Date: ${fmt(result.dueDate)}\nCurrently: ${result.weeksPregnant} weeks ${result.daysRemainder} days\nTrimester: ${result.trimester}\nDays Remaining: ${result.daysLeft}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const activeInput = method === 'lmp' ? lmpDate : method === 'conception' ? conceptionDate : ivfDate;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-pink-500/10 rounded-2xl"><Baby className="w-8 h-8 text-pink-500" /></div>
                        PREGNANCY DUE DATE
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Calculate your estimated due date and track milestones.</p>
                </div>
                <button onClick={handleCopy} disabled={!result} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base disabled:opacity-50">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY RESULTS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <h3 className="text-sm font-black text-pink-500 uppercase tracking-widest flex items-center gap-2"><Heart className="w-4 h-4" /> Calculation Method</h3>

                    <div className="flex flex-wrap gap-2">
                        {([
                            { id: 'lmp', label: 'Last Period' },
                            { id: 'conception', label: 'Conception Date' },
                            { id: 'ivf', label: 'IVF Transfer' },
                        ] as const).map(m => (
                            <button key={m.id} onClick={() => setMethod(m.id)} className={cn('px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all', method === m.id ? 'bg-pink-500 text-white border-pink-500' : 'border-border hover:border-pink-400/60')}>
                                {m.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase">
                            {method === 'lmp' ? 'First Day of Last Period' : method === 'conception' ? 'Conception / Ovulation Date' : 'IVF Transfer Date'}
                        </label>
                        <input
                            type="date"
                            value={method === 'lmp' ? lmpDate : method === 'conception' ? conceptionDate : ivfDate}
                            onChange={e => method === 'lmp' ? setLmpDate(e.target.value) : method === 'conception' ? setConceptionDate(e.target.value) : setIvfDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Trimester Timeline */}
                    {result && (
                        <div className="space-y-3 pt-2">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Trimester Progress</p>
                            <div className="space-y-2">
                                {TRIMESTERS.map(t => {
                                    const current = result.weeksPregnant >= t.weeks[0] && result.weeksPregnant <= t.weeks[1];
                                    const past = result.weeksPregnant > t.weeks[1];
                                    return (
                                        <div key={t.label} className={cn('p-3 rounded-xl border-2 transition-all', current ? 'border-pink-500 bg-pink-500/10' : past ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-muted/10')}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-sm">{t.label}</span>
                                                <span className="text-xs text-muted-foreground">{t.desc}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    {result ? (
                        <>
                            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                                <div className="relative z-10 space-y-3">
                                    <p className="text-white/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                        <Baby className="w-5 h-5" /> Estimated Due Date
                                    </p>
                                    <h2 className="text-3xl md:text-4xl font-black drop-shadow-lg leading-tight">
                                        {fmt(result.dueDate)}
                                    </h2>
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <ArrowUpRight className="w-5 h-5" />
                                        <span>{result.daysLeft} days remaining · {result.trimester} trimester</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Weeks Pregnant', value: `${result.weeksPregnant}w ${result.daysRemainder}d`, icon: Calendar, colBg: 'bg-pink-500/10', colText: 'text-pink-500', desc: 'Current gestational age' },
                                    { label: 'Days Left', value: result.daysLeft.toString(), icon: Heart, colBg: 'bg-rose-500/10', colText: 'text-rose-500', desc: 'Until estimated due date' },
                                ].map(({ label, value, icon: Icon, colBg, colText, desc }) => (
                                    <div key={label} className="bg-card border-2 border-border p-6 rounded-3xl hover:border-pink-500/50 transition-all shadow-lg group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={cn('p-3 rounded-2xl group-hover:scale-110 transition-transform', colBg)}>
                                                <Icon className={cn('w-6 h-6', colText)} />
                                            </div>
                                            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</span>
                                        </div>
                                        <p className="text-2xl font-black text-foreground">{value}</p>
                                        <p className="text-sm text-muted-foreground font-medium mt-1">{desc}</p>
                                    </div>
                                ))}
                            </div>

                            {result.upcoming.length > 0 && (
                                <div className="bg-card border-2 border-border rounded-3xl p-6 space-y-3">
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Upcoming Milestones</p>
                                    {result.upcoming.map(m => (
                                        <div key={m.week} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                            <span className="text-sm font-bold">{m.event}</span>
                                            <span className="text-xs font-black text-primary">Week {m.week}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 min-h-[400px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                            <Baby size={64} />
                            <span className="text-sm font-black uppercase tracking-widest text-center">Enter a date to see your results</span>
                        </div>
                    )}

                    <div className="bg-pink-500/5 border-2 border-pink-500/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Important Note</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Due dates are estimates — only <strong>~5%</strong> of babies are born on their exact due date. Always confirm with your OB/GYN via ultrasound dating.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
