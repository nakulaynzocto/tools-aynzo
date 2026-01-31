"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { calculateAge } from '@/components/utils/calculator/calculatorProcessing';

export function AgeCalculator() {
    const [ageDate, setAgeDate] = useState('');
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!ageDate) {
            setResult(null);
            return;
        }
        const birthDate = new Date(ageDate);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
        if (days < 0) {
            months--;
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += lastDayOfMonth;
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        setResult({ years, months, days });
    }, [ageDate]);

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
                <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Date of Birth</label>
                    <input type="date" value={ageDate} onChange={e => setAgeDate(e.target.value)} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="text-center space-y-4">
                            <div className="text-6xl font-black text-primary">{result.years}</div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Years Young</div>
                            <div className="flex gap-4 opacity-70">
                                <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold">{result.months} Months</div>
                                <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold">{result.days} Days</div>
                            </div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter date of birth to calculate age</span>
                    </div>
                )}
            </div>
        </div>
    );
}


