"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateBMI } from '@/components/utils/calculator/calculatorProcessing';

export function BMICalculator() {
    const [bmi, setBmi] = useState({ height: '', weight: '', unit: 'metric' as 'metric' | 'imperial' });
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const h = parseFloat(bmi.height);
        const w = parseFloat(bmi.weight);
        if (!h || !w) {
            setResult(null);
            return;
        }
        const result = calculateBMI({ height: h, weight: w, unit: bmi.unit });
        setResult(result);
    }, [bmi]);

    const copy = () => {
        const text = typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Inputs</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Weight ({bmi.unit === 'metric' ? 'kg' : 'lbs'})</label>
                            <input type="number" value={bmi.weight} onChange={e => setBmi({ ...bmi, weight: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="70" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Height ({bmi.unit === 'metric' ? 'cm' : 'in'})</label>
                            <input type="number" value={bmi.height} onChange={e => setBmi({ ...bmi, height: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="175" />
                        </div>
                    </div>
                    <div className="bg-muted p-1 rounded-xl flex gap-1">
                        {['metric', 'imperial'].map(u => (
                            <button key={u} onClick={() => setBmi({ ...bmi, unit: u as any })} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all", bmi.unit === u ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{u}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="text-center space-y-4">
                            <div className="text-6xl font-black text-primary">{result.bmi}</div>
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
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter weight and height to calculate BMI</span>
                    </div>
                )}
            </div>
        </div>
    );
}

