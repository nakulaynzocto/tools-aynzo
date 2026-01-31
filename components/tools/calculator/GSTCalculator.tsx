"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { calculateGST } from '@/components/utils/calculator/calculatorProcessing';

export function GSTCalculator() {
    const [gst, setGst] = useState({ amount: '', rate: '18', type: 'inclusive' as 'inclusive' | 'exclusive' });
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const amt = parseFloat(gst.amount);
        const r = parseFloat(gst.rate);
        if (!amt || !r) {
            setResult(null);
            return;
        }
        const res = calculateGST({ amount: amt, gstRate: r });
        if (gst.type === 'exclusive') {
            setResult({ tax: res.gstAmount, total: res.totalAmount });
        } else {
            setResult({ tax: res.gstAmount, original: res.baseAmount });
        }
    }, [gst]);

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
                        <label className="text-xs font-bold uppercase opacity-50">Amount</label>
                        <input type="number" value={gst.amount} onChange={e => setGst({ ...gst, amount: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="1000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">GST Rate (%)</label>
                            <input type="number" value={gst.rate} onChange={e => setGst({ ...gst, rate: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-bold" placeholder="18" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase opacity-50">Tax Type</label>
                            <div className="bg-muted p-1 rounded-xl flex gap-1 h-[60px]">
                                {['inclusive', 'exclusive'].map(t => (
                                    <button key={t} onClick={() => setGst({ ...gst, type: t as any })} className={cn("flex-1 text-[10px] font-black uppercase rounded-lg transition-all", gst.type === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{t}</button>
                                ))}
                            </div>
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
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter amount and GST rate to calculate</span>
                    </div>
                )}
            </div>
        </div>
    );
}

