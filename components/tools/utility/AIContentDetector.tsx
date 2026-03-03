"use client";
import { useState } from 'react';
import { ScanSearch, Copy, Check, Bot, User, AlertTriangle, Info, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

// Heuristic AI detection (pattern-based)
function detectAI(text: string): { score: number; signals: string[] } {
    const signals: string[] = [];
    let score = 50;
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Avg sentence length
    const avgLen = words.length / Math.max(sentences.length, 1);
    if (avgLen > 20 && avgLen < 30) { score += 10; signals.push('Consistent sentence length (AI-like)'); }

    // Patterned transitions
    const aiPhrases = ['it is worth noting', 'in conclusion', 'furthermore', 'moreover', 'it is important to', 'delve into', 'in today\'s world', 'crucial to understand', 'it\'s crucial', 'as an ai', 'i cannot', 'language model', 'it\'s worth', 'in summary', 'to summarize', 'lastly', 'firstly', 'secondly'];
    const found = aiPhrases.filter(p => text.toLowerCase().includes(p));
    if (found.length > 0) { score += found.length * 8; signals.push(`Common AI phrases detected: "${found.slice(0, 3).join('", "')}"`); }

    // Passive voice ratio
    const passiveMatches = text.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/g) || [];
    if (passiveMatches.length / Math.max(sentences.length, 1) > 0.3) { score += 10; signals.push('High passive voice usage'); }

    // Repetition of words
    const wordFreq: Record<string, number> = {};
    words.forEach(w => { const wl = w.toLowerCase().replace(/[^a-z]/g, ''); if (wl.length > 4) wordFreq[wl] = (wordFreq[wl] || 0) + 1; });
    const repeatedWords = Object.entries(wordFreq).filter(([, c]) => c > 3).map(([w]) => w);
    if (repeatedWords.length > 2) { score += 8; signals.push(`Repetitive word usage: ${repeatedWords.slice(0, 3).join(', ')}`); }

    // Personal anecdotes / first-person = human signal
    const firstPerson = (text.match(/\b(i|me|my|mine|myself|we|our|us)\b/gi) || []).length;
    if (firstPerson > 3) { score -= 15; signals.push('Contains personal pronouns (human signal)'); }

    // Contractions = human signal
    const contractions = (text.match(/\b(don't|can't|won't|isn't|it's|I'm|we're|you're|that's)\b/gi) || []).length;
    if (contractions > 2) { score -= 10; signals.push('Uses contractions (human signal)'); }

    // Exclamations / informal = human signal
    const exclamations = (text.match(/!/g) || []).length;
    if (exclamations > 1) { score -= 8; signals.push('Exclamations / informal tone (human signal)'); }

    return { score: Math.max(5, Math.min(96, score)), signals };
}

export function AIContentDetector() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<{ score: number; signals: string[] } | null>(null);
    const [copied, setCopied] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleDetect = () => {
        if (text.trim().length < 50) return;
        setIsAnalyzing(true);
        setResult(null);
        // Small delay for UX feedback
        setTimeout(() => {
            setResult(detectAI(text));
            setIsAnalyzing(false);
        }, 800);
    };

    const getLabel = (score: number) => {
        if (score >= 75) return { label: 'Likely AI-Generated', color: 'text-red-500', gradFrom: 'from-red-600', gradTo: 'to-red-500', icon: Bot };
        if (score >= 45) return { label: 'Mixed / Uncertain', color: 'text-amber-500', gradFrom: 'from-amber-500', gradTo: 'to-orange-400', icon: AlertTriangle };
        return { label: 'Likely Human-Written', color: 'text-green-500', gradFrom: 'from-green-600', gradTo: 'to-emerald-500', icon: User };
    };

    const cfg = result ? getLabel(result.score) : null;

    const handleCopy = () => {
        if (!result || !cfg) return;
        navigator.clipboard.writeText(`AI Detection Result: ${cfg.label} (${result.score}% AI probability)\nSignals:\n${result.signals.join('\n')}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div />
                <button onClick={handleCopy} disabled={!result} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base disabled:opacity-50">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY REPORT'}
                </button>
            </div>

            {/* Input Area */}
            <div className="bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50 space-y-5">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <ScanSearch className="w-4 h-4" /> Paste Text to Analyze
                    </label>
                    <span className={cn('text-sm font-bold', wordCount >= 50 ? 'text-green-500' : 'text-muted-foreground')}>
                        {wordCount} / 50 words minimum
                    </span>
                </div>
                <textarea
                    value={text}
                    onChange={e => { setText(e.target.value); setResult(null); }}
                    rows={10}
                    className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-sm resize-none"
                    placeholder="Paste your text here (minimum 50 words for accurate analysis)..."
                />
                <button
                    onClick={handleDetect}
                    disabled={wordCount < 10 || isAnalyzing}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isAnalyzing ? (
                        <><Zap className="w-5 h-5 animate-pulse" /> Analyzing Patterns...</>
                    ) : (
                        <><ScanSearch className="w-5 h-5" /> Detect AI Content</>
                    )}
                </button>
            </div>

            {/* Results */}
            {result && cfg && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className={cn('bg-gradient-to-br p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10', cfg.gradFrom, cfg.gradTo)}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="text-center">
                                <div className="text-7xl font-black">{result.score}%</div>
                                <div className="text-white/80 font-bold text-sm mt-1">AI Probability</div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="text-2xl font-black">{cfg.label}</p>
                                <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/90 transition-all duration-1000 rounded-full" style={{ width: `${result.score}%` }} />
                                </div>
                                <p className="text-xs text-white/70 font-medium">0% = Definitely Human — 100% = Definitely AI</p>
                            </div>
                        </div>
                    </div>

                    {result.signals.length > 0 && (
                        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg space-y-4">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Detection Signals Found</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {result.signals.map((s, i) => (
                                    <div key={i} className={cn('flex items-start gap-3 p-3 rounded-xl border text-sm font-medium', s.includes('human') ? 'bg-green-500/5 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400')}>
                                        <span className="font-black mt-0.5 shrink-0">{s.includes('human') ? '✓' : '→'}</span>
                                        <span>{s}</span>
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
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">This tool uses <strong>heuristic signal analysis</strong> (linguistic patterns, phrase detection, writing style). It is not 100% accurate and should be used as a guide. For critical use cases, supplement with multiple AI detection tools.</p>
                </div>
            </div>
        </div>
    );
}
