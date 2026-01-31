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
    toolType?: 'word-counter' | 'character-counter' | 'text-case-converter' | 'remove-line-breaks' | 'reverse-text';
}

export function TextEditor({ input, setInput, copied, onCopy, onDownload, onClear, onAction, keywordDensity, toolType }: TextEditorProps) {
    const t = useTranslations('TextTools');
    
    const showTransformButtons = !toolType || toolType === 'text-case-converter' || toolType === 'word-counter' || toolType === 'character-counter';
    const isReadOnly = toolType === 'remove-line-breaks' || toolType === 'reverse-text';
    const showRemoveAndReverse = !toolType || (toolType !== 'remove-line-breaks' && toolType !== 'reverse-text');

    return (
        <div className="bg-card rounded-2xl sm:rounded-[2.5rem] border-2 border-border shadow-2xl overflow-hidden flex flex-col h-full transition-all">
            <div className="px-3 sm:px-6 py-2 sm:py-2.5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('editor')}</span>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                    <button onClick={onDownload} className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg sm:rounded-xl transition-all touch-manipulation active:scale-95" title={t('download')}>
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button onClick={onCopy} className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all touch-manipulation active:scale-95 ${copied ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10'}`} title={t('copy')}>
                        {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                    <button onClick={onClear} className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg sm:rounded-xl transition-all touch-manipulation active:scale-95" title={t('clear')}>
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            {showTransformButtons && (
                <div className="px-2 sm:px-4 py-1.5 sm:py-2 border-b border-border bg-muted/10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 border-r border-border mr-0.5 sm:mr-1 flex-shrink-0">
                        <Sparkles size={10} className="sm:w-3 sm:h-3 text-amber-500" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Transform:</span>
                    </div>
                    <button onClick={() => onAction('uppercase')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 touch-manipulation active:scale-95 flex-shrink-0">
                        <Type size={10} className="sm:w-3 sm:h-3" /> <span className="hidden sm:inline">UPPERCASE</span><span className="sm:hidden">UPPER</span>
                    </button>
                    <button onClick={() => onAction('lowercase')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 touch-manipulation active:scale-95 flex-shrink-0">
                        <Type size={10} className="sm:w-3 sm:h-3" /> <span className="hidden sm:inline">lowercase</span><span className="sm:hidden">lower</span>
                    </button>
                    <button onClick={() => onAction('title')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 touch-manipulation active:scale-95 flex-shrink-0">
                        <Type size={10} className="sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Title Case</span><span className="sm:hidden">Title</span>
                    </button>
                    <button onClick={() => onAction('sentence')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[10px] sm:text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 touch-manipulation active:scale-95 flex-shrink-0">
                        <Type size={10} className="sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Sentence case</span><span className="sm:hidden">Sentence</span>
                    </button>
                    <div className="w-px h-3 sm:h-4 bg-border mx-0.5 sm:mx-1 flex-shrink-0" />
                    <button onClick={() => onAction('clean-spaces')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap touch-manipulation active:scale-95 flex-shrink-0">
                        <Eraser size={10} className="sm:w-3 sm:h-3 text-emerald-500" /> <span className="hidden sm:inline">Clean Spaces</span><span className="sm:hidden">Clean</span>
                    </button>
                    {showRemoveAndReverse && (
                        <>
                            <button onClick={() => onAction('remove-line-breaks')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-rose-500/50 hover:bg-rose-500/5 text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap touch-manipulation active:scale-95 flex-shrink-0">
                                <MoveVertical size={10} className="sm:w-3 sm:h-3 text-rose-500" /> <span className="hidden sm:inline">No Breaks</span><span className="sm:hidden">Breaks</span>
                            </button>
                            <button onClick={() => onAction('reverse-text')} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-border bg-card hover:border-amber-500/50 hover:bg-amber-500/5 text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap touch-manipulation active:scale-95 flex-shrink-0">
                                <RefreshCw size={10} className="sm:w-3 sm:h-3 text-amber-500" /> <span className="hidden sm:inline">Reverse</span><span className="sm:hidden">Rev</span>
                            </button>
                        </>
                    )}
                </div>
            )}

            <textarea
                className="flex-1 w-full p-4 sm:p-6 text-[15px] sm:text-[17.5px] leading-relaxed resize-none focus:outline-none text-foreground bg-input font-medium placeholder:opacity-30 scrollbar-hide"
                placeholder={t('placeholder')}
                value={input}
                onChange={e => !isReadOnly && setInput(e.target.value)}
                readOnly={isReadOnly}
                spellCheck={false}
            />

            {keywordDensity.length > 0 && (
                <div className="px-3 sm:px-6 py-1.5 sm:py-2 bg-muted/50 border-t border-border flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap flex-shrink-0">{t('topKeywords')}:</span>
                    {keywordDensity.slice(0, 5).map((k, i) => (
                        <span key={i} className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 bg-card border border-border rounded-lg text-foreground shadow-sm whitespace-nowrap flex-shrink-0">
                            {k.word} <span className="text-primary/60">{k.count}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

