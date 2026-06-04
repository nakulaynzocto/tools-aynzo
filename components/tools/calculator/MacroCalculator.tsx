"use client";
import { useState, useMemo } from 'react';
import { Dumbbell, Copy, Check, Info, ArrowUpRight, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';

import { useTranslations } from 'next-intl';

export function MacroCalculator() {
    const tCalc = useTranslations('Tools.CalculatorText');
    const [weight, setWeight] = useState<number>(75);
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('maintain');
    const [activityMult, setActivityMult] = useState<number>(1.55);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState<number>(28);
    const [height, setHeight] = useState<number>(175);
    const [copied, setCopied] = useState(false);

    const activityLevels = [
        { value: 1.2, labelKey: 'sedentary' },
        { value: 1.375, labelKey: 'light' },
        { value: 1.55, labelKey: 'moderate' },
        { value: 1.725, labelKey: 'active' },
        { value: 1.9, labelKey: 'veryActive' },
    ];

    const goalConfig = {
        cut: { kcalAdj: -500, protein: 2.2, labelKey: 'cut', color: 'text-blue-500' },
        maintain: { kcalAdj: 0, protein: 1.8, labelKey: 'maintain', color: 'text-green-500' },
        bulk: { kcalAdj: 300, protein: 1.6, labelKey: 'bulk', color: 'text-orange-500' },
    };

    const result = useMemo(() => {
        let w = unit === 'lbs' ? weight * 0.453592 : weight;
        const h = height; // cm
        const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
        const tdee = bmr * activityMult;
        const cfg = goalConfig[goal];
        const totalCal = tdee + cfg.kcalAdj;
        const protein = w * cfg.protein;
        const fat = w * (goal === 'cut' ? 0.8 : goal === 'maintain' ? 0.9 : 1.0);
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
        navigator.clipboard.writeText(`Macro Plan (${tCalc(goalConfig[goal].labelKey)}):\n${tCalc('caloriesResult')}: ${result.calories} kcal/day\n${tCalc('protein')}: ${result.protein}g (${result.proteinPct}%)\n${tCalc('carbs')}: ${result.carbs}g (${result.carbsPct}%)\n${tCalc('fat')}: ${result.fat}g (${result.fatPct}%)`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const macroColors = {
        protein: { bar: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
        carbs: { bar: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' },
        fat: { bar: 'bg-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tCalc('macroInputs')}</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{tCalc('gender')}</label>
                        <div className="flex gap-2">
                            {(['male', 'female'] as const).map(g => (
                                <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', gender === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{tCalc(g)}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground">{tCalc('age')} ({age})</label>
                            <input type="range" min="15" max="80" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground">{tCalc('height')} ({height} {tCalc('cm')})</label>
                            <input type="range" min="140" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground">{tCalc('weight')} ({weight} {unit})</label>
                        <div className="flex gap-2 mb-2">
                            {(['kg', 'lbs'] as const).map(u => (
                                <button key={u} onClick={() => setUnit(u)} className={cn('px-4 py-1.5 rounded-lg font-bold text-xs border-2 transition-all', unit === u ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{u}</button>
                            ))}
                        </div>
                        <input type="range" min="40" max={unit === 'kg' ? 200 : 450} value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{tCalc('goal')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['cut', 'maintain', 'bulk'] as const).map(g => (
                                <button key={g} onClick={() => setGoal(g)} className={cn('py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', goal === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{tCalc(g)}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">{tCalc('activityLevel')}</label>
                        <select value={activityMult} onChange={e => setActivityMult(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold">
                            {activityLevels.map(a => <option key={a.value} value={a.value}>{tCalc(a.labelKey)}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{tCalc('caloriesMacros')}</h3>

                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                    <div className="text-center space-y-4">
                        <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">
                            {result.calories.toLocaleString()}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {tCalc('dailyCalorieTarget')} ({tCalc(goalConfig[goal].labelKey)})
                        </div>
                        <div className="flex gap-4 opacity-80 flex-wrap justify-center">
                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-sm shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" /> P: {result.protein}g
                            </div>
                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-sm shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500" /> C: {result.carbs}g
                            </div>
                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-sm shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500" /> F: {result.fat}g
                            </div>
                        </div>
                    </div>

                    {/* Macro Bars */}
                    <div className="w-full space-y-4 bg-card/50 p-6 rounded-2xl border border-border/50">
                        {[
                            { key: 'protein', label: tCalc('protein'), grams: result.protein, pct: result.proteinPct },
                            { key: 'carbs', label: tCalc('carbs'), grams: result.carbs, pct: result.carbsPct },
                            { key: 'fat', label: tCalc('fat'), grams: result.fat, pct: result.fatPct },
                        ].map(({ key, label, grams, pct }) => {
                            const mc = macroColors[key as keyof typeof macroColors];
                            return (
                                <div key={key} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className={mc.text}>{label}</span>
                                        <span className="text-muted-foreground">{pct}% · {grams}g</span>
                                    </div>
                                    <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                        <div className={cn('h-full rounded-full transition-all duration-700', mc.bar)} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? tCalc('copiedToClipboard') : tCalc('copyMacroPlan')}
                    </button>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {tCalc.rich('proteinCarbsFatRatioTip', {
                            strongNode: (chunks) => <strong>{chunks}</strong>
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
