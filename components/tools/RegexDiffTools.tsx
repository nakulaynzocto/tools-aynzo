"use client";
import { useState } from 'react';
import { Copy, Search } from 'lucide-react';
import { diffLines, diffWords, diffChars } from 'diff';

import { cn } from '@/utils/cn';

interface RegexDiffToolsProps {
    type: string;
}

export default function RegexDiffTools({ type }: RegexDiffToolsProps) {
    // Regex State
    const [regexInput, setRegexInput] = useState('');
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('g');
    const [matches, setMatches] = useState<string[]>([]);

    // Diff State
    const [leftText, setLeftText] = useState('');
    const [rightText, setRightText] = useState('');
    const [diffMode, setDiffMode] = useState<'lines' | 'words' | 'chars'>('lines');
    const [diffResult, setDiffResult] = useState<any[]>([]);

    const testRegex = () => {
        try {
            if (!pattern) return;
            const regex = new RegExp(pattern, flags);
            const found = regexInput.match(regex);
            if (found) {
                // For global tag, match returns array of strings. 
                // For non-global, it returns array with capture groups and properties.
                setMatches(Array.from(found));
            } else {
                setMatches([]);
            }
        } catch (error: any) {
            setMatches([]);
        }
    };

    const compareDiff = () => {
        let result;
        switch (diffMode) {
            case 'lines':
                result = diffLines(leftText, rightText);
                break;
            case 'words':
                result = diffWords(leftText, rightText);
                break;
            case 'chars':
                result = diffChars(leftText, rightText);
                break;
        }
        setDiffResult(result);
    };

    if (type === 'regex-tester') {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 space-y-2">
                                <label className="block text-sm font-bold text-foreground uppercase tracking-wider">Regex Pattern</label>
                                <div className="flex bg-input border-2 border-border rounded-xl overflow-hidden focus-within:border-accent transition-colors">
                                    <span className="px-4 py-3 bg-muted text-muted-foreground border-r-2 border-border font-mono">/</span>
                                    <input
                                        type="text"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        placeholder="Pattern (e.g. [a-z]+)"
                                        className="flex-1 p-3 bg-transparent outline-none font-mono text-foreground text-lg"
                                    />
                                    <span className="px-4 py-3 bg-muted text-muted-foreground border-l-2 border-border font-mono">/</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-foreground uppercase tracking-wider">Flags</label>
                                <input
                                    type="text"
                                    value={flags}
                                    onChange={(e) => setFlags(e.target.value)}
                                    placeholder="g, i, m..."
                                    className="w-full p-4 border-2 border-border rounded-xl bg-input font-mono text-foreground text-lg outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-foreground uppercase tracking-wider">Test String</label>
                            <textarea
                                value={regexInput}
                                onChange={(e) => setRegexInput(e.target.value)}
                                placeholder="Enter text to test against..."
                                rows={6}
                                className="w-full p-4 border-2 border-border rounded-xl bg-input font-mono text-sm text-foreground outline-none focus:border-accent resize-none"
                            />
                        </div>

                        <button
                            onClick={testRegex}
                            className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10"
                        >
                            <Search className="h-5 w-5" />
                            Run Regex Test
                        </button>
                    </div>
                </div>

                {matches.length > 0 && (
                    <div className="bg-card p-8 rounded-3xl border-2 border-border shadow-xl space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-foreground">Matches Found ({matches.length})</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {matches.map((match, i) => (
                                <div key={i} className="px-4 py-3 bg-green-500/10 text-green-500 border-2 border-green-500/20 rounded-xl font-mono text-sm text-center font-bold break-all">
                                    {match}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default: Diff Checker
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex p-1.5 bg-muted rounded-2xl border-2 border-border gap-2 w-fit">
                            {(['lines', 'words', 'chars'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setDiffMode(mode)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
                                        diffMode === mode
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'text-muted-foreground hover:bg-card/50'
                                    )}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={compareDiff}
                            disabled={!leftText || !rightText}
                            className="px-10 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10"
                        >
                            <Copy size={18} /> Compare Now
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">Original Text</label>
                            <textarea
                                value={leftText}
                                onChange={(e) => setLeftText(e.target.value)}
                                placeholder="Paste original text here..."
                                rows={12}
                                className="w-full p-6 border-2 border-border rounded-2xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground">Modified Text</label>
                            <textarea
                                value={rightText}
                                onChange={(e) => setRightText(e.target.value)}
                                placeholder="Paste modified text here..."
                                rows={12}
                                className="w-full p-6 border-2 border-border rounded-2xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground resize-none"
                            />
                        </div>
                    </div>

                    {diffResult.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-border space-y-4 animate-in slide-in-from-bottom-5 duration-500">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                Comparison Result ({diffMode} mode)
                            </h3>
                            <div className="p-8 bg-muted/30 border-2 border-border rounded-3xl font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                {diffResult.map((part, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            "transition-colors",
                                            part.added
                                                ? 'bg-green-500/20 text-green-400 p-0.5 rounded'
                                                : part.removed
                                                    ? 'bg-red-500/20 text-red-400 line-through decoration-red-500 p-0.5 rounded'
                                                    : 'text-foreground opacity-90'
                                        )}
                                    >
                                        {part.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
