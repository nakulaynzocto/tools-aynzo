"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BMIResult {
    bmi: string;
    category: string;
}

export function BMICalculator() {
    const [bmiInputs, setBmiInputs] = useState({ height: '', weight: '', unit: 'metric' as 'metric' | 'imperial' });
    const [copied, setCopied] = useState(false);

    const result = useMemo<BMIResult | null>(() => {
        const h = parseFloat(bmiInputs.height);
        const w = parseFloat(bmiInputs.weight);
        if (!h || !w) {
            return null;
        }

        let bmiValue: number;
        if (bmiInputs.unit === 'metric') {
            // Height in cm, weight in kg
            bmiValue = w / ((h / 100) * (h / 100));
        } else {
            // Height in inches, weight in lbs
            bmiValue = (w / (h * h)) * 703;
        }

        let category = '';
        if (bmiValue < 18.5) category = 'Underweight';
        else if (bmiValue < 25) category = 'Normal weight';
        else if (bmiValue < 30) category = 'Overweight';
        else category = 'Obese';

        return {
            bmi: bmiValue.toFixed(1),
            category
        };
    }, [bmiInputs]);

    const copy = () => {
        if (!result) return;
        const text = `BMI: ${result.bmi}\nCategory: ${result.category}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Inputs</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Weight ({bmiInputs.unit === 'metric' ? 'kg' : 'lbs'})</label>
                            <input type="number" value={bmiInputs.weight} onChange={e => setBmiInputs({ ...bmiInputs, weight: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="70" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Height ({bmiInputs.unit === 'metric' ? 'cm' : 'in'})</label>
                            <input type="number" value={bmiInputs.height} onChange={e => setBmiInputs({ ...bmiInputs, height: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="175" />
                        </div>
                    </div>
                    <div className="bg-muted p-1 rounded-xl flex gap-1">
                        {['metric', 'imperial'].map(u => (
                            <button key={u} onClick={() => setBmiInputs({ ...bmiInputs, unit: u as any })} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all", bmiInputs.unit === u ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{u}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="text-center space-y-4">
                            <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">{result.bmi}</div>
                            <div className={cn("px-6 py-2 rounded-xl text-white font-black uppercase text-xs tracking-widest shadow-lg",
                                result.category.includes('Normal') ? 'bg-emerald-500' : 'bg-amber-500'
                            )}>
                                {result.category}
                            </div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter weight and height to calculate BMI</span>
                    </div>
                )}
            </div>
        </div>
    );
}



