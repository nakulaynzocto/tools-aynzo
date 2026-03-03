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
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Details</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Gender</label>
                        <div className="flex gap-2">
                            {(['male', 'female'] as const).map(g => (
                                <button key={g} onClick={() => setGender(g)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 capitalize transition-all', gender === g ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{g}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Measurement Unit</label>
                        <div className="flex gap-2">
                            {(['cm', 'ft'] as const).map(u => (
                                <button key={u} onClick={() => setUnit(u)} className={cn('flex-1 py-3 rounded-xl font-bold text-sm border-2 uppercase transition-all', unit === u ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>{u === 'ft' ? 'ft/in' : u}</button>
                            ))}
                        </div>
                    </div>

                    {unit === 'cm' ? (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground">Height ({height} cm)</label>
                            <input type="range" min="140" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground uppercase tracking-wider">Feet</label>
                                <input type="number" value={feet} min={3} max={8} onChange={e => setFeet(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-foreground uppercase tracking-wider">Inches</label>
                                <input type="number" value={inches} min={0} max={11} onChange={e => setInches(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Formula breakdown inside input column */}
                <div className="bg-card border-2 border-border rounded-2xl overflow-hidden mt-6">
                    <div className="px-6 py-4 border-b border-border bg-muted/30">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Formula Breakdown</p>
                    </div>
                    <div className="divide-y divide-border/50">
                        {formulas.map(f => (
                            <div key={f.name} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/10 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-foreground">{f.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">{f.desc}</span>
                                </div>
                                <span className="font-black text-primary text-sm">{f.value.toFixed(1)} kg</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ideal Weights</h3>

                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="text-center space-y-4 w-full">
                        <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                            {result.avg.toFixed(1)}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Average Ideal Weight (kg)
                        </div>
                        <div className="flex gap-4 opacity-80 flex-wrap justify-center pt-2">
                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold text-xs shadow-sm">
                                {(result.avg * 2.205).toFixed(1)} lbs average
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-border/50 w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Healthy BMI Range (18.5–24.9)</p>
                            <div className="flex items-center gap-4 px-4">
                                <div className="flex flex-col text-left">
                                    <span className="text-lg font-black text-foreground">{result.bmiLow.toFixed(1)}</span>
                                    <span className="text-[10px] text-muted-foreground font-bold">Min</span>
                                </div>
                                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden relative border border-border/50">
                                    <div className="absolute inset-y-0 left-[30%] right-[30%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-lg font-black text-foreground">{result.bmiHigh.toFixed(1)}</span>
                                    <span className="text-[10px] text-muted-foreground font-bold">Max</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'Copied to Clipboard' : 'Copy Result Summary'}
                    </button>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Ideal weight is just a reference point. Your healthiest weight is one where you feel strong, energized, and have good metabolic health.
                    </p>
                </div>
            </div>
        </div>
    );
}
