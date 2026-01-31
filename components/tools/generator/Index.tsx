"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, Download, RefreshCw, Hash, Type, Palette, Calendar, Network, Sparkles } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { GeneratorToolProps } from '@/components/types/generator/types';
import { generateRandomNumber, generateRandomString, generateColor, generateUUID } from '@/components/utils/generator/generatorProcessing';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

export default function GeneratorToolsIndex({ type }: GeneratorToolProps) {
    const t = useTranslations('Common');
    const tActions = useTranslations('ToolActions');
    
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Random Number
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [count, setCount] = useState(1);
    
    // Random String
    const [length, setLength] = useState(16);
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    
    // Random Color
    const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
    
    // Random Date
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Random IP
    const [ipCount, setIpCount] = useState(1);

    const generatorNavTools = [
        {
            category: 'RANDOM',
            tools: [
                { id: 'random-number', label: 'Random Number Generator', icon: Hash },
                { id: 'random-string', label: 'Random String Generator', icon: Type },
                { id: 'random-color', label: 'Random Color Generator', icon: Palette },
                { id: 'random-date', label: 'Random Date Generator', icon: Calendar },
                { id: 'random-ip', label: 'Random IP Generator', icon: Network },
            ]
        }
    ];

    const generateRandomNumbers = () => {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(generateRandomNumber(min, max));
        }
        setOutput(results.join('\n'));
    };

    const generateRandomStrings = () => {
        const result = generateRandomString(length, includeLetters, includeNumbers, includeSymbols);
        setOutput(result);
    };

    const generateRandomColors = () => {
        const hex = generateColor();
        if (colorFormat === 'hex') {
            setOutput(hex);
        } else if (colorFormat === 'rgb') {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            setOutput(`rgb(${r}, ${g}, ${b})`);
        } else {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }
            setOutput(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
        }
    };

    const generateRandomDates = () => {
        const start = startDate ? new Date(startDate).getTime() : new Date('2000-01-01').getTime();
        const end = endDate ? new Date(endDate).getTime() : Date.now();
        const randomTime = start + Math.random() * (end - start);
        const date = new Date(randomTime);
        setOutput(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    };

    const generateRandomIPs = () => {
        const ips = [];
        for (let i = 0; i < ipCount; i++) {
            const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            ips.push(ip);
        }
        setOutput(ips.join('\n'));
    };

    const handleGenerate = () => {
        switch (type) {
            case 'random-number':
                generateRandomNumbers();
                break;
            case 'random-string':
                generateRandomStrings();
                break;
            case 'random-color':
                generateRandomColors();
                break;
            case 'random-date':
                generateRandomDates();
                break;
            case 'random-ip':
                generateRandomIPs();
                break;
        }
    };

    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (output) {
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const renderTool = () => {
        switch (type) {
            case 'random-number':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">Min Value</label>
                                <input
                                    type="number"
                                    value={min}
                                    onChange={(e) => setMin(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">Max Value</label>
                                <input
                                    type="number"
                                    value={max}
                                    onChange={(e) => setMax(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">Count</label>
                                <input
                                    type="number"
                                    value={count}
                                    onChange={(e) => setCount(Number(e.target.value))}
                                    min={1}
                                    max={100}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Generate Random Numbers
                        </button>
                    </div>
                );
            
            case 'random-string':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-2">Length</label>
                            <input
                                type="number"
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                min={1}
                                max={1000}
                                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-foreground block">Include</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeLetters}
                                        onChange={(e) => setIncludeLetters(e.target.checked)}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm font-medium">Letters</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeNumbers}
                                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm font-medium">Numbers</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeSymbols}
                                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm font-medium">Symbols</span>
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Generate Random String
                        </button>
                    </div>
                );
            
            case 'random-color':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-2">Color Format</label>
                            <div className="flex gap-2">
                                {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                                    <button
                                        key={format}
                                        onClick={() => setColorFormat(format)}
                                        className={cn(
                                            "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all",
                                            colorFormat === format
                                                ? "bg-primary text-white"
                                                : "bg-muted text-foreground hover:bg-muted/80"
                                        )}
                                    >
                                        {format.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Generate Random Color
                        </button>
                        {output && (
                            <div className="w-full h-32 rounded-xl border-2 border-border" style={{ backgroundColor: output.includes('rgb') || output.includes('hsl') ? output : output }} />
                        )}
                    </div>
                );
            
            case 'random-date':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground block mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Generate Random Date
                        </button>
                    </div>
                );
            
            case 'random-ip':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-foreground block mb-2">Count</label>
                            <input
                                type="number"
                                value={ipCount}
                                onChange={(e) => setIpCount(Number(e.target.value))}
                                min={1}
                                max={100}
                                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Generate Random IPs
                        </button>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <ScrollableNav items={generatorNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-6">
                    {renderTool()}
                    
                    {output && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold">Output</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className={cn(
                                            "p-2 rounded-lg transition-all",
                                            copied ? "bg-emerald-500 text-white" : "bg-muted hover:bg-primary hover:text-primary-foreground"
                                        )}
                                    >
                                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={output}
                                readOnly
                                className="w-full h-32 p-4 font-mono text-sm border-2 border-border rounded-xl bg-muted/30 resize-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
