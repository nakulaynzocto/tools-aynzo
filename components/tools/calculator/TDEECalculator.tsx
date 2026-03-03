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
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Personal Profile</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Unit System</label>
                            <div className="flex p-1 bg-muted/20 rounded-xl gap-1">
                                {(['metric', 'imperial'] as const).map(u => (
                                    <button key={u} onClick={() => setUnit(u)} className={cn('flex-1 py-2 rounded-lg font-black text-[10px] uppercase transition-all', unit === u ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground')}>{u}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Gender</label>
                            <div className="flex p-1 bg-muted/20 rounded-xl gap-1">
                                {(['male', 'female'] as const).map(g => (
                                    <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-2 rounded-lg font-black text-[10px] uppercase transition-all', gender === g ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground')}>{g}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider flex justify-between">Age <span>{age} yrs</span></label>
                        <input type="range" min="10" max="80" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
                            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
                            <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Activity Multiplier</label>
                        <div className="grid grid-cols-1 gap-2">
                            {activityLevels.map(lvl => (
                                <button key={lvl.value} onClick={() => setActivity(lvl.value)} className={cn('w-full px-4 py-3 rounded-xl border-2 text-left transition-all flex justify-between items-center', activity === lvl.value ? 'bg-orange-500/10 border-orange-500/30' : 'border-border bg-muted/5 opacity-70 hover:opacity-100')}>
                                    <div className="space-y-0.5">
                                        <span className="font-bold text-xs block">{lvl.label}</span>
                                        <span className="text-[10px] text-muted-foreground">{lvl.desc}</span>
                                    </div>
                                    {activity === lvl.value && <div className="p-1 bg-orange-500 rounded-full" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calories Result</h3>
                
                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="text-center space-y-4 w-full">
                        <div className="text-7xl font-black text-orange-600 animate-in fade-in zoom-in duration-500">
                            {result.tdee.toLocaleString()}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Maintenance Calories / Day
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full mt-6">
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">BMR (At Rest)</span>
                                <span className="block text-lg font-black text-foreground">{result.bmr.toLocaleString()}</span>
                            </div>
                            <div className="bg-card p-4 rounded-2xl border border-border/50 text-center">
                                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Energy Ratio</span>
                                <span className="block text-lg font-black text-foreground">{activity.toFixed(2)}x</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
                            {[
                                { label: 'Cutting', value: result.cutting, color: 'text-blue-500', desc: '−500 cal' },
                                { label: 'Maintain', value: result.maintenance, color: 'text-emerald-500', desc: 'Stay same' },
                                { label: 'Bulking', value: result.bulking, color: 'text-rose-500', desc: '+300 cal' },
                            ].map(item => (
                                <div key={item.label} className="bg-card/50 p-4 rounded-2xl border border-border/50 text-center">
                                    <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</span>
                                    <span className={cn("block text-xl font-black", item.color)}>{item.value.toLocaleString()}</span>
                                    <span className="block text-[9px] font-bold text-muted-foreground mt-1 opacity-60">{item.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-orange-500 transition-all mt-4">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                    </button>
                </div>

                <div className="bg-orange-500/5 border-2 border-orange-500/20 p-6 rounded-3xl flex items-start gap-4">
                    <Flame className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        The <strong>Mifflin-St Jeor</strong> formula is the industrial standard for calculating calorie needs. Consistency over 2 weeks is key.
                    </p>
                </div>
            </div>
        </div>
    );
}
