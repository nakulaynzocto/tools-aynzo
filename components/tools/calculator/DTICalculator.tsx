"use client";
import { useState, useMemo } from 'react';
import { PlusCircle, Trash2, TrendingDown, ShieldCheck, AlertTriangle, XCircle, Copy, Check, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DebtItem { name: string; amount: number; }

export function DTICalculator() {
    const [grossIncome, setGrossIncome] = useState<number>(6000);
    const [debts, setDebts] = useState<DebtItem[]>([
        { name: 'Mortgage / Rent', amount: 1200 },
        { name: 'Car Loan', amount: 350 },
        { name: 'Credit Card Min.', amount: 150 },
    ]);
    const [copied, setCopied] = useState(false);

    const addDebt = () => setDebts(prev => [...prev, { name: '', amount: 0 }]);
    const removeDebt = (i: number) => setDebts(prev => prev.filter((_, idx) => idx !== i));
    const updateDebt = (i: number, field: 'name' | 'amount', val: string | number) =>
        setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

    const result = useMemo(() => {
        const totalDebt = debts.reduce((s, d) => s + (d.amount || 0), 0);
        const dti = grossIncome > 0 ? (totalDebt / grossIncome) * 100 : 0;
        let status: 'excellent' | 'good' | 'fair' | 'poor';
        let label: string;
        if (dti <= 20) { status = 'excellent'; label = 'Excellent – Easily qualifies for loans'; }
        else if (dti <= 36) { status = 'good'; label = 'Good – Meets most lender requirements'; }
        else if (dti <= 43) { status = 'fair'; label = 'Fair – Borderline for mortgage approval'; }
        else { status = 'poor'; label = 'High – May struggle to qualify for loans'; }
        return { totalDebt, dti, status, label };
    }, [grossIncome, debts]);

    const statusConfig = {
        excellent: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30', gradFrom: 'from-green-600', gradTo: 'to-emerald-500', icon: ShieldCheck, bar: 'bg-green-500' },
        good: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', gradFrom: 'from-blue-600', gradTo: 'to-blue-400', icon: ShieldCheck, bar: 'bg-blue-500' },
        fair: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', gradFrom: 'from-amber-600', gradTo: 'to-orange-400', icon: AlertTriangle, bar: 'bg-amber-500' },
        poor: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', gradFrom: 'from-red-600', gradTo: 'to-red-400', icon: XCircle, bar: 'bg-red-500' },
    };
    const cfg = statusConfig[result.status];
    const StatusIcon = cfg.icon;

    const handleCopy = () => {
        navigator.clipboard.writeText(`DTI Ratio: ${result.dti.toFixed(1)}%\nTotal Monthly Debts: $${result.totalDebt.toLocaleString()}\nGross Monthly Income: $${grossIncome.toLocaleString()}\nStatus: ${result.label}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Income & Debts</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Gross Monthly Income</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground group-focus-within:text-primary transition-colors">$</span>
                            <input type="number" value={grossIncome} onChange={e => setGrossIncome(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Monthly Debts</label>
                            <button onClick={addDebt} className="flex items-center gap-1.5 text-primary font-bold text-xs hover:underline">
                                <PlusCircle className="w-4 h-4" /> Add Debt
                            </button>
                        </div>
                        <div className="space-y-3">
                            {debts.map((d, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input type="text" value={d.name} onChange={e => updateDebt(i, 'name', e.target.value)} placeholder="Debt name" className="flex-1 px-4 py-2.5 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-medium text-sm" />
                                    <div className="relative w-32">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">$</span>
                                        <input type="number" value={d.amount} onChange={e => updateDebt(i, 'amount', Number(e.target.value))} className="w-full pl-6 pr-2 py-2.5 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm" />
                                    </div>
                                    <button onClick={() => removeDebt(i)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Debt-to-Income Ratio</h3>

                <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                    <div className="text-center space-y-4">
                        <div className={cn('text-6xl font-black transition-colors animate-in fade-in zoom-in duration-500', cfg.color)}>
                            {result.dti.toFixed(1)}%
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Current DTI Ratio
                        </div>
                        <div className={cn('px-4 py-2 rounded-xl border font-bold text-xs shadow-sm flex items-center gap-2', cfg.bg, cfg.border, cfg.color)}>
                            <StatusIcon className="w-4 h-4" /> {result.label.split(' – ')[0]}
                        </div>
                    </div>

                    <div className="w-full space-y-4 bg-card/50 p-6 rounded-2xl border border-border/50">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Total Monthly Debt</span>
                            <span className="text-foreground">${result.totalDebt.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden border border-border/50">
                            <div className={cn('h-full transition-all duration-1000', cfg.bar)} style={{ width: `${Math.min(result.dti, 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium text-center italic">{result.label.split(' – ')[1]}</p>
                    </div>

                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                        {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        {copied ? 'Copied to Clipboard' : 'Copy DTI Summary'}
                    </button>
                </div>

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Lenders typically prefer a DTI ratio of <strong>36% or less</strong> for the best interest rates and loan terms.
                    </p>
                </div>
            </div>
        </div>
    );
}
