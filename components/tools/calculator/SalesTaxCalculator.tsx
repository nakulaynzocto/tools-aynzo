"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Landmark, Info, Receipt } from 'lucide-react';
import { cn } from '@/utils/cn';

const US_STATES = [
    { name: 'California', rate: 7.25 },
    { name: 'New York', rate: 4.0 },
    { name: 'Texas', rate: 6.25 },
    { name: 'Florida', rate: 6.0 },
    { name: 'Illinois', rate: 6.25 },
    { name: 'Pennsylvania', rate: 6.0 },
    { name: 'Ohio', rate: 5.75 },
    { name: 'Georgia', rate: 4.0 },
    { name: 'North Carolina', rate: 4.75 },
    { name: 'Michigan', rate: 6.0 },
    { name: 'Other / Custom', rate: 0 }
];

interface TaxResult {
    netAmount: string;
    taxAmount: string;
    totalAmount: string;
}

export function SalesTaxCalculator() {
    const [amount, setAmount] = useState(100);
    const [rate, setRate] = useState(7.25);
    const [isInclusive, setIsInclusive] = useState(false);
    const [copied, setCopied] = useState(false);

    const result = useMemo<TaxResult | null>(() => {
        if (amount <= 0 || rate < 0) {
            return null;
        }

        let netAmount, taxAmount, totalAmount;

        if (isInclusive) {
            totalAmount = amount;
            netAmount = amount / (1 + rate / 100);
            taxAmount = totalAmount - netAmount;
        } else {
            netAmount = amount;
            taxAmount = amount * (rate / 100);
            totalAmount = netAmount + taxAmount;
        }

        return {
            netAmount: netAmount.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            totalAmount: totalAmount.toFixed(2)
        };
    }, [amount, rate, isInclusive]);

    const copy = () => {
        if (!result) return;
        const text = `Net Amount: $${result.netAmount}\nTax Amount: $${result.taxAmount}\nTotal Amount: $${result.totalAmount}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tax Info</h3>
                    <Landmark size={16} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Amount ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        <div className="flex gap-2">
                            <button onClick={() => setIsInclusive(false)} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg border-2 transition-all", !isInclusive ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border")}>Add Tax</button>
                            <button onClick={() => setIsInclusive(true)} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg border-2 transition-all", isInclusive ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border")}>Remove Tax</button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Tax Rate (%)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} className="p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                            <select value={rate} onChange={e => setRate(Number(e.target.value))} className="p-4 bg-input border-2 border-border rounded-xl text-sm font-bold outline-none focus:border-accent">
                                {US_STATES.map(s => <option key={s.name} value={s.rate}>{s.name} ({s.rate}%)</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3 mt-4">
                    <Info size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        Sales tax rates vary significantly by state and local jurisdiction. This tool allows you to add tax to a base price or calculate the original price from a tax-inclusive total.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tax Summary</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Total {isInclusive ? 'After Tax' : 'Bill Amount'}</div>
                            <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">${Number(result.totalAmount).toLocaleString()}</div>
                            
                            <div className="bg-card w-full p-6 rounded-2xl border-2 border-border space-y-3 mt-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Net Price</span>
                                    <span className="font-bold text-foreground">${result.netAmount}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Tax ({rate}%)</span>
                                    <span className="font-bold text-emerald-500">+${result.taxAmount}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Tax Summary Copied' : 'Copy Invoice Details'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Receipt size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter amount to see tax breakdown</span>
                    </div>
                )}
            </div>
        </div>
    );
}

