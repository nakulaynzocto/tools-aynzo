"use client";
import { Copy, Check, Trash2, Download, Type, MoveVertical, Eraser, Sparkles, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { KeywordDensity } from '@/components/types/text/types';

interface TextEditorProps {
    input: string;
    setInput: (value: string) => void;
    copied: boolean;
    onCopy: () => void;
    onDownload: () => void;
    onClear: () => void;
    onAction: (action: string) => void;
    keywordDensity: KeywordDensity[];
}

export function TextEditor({ input, setInput, copied, onCopy, onDownload, onClear, onAction, keywordDensity }: TextEditorProps) {
    const t = useTranslations('TextTools');

    return (
        <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-2xl overflow-hidden flex flex-col h-full transition-all">
            <div className="px-6 py-2.5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('editor')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onDownload} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title={t('download')}>
                        <Download className="w-4 h-4" />
                    </button>
                    <button onClick={onCopy} className={`p-2 rounded-xl transition-all ${copied ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10'}`} title={t('copy')}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={onClear} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all" title={t('clear')}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="px-4 py-2 border-b border-border bg-muted/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 px-2 border-r border-border mr-1">
                    <Sparkles size={12} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Transform:</span>
                </div>
                <button onClick={() => onAction('uppercase')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5">
                    <Type size={12} /> UPPERCASE
                </button>
                <button onClick={() => onAction('lowercase')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5">
                    <Type size={12} /> lowercase
                </button>
                <button onClick={() => onAction('title')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5">
                    <Type size={12} /> Title Case
                </button>
                <button onClick={() => onAction('sentence')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5">
                    <Type size={12} /> Sentence case
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button onClick={() => onAction('clean-spaces')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap">
                    <Eraser size={12} className="text-emerald-500" /> Clean Spaces
                </button>
                <button onClick={() => onAction('remove-line-breaks')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-rose-500/50 hover:bg-rose-500/5 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap">
                    <MoveVertical size={12} className="text-rose-500" /> No Breaks
                </button>
                <button onClick={() => onAction('reverse-text')} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-amber-500/50 hover:bg-amber-500/5 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap">
                    <RefreshCw size={12} className="text-amber-500" /> Reverse
                </button>
            </div>

            <textarea
                className="flex-1 w-full p-6 text-[17.5px] leading-relaxed resize-none focus:outline-none text-foreground bg-input font-medium placeholder:opacity-30 scrollbar-hide"
                placeholder={t('placeholder')}
                value={input}
                onChange={e => setInput(e.target.value)}
                spellCheck={false}
            />

            {keywordDensity.length > 0 && (
                <div className="px-6 py-2 bg-muted/50 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">{t('topKeywords')}:</span>
                    {keywordDensity.slice(0, 5).map((k, i) => (
                        <span key={i} className="text-[11px] font-bold px-3 py-1 bg-card border border-border rounded-lg text-foreground shadow-sm whitespace-nowrap">
                            {k.word} <span className="text-primary/60">{k.count}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

