"use client";
import { useState, useMemo } from 'react';
import { Dumbbell, Copy, Check, Info, ArrowUpRight, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

export function MacroCalculator() {
    const [weight, setWeight] = useState<number>(75);
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');
    const [activityMult, setActivityMult] = useState<number>(1.55);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState<number>(28);
    const [height, setHeight] = useState<number>(175);
    const [copied, setCopied] = useState(false);

    const activityLevels = [
        { value: 1.2, label: 'Sedentary' },
        { value: 1.375, label: 'Light (1–3x/wk)' },
        { value: 1.55, label: 'Moderate (3–5x/wk)' },
        { value: 1.725, label: 'Active (6–7x/wk)' },
        { value: 1.9, label: 'Very Active' },
    ];

    const goalConfig = {
        cut: { kcalAdj: -500, protein: 2.2, fat: 0.8, label: 'Cutting', color: 'text-blue-500' },
        maintain: { kcalAdj: 0, protein: 1.8, fat: 0.9, label: 'Maintenance', color: 'text-green-500' },
        bulk: { kcalAdj: 300, protein: 1.6, fat: 1.0, label: 'Bulking', color: 'text-orange-500' },
    };

    const result = useMemo(() => {
        let w = unit === 'lbs' ? weight * 0.453592 : weight;
        const h = height; // cm
        const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * activityMult;
        const cfg = goalConfig[goal];
        const totalCal = tdee + cfg.kcalAdj;
        const protein = w * cfg.protein;
        const fat = w * cfg.fat;
        const carbCal = totalCal - protein * 4 - fat * 9;
        const carbs = Math.max(0, carbCal / 4);
        return {
            calories: Math.round(totalCal),
            protein: Math.round(protein),
            fat: Math.round(fat),
            carbs: Math.round(carbs),
            proteinPct: Math.round((protein * 4 / totalCal) * 100),
            fatPct: Math.round((fat * 9 / totalCal) * 100),
            carbsPct: Math.round((carbs * 4 / totalCal) * 100),
        };
    }, [weight, unit, goal, activityMult, gender, age, height]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Macro Plan (${goalConfig[goal].label}):\nCalories: ${result.calories} kcal/day\nProtein: ${result.protein}g (${result.proteinPct}%)\nCarbs: ${result.carbs}g (${result.carbsPct}%)\nFat: ${result.fat}g (${result.fatPct}%)`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const macroColors = {
        protein: { bar: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
        carbs: { bar: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' },
        fat: { bar: 'bg-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Dumbbell className="w-8 h-8 text-primary" /></div>
                        MACRO CALCULATOR
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Get your personalized protein, carb & fat targets.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY MACROS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Your Profile</h3>

                    <div className="flex gap-2">
                        {(['male', 'female'] as const).map(g => (
                            <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', gender === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{g}</button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Age <span>{age}</span></label>
                            <input type="range" min="15" max="80" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Height (cm) <span>{height}</span></label>
                            <input type="range" min="140" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2 mb-1">
                            {(['kg', 'lbs'] as const).map(u => (
                                <button key={u} onClick={() => setUnit(u)} className={cn('px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all', unit === u ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{u}</button>
                            ))}
                        </div>
                        <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Weight ({unit}) <span>{weight}</span></label>
                        <input type="range" min="40" max={unit === 'kg' ? 200 : 450} value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase">Goal</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['cut', 'maintain', 'bulk'] as const).map(g => (
                                <button key={g} onClick={() => setGoal(g)} className={cn('py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', goal === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{g}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-muted-foreground uppercase">Activity Level</label>
                        <select value={activityMult} onChange={e => setActivityMult(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold">
                            {activityLevels.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <Flame className="w-5 h-5" /> Daily Calorie Target ({goalConfig[goal].label})
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {result.calories.toLocaleString()}
                            </h2>
                            <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>kcal/day for {goalConfig[goal].label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Macro Breakdown */}
                    <div className="bg-card border-2 border-border rounded-3xl p-6 space-y-5 shadow-lg">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Macro Split</p>
                        {[
                            { key: 'protein', label: 'Protein', grams: result.protein, pct: result.proteinPct, kcal: result.protein * 4 },
                            { key: 'carbs', label: 'Carbohydrates', grams: result.carbs, pct: result.carbsPct, kcal: result.carbs * 4 },
                            { key: 'fat', label: 'Fat', grams: result.fat, pct: result.fatPct, kcal: result.fat * 9 },
                        ].map(({ key, label, grams, pct, kcal }) => {
                            const mc = macroColors[key as keyof typeof macroColors];
                            return (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className={cn('font-black text-sm', mc.text)}>{label}</span>
                                        <div className="flex gap-3 text-sm font-bold text-muted-foreground">
                                            <span>{grams}g</span>
                                            <span>{kcal} kcal</span>
                                            <span className={cn('font-black', mc.text)}>{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted/30 h-3 rounded-full overflow-hidden">
                                        <div className={cn('h-full rounded-full transition-all duration-700', mc.bar)} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Macro Tip</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Protein is the most important macro for body composition. Aim for <strong>1.6–2.2g per kg</strong> of body weight. Track for 2 weeks, then adjust based on scale and energy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
