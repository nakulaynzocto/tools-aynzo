"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

interface PercentResult {
    value: string;
    suffix: string;
}

export function PercentageCalculator() {
    const [percentInputs, setPercentInputs] = useState({ v1: '', v2: '', type: 'percentage-of' });
    const [copied, setCopied] = useState(false);

    const result = useMemo<PercentResult | null>(() => {
        const val1 = parseFloat(percentInputs.v1);
        const val2 = parseFloat(percentInputs.v2);
        if (isNaN(val1) || isNaN(val2)) {
            return null;
        }

        let resValue: number = 0;
        let suffix = '';

        if (percentInputs.type === 'percentage-of') {
            resValue = (val1 / 100) * val2;
            suffix = '';
        } else if (percentInputs.type === 'is-what-percentage') {
            resValue = (val1 / val2) * 100;
            suffix = '%';
        } else if (percentInputs.type === 'percentage-increase') {
            resValue = ((val2 - val1) / val1) * 100;
            suffix = '%';
        }

        return {
            value: resValue.toFixed(2),
            suffix
        };
    }, [percentInputs]);

    const copy = () => {
        if (!result) return;
        const text = `Result: ${result.value}${result.suffix}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Inputs</h3>
                <div className="space-y-4">
                    <select value={percentInputs.type} onChange={e => setPercentInputs({ ...percentInputs, type: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-bold text-sm focus:border-primary outline-none">
                        <option value="percentage-of">What is % of X?</option>
                        <option value="is-what-percentage">X is what % of Y?</option>
                        <option value="percentage-increase">X to Y % Increase/Decrease</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" value={percentInputs.v1} onChange={e => setPercentInputs({ ...percentInputs, v1: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="Value 1" />
                        <input type="number" value={percentInputs.v2} onChange={e => setPercentInputs({ ...percentInputs, v2: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="Value 2" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="text-center space-y-4">
                            <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">
                                {result.value}{result.suffix}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Computed Result</div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy Result'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter values to calculate percentage</span>
                    </div>
                )}
            </div>
        </div>
    );
}



