"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Utensils, Users } from 'lucide-react';
import { cn } from '@/utils/cn';

export function TipCalculator() {
    const [billAmount, setBillAmount] = useState('50.00');
    const [tipPercent, setTipPercent] = useState('18');
    const [people, setPeople] = useState('1');
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        const bill = parseFloat(billAmount);
        const tip = parseFloat(tipPercent);
        const p = parseInt(people);
        if (!bill || isNaN(tip) || p < 1) return null;

        const tipAmount = bill * (tip / 100);
        const totalAmount = bill + tipAmount;
        
        return {
            tipTotal: tipAmount.toFixed(2),
            billTotal: totalAmount.toFixed(2),
            perPerson: (totalAmount / p).toFixed(2)
        };
    }, [billAmount, tipPercent, people]);

    const copy = () => {
        if (!result) return;
        const text = `Bill: $${billAmount}\nTip (${tipPercent}%): $${result.tipTotal}\nTotal: $${result.billTotal}\nPer person: $${result.perPerson}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bill Details</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-widest">Bill Amount ($)</label>
                        <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-black text-3xl" placeholder="50.00" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-widest">Tip Percentage (%)</label>
                        <div className="flex gap-2">
                            {['15', '18', '20', '25'].map(p => (
                                <button key={p} onClick={() => setTipPercent(p)} className={cn("flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all border-2", tipPercent === p ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/30")}>{p}%</button>
                            ))}
                            <input type="number" value={tipPercent} onChange={e => setTipPercent(e.target.value)} className="w-20 px-3 py-2 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-center text-xs" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest"><Users size={14} /> Split Between</label>
                        <input type="number" value={people} onChange={e => setPeople(e.target.value)} className="w-full px-5 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-lg" placeholder="1" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Summary</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-8 min-h-[400px]">
                        <div className="w-full space-y-6">
                            <div className="text-center p-8 bg-primary/10 rounded-3xl border-2 border-primary/20 animate-in fade-in slide-in-from-top duration-500">
                                <div className="text-5xl font-black text-primary animate-pulse-slow">${result.perPerson}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">Per Person Total</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <div className="p-6 bg-muted/20 border-2 border-border rounded-2xl space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tip Amount</span>
                                    <div className="text-xl font-black text-foreground">${result.tipTotal}</div>
                                </div>
                                <div className="p-6 bg-muted/20 border-2 border-border rounded-2xl space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bill Total</span>
                                    <div className="text-xl font-black text-foreground">${result.billTotal}</div>
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all border-t-2 border-border/50 pt-4 w-full justify-center">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Details Copied' : 'Copy Breakdown'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <Utensils size={40} className="mb-2 opacity-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Enter bill total to see tip summary</span>
                    </div>
                )}
            </div>
        </div>
    );
}
