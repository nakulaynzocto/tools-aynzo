"use client";
import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';


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

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8 space-y-8">
                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-foreground uppercase tracking-wider">
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
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Minimum Value
                                    </label>
                                    <input
                                        type="number"
                                        value={min}
                                        onChange={(e) => setMin(parseInt(e.target.value) || 1)}
                                        className="w-full p-3 border-2 border-border rounded-lg focus:border-accent focus:outline-none bg-input text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Maximum Value
                                    </label>
                                    <input
                                        type="number"
                                        value={max}
                                        onChange={(e) => setMax(parseInt(e.target.value) || 100)}
                                        className="w-full p-3 border-2 border-border rounded-lg focus:border-accent focus:outline-none bg-input text-foreground"
                                    />
                                </div>
                            </>
                        )}

                        {type === 'random-string' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        String Length
                                    </label>
                                    <input
                                        type="number"
                                        value={length}
                                        onChange={(e) => setLength(Math.max(1, Math.min(256, parseInt(e.target.value) || 16)))}
                                        min="1"
                                        max="256"
                                        className="w-full p-3 border-2 border-border rounded-lg focus:border-accent focus:outline-none bg-input text-foreground"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {type === 'random-string' && (
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeLetters}
                                    onChange={(e) => setIncludeLetters(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-foreground">Include Letters</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeNumbers}
                                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-foreground">Include Numbers</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeSymbols}
                                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-foreground">Include Symbols</span>
                            </label>
                        </div>
                    )}

                    {/* Generate Button Tag */}
                    <div className="pt-4">
                        <button
                            onClick={generate}
                            className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10"
                        >
                            <RefreshCw className="h-5 w-5" />
                            Generate Data
                        </button>
                    </div>

                    {output.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-border space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Generated Results ({output.length})
                                </label>
                                <button
                                    onClick={copyAllToClipboard}
                                    className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/20 transition-all flex items-center gap-2 text-sm"
                                >
                                    {copiedAll ? <RefreshCw className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copiedAll ? 'Copied All' : 'Copy All'}
                                </button>
                            </div>
                            <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {output.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-2xl group hover:border-accent transition-all animate-in zoom-in-95 duration-200"
                                    >
                                        <span className="font-mono text-lg font-bold text-foreground flex-1 break-all">{item}</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(item);
                                                setCopiedIndex(index);
                                                setTimeout(() => setCopiedIndex(null), 2000);
                                            }}
                                            className={`ml-4 p-3 border rounded-xl transition-all shadow-sm ${copiedIndex === index ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-card border-border text-primary hover:bg-primary hover:text-white'}`}
                                        >
                                            {copiedIndex === index ? <RefreshCw className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
