"use client";
import { useState, useEffect } from 'react';
import { RefreshCw, Copy, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];

export function CurrencyConverter() {
    const t = useTranslations('Common');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchRate = async () => {
        if (fromCurrency === toCurrency) {
            setRate(1);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
            const data = await response.json();
            if (data.rates && data.rates[toCurrency]) {
                setRate(data.rates[toCurrency]);
                setLastUpdate(new Date());
            } else {
                setError('Exchange rate not available');
            }
        } catch (e) {
            setError('Failed to fetch exchange rate');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRate();
    }, [fromCurrency, toCurrency]);

    const result = amount && rate ? (parseFloat(amount) * rate).toFixed(2) : '0.00';
    const displayResult = amount ? result : '0.00';

    const handleSwap = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(displayResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Rate Info */}
            {rate && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">Exchange Rate</div>
                            <div className="text-2xl font-black text-primary">
                                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                            </div>
                        </div>
                        <button
                            onClick={fetchRate}
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                    {lastUpdate && (
                        <div className="text-xs text-muted-foreground mt-2">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-bold">
                    {error}
                </div>
            )}

            {/* Converter */}
            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* From */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">From</label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-bold"
                            >
                                {currencies.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.code} - {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-2xl font-black text-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    {/* To */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-bold"
                            >
                                {currencies.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.code} - {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={displayResult}
                                readOnly
                                className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-2xl font-black text-foreground"
                            />
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                                    copied
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex items-center justify-center my-4 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:my-0">
                    <button
                        onClick={handleSwap}
                        className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

