"use client";
import { useState } from 'react';
import { SpellCheck, Copy, Check, RefreshCw, XCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface GrammarIssue {
    original: string;
    suggestion: string;
    reason: string;
    index: number;
}

const rules: Array<{ pattern: RegExp; suggestion: (m: RegExpMatchArray) => string; reason: string }> = [
    { pattern: /\bi am\b/gi, suggestion: () => "I am", reason: "Capitalize 'I'" },
    { pattern: /\bshould of\b/gi, suggestion: () => "should have", reason: "Common mistake: 'of' vs 'have'" },
    { pattern: /\bcould of\b/gi, suggestion: () => "could have", reason: "Common mistake: 'of' vs 'have'" },
    { pattern: /\bwould of\b/gi, suggestion: () => "would have", reason: "Common mistake: 'of' vs 'have'" },
    { pattern: /\btheir is\b/gi, suggestion: () => "there is", reason: "'their' is possessive; use 'there' for location" },
    { pattern: /\byour welcome\b/gi, suggestion: () => "you're welcome", reason: "Use 'you're' (you are), not 'your' (possessive)" },
    { pattern: /\bits a\b/gi, suggestion: () => "it's a", reason: "'its' is possessive; use 'it's' for 'it is'" },
    { pattern: /\ba an\b/gi, suggestion: () => "an", reason: "Remove duplicate article" },
    { pattern: /\bthe the\b/gi, suggestion: () => "the", reason: "Remove duplicate word" },
    { pattern: /\bfurthermore ,\b/gi, suggestion: () => "furthermore,", reason: "No space before comma" },
    { pattern: /\b(however|therefore|moreover|furthermore) ([a-z])/g, suggestion: (m) => `${m[1]}, ${m[2]}`, reason: "Conjunctive adverb needs comma" },
    { pattern: /\balot\b/gi, suggestion: () => "a lot", reason: "'alot' is not a word; use 'a lot'" },
    { pattern: /\bwont\b/gi, suggestion: () => "won't", reason: "Missing apostrophe in contraction" },
    { pattern: /\bdont\b/gi, suggestion: () => "don't", reason: "Missing apostrophe in contraction" },
    { pattern: /\bcant\b/gi, suggestion: () => "can't", reason: "Missing apostrophe in contraction" },
    { pattern: /\bdefinately\b/gi, suggestion: () => "definitely", reason: "Common misspelling" },
    { pattern: /\brecieve\b/gi, suggestion: () => "receive", reason: "Common misspelling (i before e)" },
    { pattern: /\bseperate\b/gi, suggestion: () => "separate", reason: "Common misspelling" },
    { pattern: /\boccured\b/gi, suggestion: () => "occurred", reason: "Common misspelling (double r)" },
    { pattern: /\baccommodate\b/gi, suggestion: () => "accommodate", reason: "Verify spelling" },
    { pattern: /\buntill\b/gi, suggestion: () => "until", reason: "Common misspelling" },
    { pattern: /\bsuprise\b/gi, suggestion: () => "surprise", reason: "Common misspelling" },
];

export function GrammarChecker() {
    const [text, setText] = useState('');
    const [issues, setIssues] = useState<GrammarIssue[]>([]);
    const [checked, setChecked] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCheck = () => {
        const foundIssues: GrammarIssue[] = [];
        for (const { pattern, suggestion, reason } of rules) {
            let match: RegExpMatchArray | null;
            const re = new RegExp(pattern.source, pattern.flags);
            while ((match = re.exec(text)) !== null) {
                foundIssues.push({ original: match[0], suggestion: suggestion(match), reason, index: match.index! });
            }
        }
        foundIssues.sort((a, b) => a.index - b.index);
        setIssues(foundIssues);
        setChecked(true);
    };

    const fixAll = () => {
        let fixed = text;
        for (const { pattern, suggestion } of [...rules].reverse()) {
            fixed = fixed.replace(pattern, (...args) => suggestion(args as RegExpMatchArray));
        }
        setText(fixed);
        setChecked(false);
        setIssues([]);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><SpellCheck className="w-8 h-8 text-primary" /></div>
                        GRAMMAR CHECKER
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Check and fix grammar, spelling, and punctuation errors in your text.</p>
                </div>
                <div className="flex items-center gap-3">
                    {checked && issues.length > 0 && (
                        <button onClick={fixAll} className="flex items-center gap-2.5 px-5 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg">
                            <RefreshCw className="w-4 h-4" /> Fix All Issues
                        </button>
                    )}
                    <button onClick={handleCopy} disabled={!text} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base disabled:opacity-50">
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                        {copied ? 'COPIED!' : 'COPY TEXT'}
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            {text && (
                <div className="flex items-center gap-6 px-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Words:</span>
                        <span className="font-black text-foreground">{wordCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Characters:</span>
                        <span className="font-black text-foreground">{charCount}</span>
                    </div>
                    {checked && (
                        <div className={cn('flex items-center gap-2 px-3 py-1 rounded-xl border font-bold text-sm', issues.length > 0 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500')}>
                            {issues.length > 0 ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {issues.length} issue{issues.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}

            {/* Text Area */}
            <div className="bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50 space-y-5">
                <label className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <SpellCheck className="w-4 h-4" /> Your Text
                </label>
                <textarea
                    value={text}
                    onChange={e => { setText(e.target.value); setChecked(false); setIssues([]); }}
                    rows={12}
                    className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-sm resize-none"
                    placeholder="Paste or type your text here to check for grammar and spelling errors..."
                />
                <button
                    onClick={handleCheck}
                    disabled={text.trim().length < 5}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    <SpellCheck className="w-5 h-5" /> Check Grammar
                </button>
            </div>

            {/* Results */}
            {checked && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    {issues.length === 0 ? (
                        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-[2.5rem] p-10 text-center text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                            <div className="relative z-10 space-y-3">
                                <CheckCircle className="w-16 h-16 mx-auto text-white/90" />
                                <p className="text-3xl font-black">No Issues Found!</p>
                                <p className="text-white/80 font-medium">Your text looks great. No grammar errors detected.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{issues.length} Issues Found</p>
                                <button onClick={fixAll} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all">
                                    <RefreshCw className="w-3.5 h-3.5" /> Fix All
                                </button>
                            </div>
                            <div className="space-y-3">
                                {issues.map((issue, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-muted/20 rounded-2xl border-2 border-border hover:border-red-500/30 transition-all">
                                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <code className="text-red-500 font-bold text-sm bg-red-500/10 px-2 py-0.5 rounded-lg line-through">{issue.original}</code>
                                                <span className="text-muted-foreground text-sm font-bold">→</span>
                                                <code className="text-green-500 font-bold text-sm bg-green-500/10 px-2 py-0.5 rounded-lg">{issue.suggestion}</code>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium">{issue.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">About This Tool</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">This tool uses <strong>rule-based pattern matching</strong> to detect common grammar and spelling errors — entirely in your browser with no API calls. It catches frequent mistakes but is not a replacement for full grammar software like Grammarly.</p>
                </div>
            </div>
        </div>
    );
}
