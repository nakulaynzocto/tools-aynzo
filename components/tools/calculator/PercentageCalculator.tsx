"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { calculatePercentage } from '@/components/utils/calculator/calculatorProcessing';

export function PercentageCalculator() {
    const [percent, setPercent] = useState({ v1: '', v2: '', type: 'percentage-of' });
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const val1 = parseFloat(percent.v1);
        const val2 = parseFloat(percent.v2);
        if (isNaN(val1) || isNaN(val2)) {
            setResult(null);
            return;
        }
        const res = calculatePercentage({ value: val1, percentage: val2 });
        if (percent.type === 'percentage-of') {
            setResult((val1 / 100) * val2);
        } else if (percent.type === 'is-what-percentage') {
            setResult((val1 / val2) * 100);
        } else if (percent.type === 'percentage-increase') {
            setResult(((val2 - val1) / val1) * 100);
        }
    }, [percent]);

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
                    <select value={percent.type} onChange={e => setPercent({ ...percent, type: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-bold text-sm">
                        <option value="percentage-of">What is % of X?</option>
                        <option value="is-what-percentage">X is what % of Y?</option>
                        <option value="percentage-increase">X to Y % Increase/Decrease</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" value={percent.v1} onChange={e => setPercent({ ...percent, v1: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="Value 1" />
                        <input type="number" value={percent.v2} onChange={e => setPercent({ ...percent, v2: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="Value 2" />
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="text-center space-y-4">
                            <div className="text-6xl font-black text-primary">{result}%</div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Computed Result</div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter values to calculate percentage</span>
                    </div>
                )}
            </div>
        </div>
    );
}


