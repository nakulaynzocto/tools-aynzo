"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

interface DiscountResult {
    final: string;
    savings: string;
    tax: string;
}

export function DiscountCalculator() {
    const [inputs, setInputs] = useState({ price: '', discount: '', tax: '0' });
    const [copied, setCopied] = useState(false);

    const result = useMemo<DiscountResult | null>(() => {
        const op = parseFloat(inputs.price);
        const ds = parseFloat(inputs.discount);
        const tx = parseFloat(inputs.tax);

        if (!op || isNaN(op)) {
            return null;
        }

        const discountAmount = (op * (ds || 0)) / 100;
        const discountedPrice = op - discountAmount;
        const taxAmt = (discountedPrice * (tx || 0)) / 100;

        return {
            final: (discountedPrice + taxAmt).toFixed(2),
            savings: discountAmount.toFixed(2),
            tax: taxAmt.toFixed(2)
        };
    }, [inputs]);

    const copy = () => {
        if (!result) return;
        const text = `Final Price: ${result.final}\nSavings: ${result.savings}\nTax: ${result.tax}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Inputs</h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase opacity-50">Original Price</label>
                        <input type="number" value={inputs.price} onChange={e => setInputs({ ...inputs, price: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="499" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Discount (%)</label>
                            <input type="number" value={inputs.discount} onChange={e => setInputs({ ...inputs, discount: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Tax (%)</label>
                            <input type="number" value={inputs.tax} onChange={e => setInputs({ ...inputs, tax: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium focus:border-primary outline-none" placeholder="5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Final Price</span>
                                <span className="text-xl font-black text-primary">${result.final}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Savings</span>
                                <span className="text-xl font-black text-emerald-500">${result.savings}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tax Amount</span>
                                <span className="text-xl font-black text-foreground">${result.tax}</span>
                            </div>
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter price and discount to calculate</span>
                    </div>
                )}
            </div>
        </div>
    );
}



