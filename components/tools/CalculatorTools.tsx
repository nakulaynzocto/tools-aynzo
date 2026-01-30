"use client";
import { useState, useEffect } from 'react';
import { Calculator, Calendar, Activity, Percent, IndianRupee, Banknote, Tag, RefreshCw, Copy, CheckCircle2, DollarSign, PieChart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ScrollableNav } from '@/components/ScrollableNav';

interface CalculatorToolsProps {
    type: 'age-calculator' | 'bmi-calculator' | 'percentage-calculator' | 'gst-calculator' | 'emi-calculator' | 'discount-calculator';
}

export default function CalculatorTools({ type }: CalculatorToolsProps) {
    const calculatorNavTools = [
        {
            category: 'Health & Life',
            tools: [
                { id: 'age-calculator', label: 'Age', icon: Calendar },
                { id: 'bmi-calculator', label: 'BMI', icon: Activity },
            ]
        },
        {
            category: 'Finance',
            tools: [
                { id: 'gst-calculator', label: 'GST', icon: DollarSign },
                { id: 'emi-calculator', label: 'EMI', icon: PieChart },
                { id: 'discount-calculator', label: 'Discount', icon: Percent },
            ]
        },
        {
            category: 'Math',
            tools: [
                { id: 'percentage-calculator', label: 'Percentage', icon: Calculator },
            ]
        }
    ];

    const activeCategory = calculatorNavTools.find(cat => cat.tools.some(t => t.id === type));

    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Form States
    const [ageDate, setAgeDate] = useState('');
    const [bmi, setBmi] = useState({ height: '', weight: '', unit: 'metric' });
    const [percent, setPercent] = useState({ v1: '', v2: '', type: 'percentage-of' });
    const [gst, setGst] = useState({ amount: '', rate: '18', type: 'inclusive' });
    const [emi, setEmi] = useState({ principal: '', rate: '', tenure: '', type: 'months' });
    const [discount, setDiscount] = useState({ price: '', discount: '', tax: '0' });

    useEffect(() => {
        let res: any = null;
        switch (type) {
            case 'age-calculator':
                if (!ageDate) break;
                const birthDate = new Date(ageDate);
                const today = new Date();
                let years = today.getFullYear() - birthDate.getFullYear();
                let months = today.getMonth() - birthDate.getMonth();
                let days = today.getDate() - birthDate.getDate();
                if (days < 0) {
                    months--;
                    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                    days += lastDayOfMonth;
                }
                if (months < 0) {
                    years--;
                    months += 12;
                }
                res = { years, months, days };
                break;

            case 'bmi-calculator':
                const h = parseFloat(bmi.height);
                const w = parseFloat(bmi.weight);
                if (!h || !w) break;
                const heightInMeters = bmi.unit === 'metric' ? h / 100 : h * 0.0254;
                const weightInKg = bmi.unit === 'metric' ? w : w * 0.453592;
                const score = weightInKg / (heightInMeters * heightInMeters);
                let category = '';
                if (score < 18.5) category = 'Underweight';
                else if (score < 25) category = 'Normal weight';
                else if (score < 30) category = 'Overweight';
                else category = 'Obese';
                res = { score: score.toFixed(1), category };
                break;

            case 'percentage-calculator':
                const val1 = parseFloat(percent.v1);
                const val2 = parseFloat(percent.v2);
                if (isNaN(val1) || isNaN(val2)) break;
                if (percent.type === 'percentage-of') res = (val1 / 100) * val2;
                else if (percent.type === 'is-what-percentage') res = (val1 / val2) * 100;
                else if (percent.type === 'percentage-increase') res = ((val2 - val1) / val1) * 100;
                res = res.toFixed(2);
                break;

            case 'gst-calculator':
                const amt = parseFloat(gst.amount);
                const r = parseFloat(gst.rate);
                if (!amt || !r) break;
                if (gst.type === 'exclusive') {
                    const tax = (amt * r) / 100;
                    res = { tax: tax.toFixed(2), total: (amt + tax).toFixed(2) };
                } else {
                    const tax = amt - (amt * (100 / (100 + r)));
                    res = { tax: tax.toFixed(2), original: (amt - tax).toFixed(2) };
                }
                break;

            case 'emi-calculator':
                const p = parseFloat(emi.principal);
                const rate = parseFloat(emi.rate) / 12 / 100;
                const n = emi.type === 'years' ? parseFloat(emi.tenure) * 12 : parseFloat(emi.tenure);
                if (!p || !rate || !n) break;
                const emiVal = (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
                const totalPayment = emiVal * n;
                res = {
                    monthly: emiVal.toFixed(2),
                    total: totalPayment.toFixed(2),
                    interest: (totalPayment - p).toFixed(2)
                };
                break;

            case 'discount-calculator':
                const op = parseFloat(discount.price);
                const ds = parseFloat(discount.discount);
                const tx = parseFloat(discount.tax);
                if (!op) break;
                const savings = (op * ds) / 100;
                const discountedPrice = op - savings;
                const taxAmt = (discountedPrice * tx) / 100;
                res = {
                    final: (discountedPrice + taxAmt).toFixed(2),
                    savings: savings.toFixed(2),
                    tax: taxAmt.toFixed(2)
                };
                break;
        }
        setResult(res);
    }, [type, ageDate, bmi, percent, gst, emi, discount]);

    const calculate = () => {
        // Logic moved to useEffect
    };

    const copy = () => {
        const text = typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Calculator Navigation */}
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden p-8">
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* INPUTS */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Calculator size={14} /> Calculator Inputs
                        </h3>

                        {type === 'age-calculator' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">Date of Birth</label>
                                <input type="date" value={ageDate} onChange={e => setAgeDate(e.target.value)} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" />
                            </div>
                        )}

                        {type === 'bmi-calculator' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase opacity-50">Weight ({bmi.unit === 'metric' ? 'kg' : 'lbs'})</label>
                                        <input type="number" value={bmi.weight} onChange={e => setBmi({ ...bmi, weight: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="70" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase opacity-50">Height ({bmi.unit === 'metric' ? 'cm' : 'in'})</label>
                                        <input type="number" value={bmi.height} onChange={e => setBmi({ ...bmi, height: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="175" />
                                    </div>
                                </div>
                                <div className="bg-muted p-1 rounded-xl flex gap-1">
                                    {['metric', 'imperial'].map(u => (
                                        <button key={u} onClick={() => setBmi({ ...bmi, unit: u })} className={cn("flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all", bmi.unit === u ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{u}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {type === 'percentage-calculator' && (
                            <div className="space-y-4">
                                <select value={percent.type} onChange={e => setPercent({ ...percent, type: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-bold text-sm">
                                    <option value="percentage-of">What is % of X?</option>
                                    <option value="is-what-percentage">X is what % of Y?</option>
                                    <option value="percentage-increase">X to Y % Increase/Decrease</option>
                                </select>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" value={percent.v1} onChange={e => setPercent({ ...percent, v1: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="Value 1" />
                                    <input type="number" value={percent.v2} onChange={e => setPercent({ ...percent, v2: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="Value 2" />
                                </div>
                            </div>
                        )}

                        {type === 'gst-calculator' && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase opacity-50">Amount</label>
                                    <input type="number" value={gst.amount} onChange={e => setGst({ ...gst, amount: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="1000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase opacity-50">GST Rate (%)</label>
                                        <input
                                            type="number"
                                            value={gst.rate}
                                            onChange={e => setGst({ ...gst, rate: e.target.value })}
                                            className="w-full p-4 bg-input border-2 border-border rounded-xl font-bold"
                                            placeholder="18"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase opacity-50">Tax Type</label>
                                        <div className="bg-muted p-1 rounded-xl flex gap-1 h-[60px]">
                                            {['inclusive', 'exclusive'].map(t => (
                                                <button key={t} onClick={() => setGst({ ...gst, type: t })} className={cn("flex-1 text-[10px] font-black uppercase rounded-lg transition-all", gst.type === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === 'emi-calculator' && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase opacity-50">Principal Amount</label>
                                    <input type="number" value={emi.principal} onChange={e => setEmi({ ...emi, principal: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="100000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase opacity-50">Interest Rate (%)</label>
                                        <input type="number" value={emi.rate} onChange={e => setEmi({ ...emi, rate: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium" placeholder="8.5" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase opacity-50">Tenure</label>
                                        <input type="number" value={emi.tenure} onChange={e => setEmi({ ...emi, tenure: e.target.value })} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium rounded-b-none border-b-0" placeholder="12" />
                                        <div className="bg-muted p-1 rounded-b-xl flex gap-1">
                                            {['months', 'years'].map(t => (
                                                <button key={t} onClick={() => setEmi({ ...emi, type: t as any })} className={cn("flex-1 py-1 text-[9px] font-black uppercase rounded-lg", emi.type === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground")}>{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === 'discount-calculator' && (
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
                        )}

                    </div>

                    {/* RESULTS */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Activity size={14} /> Result Data
                        </h3>

                        {result ? (
                            <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-6 animate-in zoom-in-95 duration-500">
                                {type === 'age-calculator' && (
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl font-black text-primary">{result.years}</div>
                                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Years Young</div>
                                        <div className="flex gap-4 opacity-70">
                                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold">{result.months} Months</div>
                                            <div className="bg-card px-4 py-2 rounded-xl border border-border font-bold">{result.days} Days</div>
                                        </div>
                                    </div>
                                )}

                                {type === 'bmi-calculator' && (
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl font-black text-primary">{result.score}</div>
                                        <div className={cn("px-6 py-2 rounded-xl text-white font-black uppercase text-xs tracking-widest shadow-lg",
                                            result.category.includes('Normal') ? 'bg-emerald-500' : 'bg-amber-500'
                                        )}>
                                            {result.category}
                                        </div>
                                    </div>
                                )}

                                {type === 'percentage-calculator' && (
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl font-black text-primary">{result}%</div>
                                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Computed Result</div>
                                    </div>
                                )}

                                {(type === 'gst-calculator' || type === 'emi-calculator' || type === 'discount-calculator') && (
                                    <div className="w-full space-y-4">
                                        {Object.entries(result).map(([k, v]: [string, any]) => (
                                            <div key={k} className="flex justify-between items-center p-4 bg-card rounded-2xl border-2 border-border">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{k.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="text-xl font-black text-foreground">
                                                    {v}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mt-4">
                                    {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                    {copied ? 'Copied to Clipboard' : 'Copy All Results'}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                                <Calculator size={64} />
                                <span className="text-xs font-black uppercase tracking-widest text-center">Enter data & click<br />calculate to see results</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
