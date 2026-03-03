"use client";
import { useState, useMemo } from 'react';
import { Copy, CheckCircle2, Megaphone, Info, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CPMResult {
    label: string;
    value: string;
    unit: string;
}

export function CPMCalculator() {
    const [cost, setCost] = useState(1000);
    const [cpm, setCpm] = useState(5);
    const [impressions, setImpressions] = useState(200000);
    const [solveFor, setSolveFor] = useState<'cost' | 'cpm' | 'impressions'>('cost');
    const [copied, setCopied] = useState(false);

    const result = useMemo<CPMResult | null>(() => {
        // CPM = (Cost / Impressions) * 1000
        // Cost = (CPM * Impressions) / 1000
        // Impressions = (Cost / CPM) * 1000

        let calcCost = cost;
        let calcCpm = cpm;
        let calcImpressions = impressions;

        if (solveFor === 'cost') {
            calcCost = (cpm * impressions) / 1000;
            return { label: 'Total Cost', value: `$${calcCost.toLocaleString()}`, unit: 'USD' };
        } else if (solveFor === 'cpm') {
            if (impressions <= 0) return null;
            calcCpm = (cost / impressions) * 1000;
            return { label: 'Effective CPM', value: `$${calcCpm.toFixed(2)}`, unit: 'Per 1000 Impressions' };
        } else if (solveFor === 'impressions') {
            if (cpm <= 0) return null;
            calcImpressions = (cost / cpm) * 1000;
            return { label: 'Total Impressions', value: Math.floor(calcImpressions).toLocaleString(), unit: 'Views' };
        }
        return null;
    }, [cost, cpm, impressions, solveFor]);

    const copy = () => {
        if (!result) return;
        const text = `${result.label}: ${result.value} ${result.unit}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ad Metrics</h3>
                    <Megaphone size={16} className="text-primary" />
                </div>
                
                <div className="bg-muted p-1 rounded-xl flex gap-1">
                    {(['cost', 'cpm', 'impressions'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setSolveFor(mode)}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                solveFor === mode ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Solve {mode}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {solveFor !== 'cost' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Total Campaign Cost ($)</label>
                            <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    )}
                    {solveFor !== 'cpm' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">CPM (Cost per 1000 views) ($)</label>
                            <input type="number" value={cpm} onChange={e => setCpm(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    )}
                    {solveFor !== 'impressions' && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Total Impressions (Views)</label>
                            <input type="number" value={impressions} onChange={e => setImpressions(Number(e.target.value))} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                        </div>
                    )}
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                    <Eye size={16} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        CPM (Cost Per Mille) is a marketing term used to denote the price of 1,000 advertisement impressions on one web page. It is a industry standard for ad pricing.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Calculator Output</h3>
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center gap-6 shadow-sm">
                        <div className="text-center space-y-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{result.label}</div>
                            <div className="text-6xl font-black text-primary animate-in fade-in zoom-in duration-500">{result.value}</div>
                            <div className="text-xs font-black uppercase text-muted-foreground tracking-widest">{result.unit}</div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'Measurement Copied' : 'Copy All Data'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Megaphone size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Solve for Cost, CPM, or Reach</span>
                    </div>
                )}
            </div>
        </div>
    );
}

