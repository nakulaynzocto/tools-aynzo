"use client";
import { useState, useEffect } from 'react';
import { Copy, RotateCcw } from 'lucide-react';


interface ConverterToolsProps {
    type: string;
}

export default function ConverterTools({ type }: ConverterToolsProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
    const [loadingRates, setLoadingRates] = useState(false);

    useEffect(() => {
        if (type === 'currency-converter' && !rates) {
            setLoadingRates(true);
            fetch('https://open.er-api.com/v1/latest/USD')
                .then(res => res.json())
                .then(data => {
                    if (data && data.rates) {
                        setRates(data.rates);
                    }
                })
                .catch(err => console.error('Failed to fetch live exchange rates'))
                .finally(() => setLoadingRates(false));
        }
    }, [type, rates]);

    useEffect(() => {
        if (!input || ((type === 'unit-converter' || type === 'currency-converter') && (!fromUnit || !toUnit))) {
            setOutput('');
            return;
        }

        let result = '';
        try {
            switch (type) {
                case 'unit-converter':
                    result = convertUnit(parseFloat(input), fromUnit, toUnit);
                    break;
                case 'color-converter':
                    result = convertColor(input);
                    break;
                case 'binary-to-text':
                    result = binaryToText(input);
                    break;
                case 'hex-to-decimal':
                    result = parseInt(input.replace('0x', ''), 16).toString();
                    break;
                case 'currency-converter':
                    result = convertCurrency(parseFloat(input), fromUnit, toUnit);
                    break;
                case 'roman-numeral':
                    if (/^[IVXLCDM]+$/i.test(input)) {
                        result = romanToDecimal(input.toUpperCase()).toString();
                    } else {
                        result = decimalToRoman(parseInt(input));
                    }
                    break;
                default:
                    result = input;
            }
            setOutput(result);
        } catch (error: any) {
            setOutput('');
        }
    }, [input, type, fromUnit, toUnit, rates]);

    const convert = () => {
        // Function kept for reference, logic moved to useEffect
    };

    const convertUnit = (value: number, from: string, to: string): string => {
        const conversions: { [key: string]: number } = {
            // Length (to meters)
            'm': 1,
            'km': 1000,
            'cm': 0.01,
            'mm': 0.001,
            'mi': 1609.34,
            'yd': 0.9144,
            'ft': 0.3048,
            'in': 0.0254,
            // Weight (to grams)
            'g': 1,
            'kg': 1000,
            'mg': 0.001,
            'lb': 453.592,
            'oz': 28.3495,
            // Temperature
            'c': 0, 'f': 0, 'k': 0,
        };

        // Temperature conversion
        if (from === 'c' && to === 'f') return ((value * 9 / 5) + 32).toString();
        if (from === 'f' && to === 'c') return ((value - 32) * 5 / 9).toString();
        if (from === 'c' && to === 'k') return (value + 273.15).toString();
        if (from === 'k' && to === 'c') return (value - 273.15).toString();
        if (from === 'f' && to === 'k') return (((value - 32) * 5 / 9) + 273.15).toString();
        if (from === 'k' && to === 'f') return (((value - 273.15) * 9 / 5) + 32).toString();

        // Unit conversion
        const baseValue = value * conversions[from];
        const result = baseValue / conversions[to];
        return result.toFixed(4);
    };

    const convertCurrency = (value: number, from: string, to: string): string => {
        if (!rates) return 'Rates not loaded';

        // Convert to base (USD) then to target
        // rate table is based on USD (e.g. USD: 1, EUR: 0.92)
        // val / rate[from] gives USD
        // USD * rate[to] gives target

        const fromRate = rates[from];
        const toRate = rates[to];

        if (!fromRate || !toRate) return 'Invalid Currency';

        const baseValue = value / fromRate;
        const result = baseValue * toRate;

        return result.toFixed(2) + ` ${to}`;
    };

    const convertColor = (input: string): string => {
        const hex = input.trim();

        // HEX to RGB
        if (hex.startsWith('#')) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);

            // To HSL
            const rNorm = r / 255;
            const gNorm = g / 255;
            const bNorm = b / 255;
            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            let h = 0, s = 0, l = (max + min) / 2;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
                    case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
                    case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
                }
            }

            return `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        }

        // RGB to HEX
        const rgbMatch = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            return convertColor(hex);
        }

        return 'Invalid color format';
    };

    const binaryToText = (binary: string): string => {
        const bytes = binary.replace(/\s/g, '').match(/.{1,8}/g) || [];
        return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
    };

    const romanToDecimal = (roman: string): number => {
        const romanMap: { [key: string]: number } = {
            I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
        };
        let result = 0;
        for (let i = 0; i < roman.length; i++) {
            const current = romanMap[roman[i]];
            const next = romanMap[roman[i + 1]];
            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        return result;
    };

    const decimalToRoman = (num: number): string => {
        const romanNumerals: [number, string][] = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
        ];
        let result = '';
        for (const [value, numeral] of romanNumerals) {
            while (num >= value) {
                result += numeral;
                num -= value;
            }
        }
        return result;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
    };

    const getToolName = () => {
        const names: { [key: string]: string } = {
            'unit-converter': 'Unit Converter',
            'color-converter': 'Color Code Converter',
            'binary-to-text': 'Binary to Text',
            'hex-to-decimal': 'Hex to Decimal',
            'roman-numeral': 'Roman Numeral Converter',
            'currency-converter': 'Currency Converter',
        };
        return names[type] || 'Converter';
    };

    const renderUnitOptions = () => {
        if (type !== 'unit-converter') return null;

        const unitCategories = {
            Length: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
            Weight: ['g', 'kg', 'mg', 'lb', 'oz'],
            Temperature: ['c', 'f', 'k'],
        };

        return (
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">From</label>
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full p-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-input text-foreground"
                    >
                        <option value="">Select unit</option>
                        {Object.entries(unitCategories).map(([category, units]) => (
                            <optgroup key={category} label={category}>
                                {units.map(unit => (
                                    <option key={unit} value={unit}>{unit.toUpperCase()}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">To</label>
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full p-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-input text-foreground"
                    >
                        <option value="">Select unit</option>
                        {Object.entries(unitCategories).map(([category, units]) => (
                            <optgroup key={category} label={category}>
                                {units.map(unit => (
                                    <option key={unit} value={unit}>{unit.toUpperCase()}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    const renderCurrencyOptions = () => {
        if (type !== 'currency-converter') return null;

        const currencies = rates ? Object.keys(rates).sort() : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CNY'];

        return (
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">From Currency</label>
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full p-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-input text-foreground"
                    >
                        <option value="">Select Currency</option>
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">To Currency</label>
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full p-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-input text-foreground"
                    >
                        <option value="">Select Currency</option>
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                {rates && (
                    <div className="col-span-2 text-xs text-muted-foreground text-center">
                        Live rates via open.er-api.com
                    </div>
                )}
            </div>
        );
    };

    const getPlaceholder = () => {
        const placeholders: { [key: string]: string } = {
            'unit-converter': '100',
            'color-converter': '#FF5733 or rgb(255, 87, 51)',
            'binary-to-text': '01001000 01100101 01101100 01101100 01101111',
            'hex-to-decimal': '0xFF or FF',
            'roman-numeral': 'MCMXCIV or 1994',
            'currency-converter': 'Amount (e.g. 100)',
        };
        return placeholders[type] || 'Enter value to convert...';
    };
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8 space-y-8">
                    <div className="space-y-6">
                        {renderUnitOptions()}
                        {renderCurrencyOptions()}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-foreground">
                            Input Value
                        </label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="w-full p-4 border-2 border-border rounded-xl focus:border-accent focus:outline-none font-mono text-lg bg-input text-foreground"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={clearAll}
                            className="px-8 py-4 bg-muted text-foreground border-2 border-border rounded-xl font-bold hover:bg-card transition-all flex items-center gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    {output && (
                        <div className="mt-8 pt-8 border-t border-border space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Result
                                </label>
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-bold hover:bg-primary/20 transition-all flex items-center gap-2 text-xs"
                                >
                                    <Copy className="h-3 w-3" />
                                    Copy Result
                                </button>
                            </div>
                            <div className="w-full p-6 bg-muted rounded-2xl border-2 border-border font-mono text-xl whitespace-pre-wrap text-foreground">
                                {output}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
