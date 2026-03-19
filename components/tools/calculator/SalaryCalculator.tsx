"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export function SalaryCalculator() {
    const [salary, setSalary] = useState('50000');
    const [hoursPerWeek, setHoursPerWeek] = useState('40');
    const [copied, setCopied] = useState(false);

    const breakdown = useMemo(() => {
        const annual = parseFloat(salary);
        const hours = parseFloat(hoursPerWeek);
        if (!annual || !hours) return null;

        const weeks = 52;
        const totalHours = hours * weeks;
        
        return {
            hourly: (annual / totalHours).toFixed(2),
            daily: (annual / (weeks * 5)).toFixed(2),
            weekly: (annual / weeks).toFixed(2),
            biweekly: (annual / 26).toFixed(2),
            monthly: (annual / 12).toFixed(2),
            annual: annual.toLocaleString()
        };
    }, [salary, hoursPerWeek]);

    const copy = () => {
        if (!breakdown) return;
        const text = `Salary Breakdown:\nAnnual: $${breakdown.annual}\nMonthly: $${breakdown.monthly}\nHourly: $${breakdown.hourly}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Earnings Input</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground">Annual Salary ($)</label>
                        <input 
                            type="number" 
                            value={salary} 
                            onChange={e => setSalary(e.target.value)} 
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-black text-2xl" 
                            placeholder="50000" 
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground">Work Hours Per Week</label>
                        <input 
                            type="number" 
                            value={hoursPerWeek} 
                            onChange={e => setHoursPerWeek(e.target.value)} 
                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-lg" 
                            placeholder="40" 
                        />
                    </div>

                    <div className="px-5 py-4 bg-primary/10 rounded-2xl border-2 border-primary/20 flex gap-4 items-start">
                        <Info className="text-primary mt-1 shrink-0" size={18} />
                        <p className="text-[10px] font-bold text-primary/80 leading-relaxed uppercase tracking-wider">Calculations assume 52 weeks per year and 2,080 standard US work hours for full-time employees.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Wage Breakdown</h3>
                
                {breakdown ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-stretch gap-6 flex-1 min-h-[400px]">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Hourly', value: breakdown.hourly, icon: TrendingUp },
                                { label: 'Daily', value: breakdown.daily },
                                { label: 'Weekly', value: breakdown.weekly },
                                { label: 'Bi-Weekly', value: breakdown.biweekly },
                                { label: 'Monthly', value: breakdown.monthly },
                                { label: 'Annual', value: breakdown.annual }
                            ].map((item, i) => (
                                <div key={item.label} className={cn("p-6 rounded-2xl border-2 border-border flex flex-col gap-2 transition-all hover:border-primary/20", i === 0 && "bg-primary/10 border-primary/20")}>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                    <div className="text-xl font-black text-foreground flex items-center justify-between">
                                        <span>${item.value}</span>
                                        {i === 0 && <TrendingUp size={14} className="text-primary" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={copy} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all py-4 border-t-2 border-border/50 pt-6">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Details Copied' : 'Copy Full Breakdown'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <span className="text-xs font-black uppercase tracking-widest">Enter salary to see wage conversion</span>
                    </div>
                )}
            </div>
        </div>
    );
}
