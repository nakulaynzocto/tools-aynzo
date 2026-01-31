"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { calculateDiscount } from '@/components/utils/calculator/calculatorProcessing';

export function DiscountCalculator() {
    const [discount, setDiscount] = useState({ price: '', discount: '', tax: '0' });
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const op = parseFloat(discount.price);
        const ds = parseFloat(discount.discount);
        const tx = parseFloat(discount.tax);
        if (!op) {
            setResult(null);
            return;
        }
        const res = calculateDiscount({ originalPrice: op, discountPercent: ds || 0 });
        const taxAmt = (res.finalPrice * tx) / 100;
        setResult({ final: (res.finalPrice + taxAmt).toFixed(2), savings: res.discountAmount.toFixed(2), tax: taxAmt.toFixed(2) });
    }, [discount]);

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
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase opacity-50">Original Price</label>
                        <input type="number" value={discount.price} onChange={e => setDiscount({ ...discount, price: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="499" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Discount (%)</label>
                            <input type="number" value={discount.discount} onChange={e => setDiscount({ ...discount, discount: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="20" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Tax (%)</label>
                            <input type="number" value={discount.tax} onChange={e => setDiscount({ ...discount, tax: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Data</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6">
                        <div className="w-full space-y-4">
                            {Object.entries(result).map(([k, v]: [string, any]) => (
                                <div key={k} className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{k.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-xl font-black text-foreground">{v}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter price and discount to calculate</span>
                    </div>
                )}
            </div>
        </div>
    );
}

