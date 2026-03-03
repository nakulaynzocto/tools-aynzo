"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Home, DollarSign } from 'lucide-react';

interface MortgageResult {
    monthlyPayment: string;
    principalAndInterest: string;
    taxes: string;
    insurance: string;
    pmi: string;
    totalInterest: string;
    isPmiApplied: boolean;
}

export function MortgageCalculator() {
    const [price, setPrice] = useState(350000);
    const [downPayment, setDownPayment] = useState(70000);
    const [rate, setRate] = useState(6.5);
    const [term, setTerm] = useState(30);
    const [taxes, setTaxes] = useState(3000); // Yearly
    const [insurance, setInsurance] = useState(1200); // Yearly
    const [pmi, setPmi] = useState(0.5); // % of loan
    const [copied, setCopied] = useState(false);

    const result = useMemo<MortgageResult | null>(() => {
        const principal = price - downPayment;
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = term * 12;

        if (principal <= 0 || rate <= 0 || term <= 0) {
            return null;
        }

        // Standard Mortgage Formula
        const monthlyPI = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        const monthlyTaxes = taxes / 12;
        const monthlyInsurance = insurance / 12;
        
        // PMI calculation (usually only if down payment < 20%)
        const downPaymentPercent = (downPayment / price) * 100;
        const monthlyPmi = downPaymentPercent < 20 ? (principal * (pmi / 100)) / 12 : 0;

        const totalMonthly = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPmi;

        return {
            monthlyPayment: totalMonthly.toFixed(2),
            principalAndInterest: monthlyPI.toFixed(2),
            taxes: monthlyTaxes.toFixed(2),
            insurance: monthlyInsurance.toFixed(2),
            pmi: monthlyPmi.toFixed(2),
            totalInterest: (monthlyPI * numberOfPayments - principal).toFixed(2),
            isPmiApplied: downPaymentPercent < 20
        };
    }, [price, downPayment, rate, term, taxes, insurance, pmi]);

    const copy = () => {
        if (!result) return;
        const text = `Monthly Payment: $${result.monthlyPayment}\nPrincipal & Interest: $${result.principalAndInterest}\nTaxes: $${result.taxes}\nInsurance: $${result.insurance}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Property Details</h3>
                    <Home size={16} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Home Price ($)</label>
                        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Down Payment ($)</label>
                            <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Interest Rate (%)</label>
                            <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Loan Term (Years)</label>
                        <select value={term} onChange={e => setTerm(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent">
                            <option value={15}>15 Years Fixed</option>
                            <option value={20}>20 Years Fixed</option>
                            <option value={30}>30 Years Fixed</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground text-xs">Prop. Taxes (Yearly $)</label>
                            <input type="number" value={taxes} onChange={e => setTaxes(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground text-xs">Insurance (Yearly $)</label>
                            <input type="number" value={insurance} onChange={e => setInsurance(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monthly Payment Breakdown</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Est. Monthly Payment</div>
                            <div className="text-6xl font-black text-primary animate-in fade-in slide-in-from-bottom-4 duration-500">${Number(result.monthlyPayment).toLocaleString()}</div>
                            
                            <div className="space-y-2 mt-6">
                                <div className="flex justify-between text-sm py-2 border-b border-border">
                                    <span className="text-muted-foreground">Principal & Interest</span>
                                    <span className="font-bold">${result.principalAndInterest}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-border">
                                    <span className="text-muted-foreground">Taxes & Insurance</span>
                                    <span className="font-bold">${(Number(result.taxes) + Number(result.insurance)).toFixed(2)}</span>
                                </div>
                                {result.isPmiApplied && (
                                    <div className="flex justify-between text-sm py-2 border-b border-border text-rose-500 font-bold">
                                        <span>PMI (Down Payment &lt; 20%)</span>
                                        <span>${result.pmi}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-card w-full p-4 rounded-xl border border-border flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Total Interest</span>
                            </div>
                            <span className="text-sm font-bold text-foreground">${Number(result.totalInterest).toLocaleString()}</span>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Details Copied' : 'Copy Breakdown'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Home size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Calculate your dream home monthly cost</span>
                    </div>
                )}
            </div>
        </div>
    );
}

