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
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Body Measurements</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Unit System</label>
                        <div className="flex p-1 bg-muted/20 rounded-xl gap-1">
                            {['metric', 'imperial'].map(u => (
                                <button key={u} onClick={() => setBmiInputs({ ...bmiInputs, unit: u as any })} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all", bmiInputs.unit === u ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}>{u}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Weight ({bmiInputs.unit === 'metric' ? 'kg' : 'lbs'})</label>
                            <input type="number" value={bmiInputs.weight} onChange={e => setBmiInputs({ ...bmiInputs, weight: e.target.value })} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" placeholder="70" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Height ({bmiInputs.unit === 'metric' ? 'cm' : 'in'})</label>
                            <input type="number" value={bmiInputs.height} onChange={e => setBmiInputs({ ...bmiInputs, height: e.target.value })} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" placeholder="175" />
                        </div>
                    </div>

                    {result && (
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">BMI Range Scale</label>
                            <div className="relative h-4 bg-muted/20 rounded-full overflow-hidden flex">
                                <div className="h-full bg-blue-500/40 w-[18.5%]" />
                                <div className="h-full bg-emerald-500/40 w-[6.5%]" />
                                <div className="h-full bg-amber-500/40 w-[5%]" />
                                <div className="h-full bg-rose-500/40 flex-1" />
                                <div className="absolute top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000" style={{ left: `${Math.min(100, (parseFloat(result.bmi) / 40) * 100)}%` }} />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                <span>Under</span>
                                <span>Normal</span>
                                <span>Over</span>
                                <span>Obese</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">BMI Result</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                        <div className="text-center space-y-4">
                            <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">{result.bmi}</div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Your Body Mass Index</div>
                            
                            <div className={cn("mt-6 px-8 py-3 rounded-2xl font-black uppercase text-sm tracking-widest shadow-sm",
                                result.category === 'Normal weight' ? 'bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20' : 
                                result.category === 'Underweight' ? 'bg-blue-500/10 text-blue-600 border-2 border-blue-500/20' :
                                'bg-amber-500/10 text-amber-600 border-2 border-amber-500/20'
                            )}>
                                {result.category}
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy BMI Details'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter weight and height to see BMI</span>
                    </div>
                )}
            </div>
        </div>
    );
}



