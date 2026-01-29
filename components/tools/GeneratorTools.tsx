"use client";
import { useState } from 'react';
import { Copy, RefreshCw, Hash, Type, Palette, Calendar, Globe, Settings, CheckCircle2 } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';


interface GeneratorToolsProps {
    type: string;
}

export default function GeneratorTools({ type }: GeneratorToolsProps) {
    const [output, setOutput] = useState<string[]>([]);
    const [count, setCount] = useState(1);
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [length, setLength] = useState(16);
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);

    const generate = () => {
        const results: string[] = [];

        for (let i = 0; i < count; i++) {
            switch (type) {
                case 'random-number':
                    results.push(generateRandomNumber(min, max));
                    break;

                case 'random-string':
                    results.push(generateRandomString(length, includeLetters, includeNumbers, includeSymbols));
                    break;

                case 'random-color':
                    results.push(generateRandomColor());
                    break;

                case 'random-date':
                    results.push(generateRandomDate());
                    break;

                case 'random-ip':
                    results.push(generateRandomIP());
                    break;
            }
        }

        setOutput(results);
    };

    const generateRandomNumber = (min: number, max: number): string => {
        return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    };

    const generateRandomString = (length: number, letters: boolean, numbers: boolean, symbols: boolean): string => {
        let charset = '';
        if (letters) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        if (numbers) charset += '0123456789';
        if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    };

    const generateRandomColor = (): string => {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${hex.toUpperCase()} | RGB(${r}, ${g}, ${b})`;
    };

    const generateRandomDate = (): string => {
        const start = new Date(2000, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().split('T')[0];
    };

    const generateRandomIP = (): string => {
        const octet = () => Math.floor(Math.random() * 256);
        return `${octet()}.${octet()}.${octet()}.${octet()}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Toast removed, inline feedback handled in render loop via local state is complex here for list, 
        // but let's at least support the single copy flow if used elsewhere or generic handler.
        // Actually, this component maps over output. we need index-based state?
        // Let's implement index-based feedback like YoutubeTools.
    };

    const copyAllToClipboard = () => {
        navigator.clipboard.writeText(output.join('\n'));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const getToolName = () => {
        const names: { [key: string]: string } = {
            'random-number': 'Random Number Generator',
            'random-string': 'Random String Generator',
            'random-color': 'Random Color Generator',
            'random-date': 'Random Date Generator',
            'random-ip': 'Random IP Address',
        };
        return names[type] || 'Random Generator';
    };

    // Navigation Tools Configuration
    const generatorNavTools = [
        {
            category: 'Data',
            tools: [
                { id: 'random-number', label: 'Number', icon: Hash },
                { id: 'random-string', label: 'String', icon: Type },
                { id: 'random-date', label: 'Date', icon: Calendar },
            ]
        },
        {
            category: 'Tech',
            tools: [
                { id: 'random-color', label: 'Color', icon: Palette },
                { id: 'random-ip', label: 'IP', icon: Globe },
            ]
        }
    ];

    const isGeneratorTool = generatorNavTools.some(cat => cat.tools.some(t => t.id === type));

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Generator Tools Navigation */}
            {isGeneratorTool && (
                <ScrollableNav items={generatorNavTools} activeToolId={type} />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8 space-y-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Left Column: Configuration */}
                        <div className="space-y-8">
                            <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Settings size={120} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Settings size={14} /> Configuration
                                </h3>

                                <div className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                Number of Items
                                            </label>
                                            <input
                                                type="number"
                                                value={count}
                                                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                                min="1"
                                                max="100"
                                                className="w-full p-4 border-2 border-border rounded-xl focus:border-accent focus:outline-none bg-input text-foreground font-bold"
                                            />
                                        </div>

                                        {type === 'random-number' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                        Min
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={min}
                                                        onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                                                        className="w-full p-3 border-2 border-border rounded-lg focus:border-accent focus:outline-none bg-input text-foreground font-bold text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                        Max
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={max}
                                                        onChange={(e) => setMax(parseInt(e.target.value) || 100)}
                                                        className="w-full p-3 border-2 border-border rounded-lg focus:border-accent focus:outline-none bg-input text-foreground font-bold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {type === 'random-string' && (
                                            <div className="space-y-2">
                                                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                    String Length
                                                </label>
                                                <input
                                                    type="number"
                                                    value={length}
                                                    onChange={(e) => setLength(Math.max(1, Math.min(256, parseInt(e.target.value) || 16)))}
                                                    className="w-full p-4 border-2 border-border rounded-xl focus:border-accent focus:outline-none bg-input text-foreground font-bold"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {type === 'random-string' && (
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { id: 'letters', label: 'Letters', checked: includeLetters, onChange: setIncludeLetters },
                                                { id: 'numbers', label: 'Numbers', checked: includeNumbers, onChange: setIncludeNumbers },
                                                { id: 'symbols', label: 'Symbols', checked: includeSymbols, onChange: setIncludeSymbols },
                                            ].map(opt => (
                                                <label key={opt.id} className={cn(
                                                    "flex items-center gap-2 px-4 py-2 border-2 rounded-xl cursor-pointer transition-all text-[10px] font-black uppercase tracking-widest",
                                                    opt.checked ? "bg-primary/5 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:border-border/80"
                                                )}>
                                                    <input type="checkbox" checked={opt.checked} onChange={e => opt.onChange(e.target.checked)} className="hidden" />
                                                    <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center", opt.checked ? "bg-primary border-primary" : "border-border")}>
                                                        {opt.checked && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={generate}
                                        className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10"
                                    >
                                        <RefreshCw className="h-6 w-6" />
                                        GENERATE DATA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Generated Results */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Output</h3>
                                {output.length > 0 && (
                                    <button
                                        onClick={copyAllToClipboard}
                                        className={cn(
                                            "px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all",
                                            copiedAll ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'
                                        )}
                                    >
                                        {copiedAll ? <RefreshCw className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        {copiedAll ? 'COPIED ALL' : 'COPY ALL'}
                                    </button>
                                )}
                            </div>

                            <div className="w-full p-2 bg-muted/30 border-2 border-border rounded-3xl min-h-[400px] flex flex-col shadow-inner">
                                {output.length > 0 ? (
                                    <div className="p-4 grid gap-3 overflow-y-auto max-h-[500px] custom-scrollbar">
                                        {output.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-card border-2 border-border rounded-2xl group hover:border-accent transition-all animate-in zoom-in-95 duration-200 shadow-sm"
                                            >
                                                <span className="font-mono text-base font-bold text-foreground flex-1 break-all">{item}</span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(item);
                                                        setCopiedIndex(index);
                                                        setTimeout(() => setCopiedIndex(null), 2000);
                                                    }}
                                                    className={cn(
                                                        "ml-4 p-2.5 border-2 rounded-xl transition-all",
                                                        copiedIndex === index ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-muted border-border text-muted-foreground hover:text-primary hover:border-primary/30'
                                                    )}
                                                >
                                                    {copiedIndex === index ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                                        <RefreshCw className="w-12 h-12 animate-spin-slow opacity-10" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Generation</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
