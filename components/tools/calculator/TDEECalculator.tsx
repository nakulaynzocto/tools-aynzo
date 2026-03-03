"use client";
import { useState, useMemo } from 'react';
import { Flame, Activity, Copy, Check, Info, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function TDEECalculator() {
    const [age, setAge] = useState<number>(28);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [weight, setWeight] = useState<number>(75);
    const [height, setHeight] = useState<number>(175);
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    const [activity, setActivity] = useState<number>(1.375);
    const [copied, setCopied] = useState(false);

    const activityLevels = [
        { value: 1.2, label: 'Sedentary', desc: 'Little or no exercise' },
        { value: 1.375, label: 'Lightly Active', desc: '1–3 days/week' },
        { value: 1.55, label: 'Moderately Active', desc: '3–5 days/week' },
        { value: 1.725, label: 'Very Active', desc: '6–7 days/week' },
        { value: 1.9, label: 'Extra Active', desc: 'Physical job + exercise' },
    ];

    const result = useMemo(() => {
        let w = weight, h = height;
        if (unit === 'imperial') { w = weight * 0.453592; h = height * 2.54; }
        // Mifflin-St Jeor
        const bmr = gender === 'male'
            ? 10 * w + 6.25 * h - 5 * age + 5
            : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * activity;
        return {
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            cutting: Math.round(tdee - 500),
            bulking: Math.round(tdee + 300),
            maintenance: Math.round(tdee),
        };
    }, [age, gender, weight, height, unit, activity]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`TDEE Results:\nBMR: ${result.bmr} cal/day\nTDEE (Maintenance): ${result.tdee} cal/day\nCutting (-500 cal): ${result.cutting} cal/day\nBulking (+300 cal): ${result.bulking} cal/day`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Flame className="w-8 h-8 text-primary" /></div>
                        TDEE CALCULATOR
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Total Daily Energy Expenditure — know your exact calorie needs.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY RESULTS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4" /> Your Details</h3>

                    {/* Unit Toggle */}
                    <div className="flex gap-2">
                        {(['metric', 'imperial'] as const).map(u => (
                            <button key={u} onClick={() => setUnit(u)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', unit === u ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{u}</button>
                        ))}
                    </div>

                    {/* Gender */}
                    <div className="flex gap-2">
                        {(['male', 'female'] as const).map(g => (
                            <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', gender === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{g}</button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Age <span>{age} yrs</span></label>
                        <input type="range" min="10" max="80" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
                            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
                            <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase">Activity Level</label>
                        <div className="space-y-2">
                            {activityLevels.map(lvl => (
                                <button key={lvl.value} onClick={() => setActivity(lvl.value)} className={cn('w-full px-4 py-3 rounded-xl border-2 text-left transition-all', activity === lvl.value ? 'bg-primary/10 border-primary text-foreground' : 'border-border hover:border-primary/40')}>
                                    <span className="font-bold text-sm block">{lvl.label}</span>
                                    <span className="text-xs text-muted-foreground">{lvl.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-orange-500 via-orange-500/90 to-red-500 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-white/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <Flame className="w-5 h-5" /> Daily Maintenance Calories
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {result.tdee.toLocaleString()}
                            </h2>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>BMR: {result.bmr.toLocaleString()} cal (at rest)</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Cutting', value: result.cutting, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: '−500 cal/day' },
                            { label: 'Maintenance', value: result.maintenance, color: 'text-green-500', bg: 'bg-green-500/10', desc: '0 cal change' },
                            { label: 'Bulking', value: result.bulking, color: 'text-red-500', bg: 'bg-red-500/10', desc: '+300 cal/day' },
                        ].map(({ label, value, color, bg, desc }) => (
                            <div key={label} className="bg-card border-2 border-border p-5 rounded-3xl hover:border-primary/50 transition-all shadow-lg group text-center">
                                <div className={cn('p-2 rounded-full mx-auto w-fit mb-3 group-hover:scale-110 transition-transform', bg)}>
                                    <Flame className={cn('w-5 h-5', color)} />
                                </div>
                                <p className={cn('text-2xl font-black', color)}>{value.toLocaleString()}</p>
                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">{label}</p>
                                <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Calorie Science</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Based on the <strong>Mifflin-St Jeor equation</strong> — the most accurate formula for most people. Adjust based on real-world results over 2–3 weeks.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
