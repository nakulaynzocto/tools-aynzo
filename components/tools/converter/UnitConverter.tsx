"use client";
import { useState } from 'react';
import { ArrowLeftRight, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'time' | 'area';

interface Unit {
    name: string;
    symbol: string;
    toBase: (value: number) => number;
    fromBase: (value: number) => number;
}

const units: Record<UnitCategory, Unit[]> = {
    length: [
        { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
        { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        { name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
        { name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
        { name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
        { name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    ],
    weight: [
        { name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { name: 'Gram', symbol: 'g', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Kilogram', symbol: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        { name: 'Ounce', symbol: 'oz', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
        { name: 'Pound', symbol: 'lb', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
        { name: 'Ton', symbol: 't', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    ],
    temperature: [
        { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
        { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
    volume: [
        { name: 'Milliliter', symbol: 'ml', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Gallon (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
        { name: 'Cup', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
        { name: 'Fluid Ounce', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
    time: [
        { name: 'Second', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Minute', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
        { name: 'Hour', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
        { name: 'Day', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
        { name: 'Week', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
        { name: 'Month', symbol: 'mo', toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
        { name: 'Year', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
    ],
    area: [
        { name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
        { name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
        { name: 'Square Mile', symbol: 'mi²', toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
        { name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
        { name: 'Hectare', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    ],
};

export function UnitConverter() {
    const t = useTranslations('Common');
    const [category, setCategory] = useState<UnitCategory>('length');
    const [fromUnit, setFromUnit] = useState(0);
    const [toUnit, setToUnit] = useState(1);
    const [value, setValue] = useState('');
    const [copied, setCopied] = useState(false);

    const currentUnits = units[category];
    const fromUnitData = currentUnits[fromUnit];
    const toUnitData = currentUnits[toUnit];

    const convert = (val: number): number => {
        if (isNaN(val) || val === 0) return 0;
        const baseValue = fromUnitData.toBase(val);
        return toUnitData.fromBase(baseValue);
    };

    const result = value ? convert(parseFloat(value)) : 0;
    const displayResult = isNaN(result) ? '0' : result.toFixed(6).replace(/\.?0+$/, '');

    const handleSwap = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
        if (value) {
            setValue(displayResult);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(displayResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(units) as UnitCategory[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setCategory(cat);
                                setFromUnit(0);
                                setToUnit(1);
                                setValue('');
                            }}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                category === cat
                                    ? "bg-primary text-white"
                                    : "bg-background text-foreground hover:bg-muted border border-border"
                            )}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Converter */}
            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* From */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">From</label>
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(Number(e.target.value))}
                                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-bold"
                            >
                                {currentUnits.map((unit, idx) => (
                                    <option key={idx} value={idx}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter value"
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-2xl font-black text-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    {/* To */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">To</label>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(Number(e.target.value))}
                                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-bold"
                            >
                                {currentUnits.map((unit, idx) => (
                                    <option key={idx} value={idx}>
                                        {unit.name} ({unit.symbol})
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
                                        : "bg-primary text-white hover:bg-primary/90"
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
                        className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

