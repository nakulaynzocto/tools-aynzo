"use client";
import { useState, useMemo } from 'react';
import { Scale, Copy, Check, Info, ArrowUpRight, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

export function IdealWeightCalculator() {
    const [height, setHeight] = useState<number>(170);
    const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
    const [feet, setFeet] = useState<number>(5);
    const [inches, setInches] = useState<number>(7);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        let heightCm = unit === 'cm' ? height : (feet * 12 + inches) * 2.54;
        const heightIn = heightCm / 2.54;
        const heightM = heightCm / 100;

        // Multiple formulas
        const hamwi = gender === 'male'
            ? 48 + 2.7 * Math.max(0, heightIn - 60)
            : 45.5 + 2.2 * Math.max(0, heightIn - 60);

        const devine = gender === 'male'
            ? 50 + 2.3 * Math.max(0, heightIn - 60)
            : 45.5 + 2.3 * Math.max(0, heightIn - 60);

        const robinson = gender === 'male'
            ? 52 + 1.9 * Math.max(0, heightIn - 60)
            : 49 + 1.7 * Math.max(0, heightIn - 60);

        const miller = gender === 'male'
            ? 56.2 + 1.41 * Math.max(0, heightIn - 60)
            : 53.1 + 1.36 * Math.max(0, heightIn - 60);

        const avg = (hamwi + devine + robinson + miller) / 4;

        // Healthy BMI range (18.5–24.9)
        const bmiLow = 18.5 * heightM * heightM;
        const bmiHigh = 24.9 * heightM * heightM;

        return { hamwi, devine, robinson, miller, avg, bmiLow, bmiHigh, heightCm };
    }, [height, unit, feet, inches, gender]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Ideal Weight (${gender}, ${unit === 'cm' ? height + 'cm' : feet + "'" + inches + '"'}):\nAverage: ${result.avg.toFixed(1)} kg\nHealthy BMI Range: ${result.bmiLow.toFixed(1)} – ${result.bmiHigh.toFixed(1)} kg\n\nBy Formula:\nHamwi: ${result.hamwi.toFixed(1)} kg\nDevine: ${result.devine.toFixed(1)} kg\nRobinson: ${result.robinson.toFixed(1)} kg\nMiller: ${result.miller.toFixed(1)} kg`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const formulas = [
        { name: 'Hamwi', value: result.hamwi, desc: 'Clinical standard' },
        { name: 'Devine', value: result.devine, desc: 'Medical dosing' },
        { name: 'Robinson', value: result.robinson, desc: 'Modified Devine' },
        { name: 'Miller', value: result.miller, desc: 'Lightest estimate' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Scale className="w-8 h-8 text-primary" /></div>
                        IDEAL WEIGHT CALCULATOR
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Calculate ideal body weight using 4 clinical formulas.</p>
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

                    <div className="flex gap-2">
                        {(['male', 'female'] as const).map(g => (
                            <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', gender === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{g}</button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {(['cm', 'ft'] as const).map(u => (
                            <button key={u} onClick={() => setUnit(u)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 uppercase transition-all', unit === u ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{u === 'ft' ? 'ft/in' : u}</button>
                        ))}
                    </div>

                    {unit === 'cm' ? (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-muted-foreground uppercase flex justify-between">Height (cm) <span>{height} cm</span></label>
                            <input type="range" min="140" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase">Feet</label>
                                <input type="number" value={feet} min={3} max={8} onChange={e => setFeet(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase">Inches</label>
                                <input type="number" value={inches} min={0} max={11} onChange={e => setInches(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold" />
                            </div>
                        </div>
                    )}

                    {/* Formula table */}
                    <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Formula Breakdown</p>
                        </div>
                        <div className="divide-y divide-border/50">
                            {formulas.map(f => (
                                <div key={f.name} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                                    <div>
                                        <span className="font-bold text-sm">{f.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2">({f.desc})</span>
                                    </div>
                                    <span className="font-black text-primary">{f.value.toFixed(1)} kg</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-primary-foreground/80 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                                <Scale className="w-5 h-5" /> Average Ideal Weight
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter drop-shadow-lg">
                                {result.avg.toFixed(1)} <span className="text-4xl">kg</span>
                            </h2>
                            <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>Also: {(result.avg * 2.205).toFixed(1)} lbs average</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-lg">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Healthy BMI Weight Range (18.5–24.9)</p>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-foreground">{result.bmiLow.toFixed(1)} kg</span>
                                <span className="text-xs text-muted-foreground font-medium">Minimum (BMI 18.5)</span>
                            </div>
                            <div className="flex-1 h-3 bg-gradient-to-r from-blue-400 via-green-400 to-green-500 rounded-full" />
                            <div className="flex flex-col text-right">
                                <span className="text-2xl font-black text-foreground">{result.bmiHigh.toFixed(1)} kg</span>
                                <span className="text-xs text-muted-foreground font-medium">Maximum (BMI 24.9)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Weight Perspective</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Ideal weight formulas don't account for muscle mass, bone density, or body composition. Focus on <strong>body fat percentage</strong> and how you feel rather than a fixed number.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
