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
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><TrendingDown className="w-8 h-8 text-primary" /></div>
                        DEBT-TO-INCOME RATIO
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Check if you qualify for a mortgage or loan.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY RESULTS'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> Income & Debts
                    </h3>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-muted-foreground uppercase">Gross Monthly Income</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground group-focus-within:text-primary transition-colors">$</span>
                            <input type="number" value={grossIncome} onChange={e => setGrossIncome(Number(e.target.value))} className="w-full pl-8 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold text-lg" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-muted-foreground uppercase">Monthly Debts</label>
                            <button onClick={addDebt} className="flex items-center gap-1.5 text-primary font-bold text-sm hover:underline">
                                <PlusCircle className="w-4 h-4" /> Add Debt
                            </button>
                        </div>
                        <div className="space-y-3">
                            {debts.map((d, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input type="text" value={d.name} onChange={e => updateDebt(i, 'name', e.target.value)} placeholder="Debt name" className="flex-1 px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-medium text-sm" />
                                    <div className="relative w-36"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                        <input type="number" value={d.amount} onChange={e => updateDebt(i, 'amount', Number(e.target.value))} className="w-full pl-7 pr-2 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm" />
                                    </div>
                                    <button onClick={() => removeDebt(i)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className={cn('bg-gradient-to-br p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10', cfg.gradFrom, cfg.gradTo)}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-4 text-center">
                            <StatusIcon className="w-10 h-10 mx-auto text-white/80" />
                            <p className="text-white/80 font-black uppercase tracking-[0.2em] text-sm">Your DTI Ratio</p>
                            <h2 className="text-7xl font-black tracking-tighter drop-shadow-lg">{result.dti.toFixed(1)}%</h2>
                            <p className="font-bold text-white/90">{result.label}</p>
                            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                                <div className="h-full bg-white/90 transition-all duration-1000" style={{ width: `${Math.min(result.dti, 100)}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <TrendingDown className="w-6 h-6 text-blue-500" />
                                </div>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Debt</span>
                            </div>
                            <p className="text-2xl font-black text-foreground">${result.totalDebt.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Monthly obligations</p>
                        </div>
                        <div className="bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 text-purple-500" />
                                </div>
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Safe Zone</span>
                            </div>
                            <p className="text-2xl font-black text-primary">≤ 36%</p>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Lender's ideal ratio</p>
                        </div>
                    </div>

                    <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-foreground">DTI Tip</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Most mortgage lenders prefer a DTI below <strong>36%</strong>. Paying off high-interest debt first (avalanche method) is the fastest way to reduce your ratio.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
