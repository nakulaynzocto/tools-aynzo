"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Home, DollarSign, Info } from 'lucide-react';

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
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            {/* Inputs Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Property Details</h3>
                
                <div className="space-y-6 bg-muted/10 p-8 rounded-3xl border-2 border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Home Price</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Down Payment</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Interest Rate</label>
                            <div className="relative group">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                                <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full pl-4 pr-8 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wider">Loan Term</label>
                        <select value={term} onChange={e => setTerm(Number(e.target.value))} className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base appearance-none">
                            <option value={15}>15 Years Fixed</option>
                            <option value={20}>20 Years Fixed</option>
                            <option value={30}>30 Years Fixed</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Property Taxes (Yearly)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input type="number" value={taxes} onChange={e => setTaxes(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground uppercase tracking-wider">Insurance (Yearly)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input type="number" value={insurance} onChange={e => setInsurance(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-base" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monthly Payment Breakdown</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                        <div className="text-center space-y-4 w-full">
                            <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500">
                                ${Number(result.monthlyPayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                                Estimated Monthly Payment
                            </div>

                            <div className="w-full space-y-3 bg-card/50 p-6 rounded-2xl border border-border/50 mt-4 text-left">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">Principal & Interest</span>
                                    <span className="text-foreground">${result.principalAndInterest}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">Taxes & Insurance</span>
                                    <span className="text-foreground">${(Number(result.taxes) + Number(result.insurance)).toFixed(2)}</span>
                                </div>
                                {result.isPmiApplied && (
                                    <div className="flex justify-between items-center text-xs font-black text-rose-500">
                                        <span className="uppercase tracking-wider">PMI Included</span>
                                        <span>${result.pmi}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-border/50 flex justify-between items-center text-xs font-bold text-primary">
                                    <span className="uppercase tracking-wider">Total Interest Paid</span>
                                    <span>${Number(result.totalInterest).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Details Copied' : 'Copy Full Breakdown'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <Home size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter details to see breakdown</span>
                    </div>
                )}

                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                    <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        A <strong>20% down payment</strong> usually eliminates the need for Private Mortgage Insurance (PMI), saving you hundreds every month.
                    </p>
                </div>
            </div>
        </div>
    );
}

