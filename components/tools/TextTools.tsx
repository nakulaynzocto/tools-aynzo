"use client";
import { useState, useEffect } from 'react';
import { Copy, Check, FileText, Hash, AlignLeft, Trash2, Download, Clock, Search, Type, MoveVertical, Eraser, Sparkles, RefreshCw, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollableNav } from '@/components/ScrollableNav';


interface TextToolProps {
  type: 'word-counter' | 'character-counter' | 'text-case-converter' | 'remove-line-breaks' | 'reverse-text';
}

export default function TextTools({ type }: TextToolProps) {
  const textNavTools = [
    {
      category: 'Analysis',
      tools: [
        { id: 'word-counter', label: 'Word Count', icon: FileText },
        { id: 'character-counter', label: 'Char Count', icon: Hash },
      ]
    },
    {
      category: 'Manipulation',
      tools: [
        { id: 'text-case-converter', label: 'Case Converter', icon: Type },
        { id: 'remove-line-breaks', label: 'Line Breaks', icon: MoveVertical },
        { id: 'reverse-text', label: 'Reverse Text', icon: RefreshCw },
      ]
    }
  ];

  const t = useTranslations('TextTools');
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, lines: 0, readingTime: 0 });
  const [copied, setCopied] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [keywordDensity, setKeywordDensity] = useState<Array<{ word: string, count: number, percentage: number }>>([]);
  const [showKeywordDensity, setShowKeywordDensity] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  useEffect(() => {
    const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = input.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const lines = input.split(/\n/).length;
    const readingTime = Math.ceil(words / 200);
    setStats({ words, chars, charsNoSpace, sentences, paragraphs, lines, readingTime });

    if (words > 0) {
      const wordsArray = input.toLowerCase().match(/\b\w+\b/g) || [];
      const wordCount: { [key: string]: number } = {};
      wordsArray.forEach(word => {
        if (word.length > 3) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });

      const density = Object.entries(wordCount)
        .map(([word, count]) => ({
          word,
          count,
          percentage: Number(((count / words) * 100).toFixed(2))
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Reduced to top 8 for cleaner UI

      setKeywordDensity(density);
    } else {
      setKeywordDensity([]);
    }
  }, [input]);

  const handleAction = (action: string) => {
    let result = input;
    setCleaning(true);

    // Simulate processing delay for "feel"
    setTimeout(() => {
      switch (action) {
        case 'sentence':
          result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, l => l.toUpperCase());
          break;
        case 'lowercase':
          result = input.toLowerCase();
          break;
        case 'uppercase':
          result = input.toUpperCase();
          break;

        case 'title':
          const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
          result = input.toLowerCase().replace(/\b\w+/g, (word, index) => {
            if (index === 0 || !smallWords.includes(word)) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
          });
          break;
        case 'remove-line-breaks':
        case 'remove-breaks':
          result = input.replace(/(\r\n|\n|\r)/gm, " ");
          break;
        case 'reverse-text':
          result = input.split('').reverse().join('');
          break;
        case 'clean-spaces':
          result = input.replace(/\s+/g, ' ').trim();
          break;
      }
      setInput(result);
      setCleaning(false);
    }, 200);
  };

  const handleFindReplace = (option: 'find' | 'replaceAll') => {
    if (!findText) return;

    if (option === 'find') {
    } else if (option === 'replaceAll') {
      const regex = new RegExp(findText, 'g');
      const result = input.replace(regex, replaceText);
      setInput(result);
      setFindText('');
      setReplaceText('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([input], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clean-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Text Navigation */}
      <ScrollableNav items={textNavTools} activeToolId={type} />

      <div className="grid lg:grid-cols-[1fr,300px] gap-6 items-stretch lg:h-[480px] h-auto">
        {/* 1. Main Input Card - The "Workshop" */}
        <div className="flex flex-col h-full min-h-0">
          <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-2xl overflow-hidden flex flex-col h-full transition-all">
            {/* Card Header with Actions */}
            <div className="px-6 py-2.5 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('editor')}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={downloadText} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title={t('download')}>
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={copyToClipboard} className={`p-2 rounded-xl transition-all ${copied ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10'}`} title={t('copy')}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => setInput('')} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all" title={t('clear')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Transformation Bar */}
            <div className="px-4 py-2 border-b border-border bg-muted/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 px-2 border-r border-border mr-1">
                <Sparkles size={12} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Transform:</span>
              </div>
              <button
                onClick={() => handleAction('uppercase')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Type size={12} /> UPPERCASE
              </button>
              <button
                onClick={() => handleAction('lowercase')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Type size={12} /> lowercase
              </button>
              <button
                onClick={() => handleAction('title')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Type size={12} /> Title Case
              </button>
              <button
                onClick={() => handleAction('sentence')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Type size={12} /> Sentence case
              </button>
              <div className="w-px h-4 bg-border mx-1" />
              <button
                onClick={() => handleAction('clean-spaces')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Eraser size={12} className="text-emerald-500" /> Clean Spaces
              </button>
              <button
                onClick={() => handleAction('remove-line-breaks')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-rose-500/50 hover:bg-rose-500/5 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <MoveVertical size={12} className="text-rose-500" /> No Breaks
              </button>
              <button
                onClick={() => handleAction('reverse-text')}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-amber-500/50 hover:bg-amber-500/5 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw size={12} className="text-amber-500" /> Reverse
              </button>
            </div>

            {/* Text Area */}
            <textarea
              className="flex-1 w-full p-6 text-[17.5px] leading-relaxed resize-none focus:outline-none text-foreground bg-input font-medium placeholder:opacity-30 scrollbar-hide"
              placeholder={t('placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              spellCheck={false}
            />

            {/* Quick Keyword Density Pill */}
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
        </div>

        {/* 2. Sidebar Tools - "The Toolbox" */}
        <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto no-scrollbar pr-1">
          {/* Analysis Card */}
          <div className="bg-card rounded-3xl border-2 border-border shadow-xl p-5 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity size={12} className="text-primary" /> Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t('words'), value: stats.words, icon: FileText, color: 'text-blue-400' },
                { label: t('characters'), value: stats.chars, icon: Type, color: 'text-indigo-400' },
                { label: t('sentences'), value: stats.sentences, icon: AlignLeft, color: 'text-emerald-400' },
                { label: t('paragraphs'), value: stats.paragraphs, icon: MoveVertical, color: 'text-purple-400' },
                { label: t('lines'), value: stats.lines, icon: Hash, color: 'text-amber-400' },
                { label: 'Time', value: `${stats.readingTime}m`, icon: Clock, color: 'text-rose-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-2.5 border border-border transition-all">
                  <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
                    <stat.icon className={`w-2.5 h-2.5 ${stat.color}`} />
                    <span className="text-[7px] font-black text-muted-foreground uppercase tracking-tighter">{stat.label}</span>
                  </div>
                  <div className={`text-base font-black ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-card rounded-3xl border-2 border-border shadow-xl p-5 mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-primary" /> Replace
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Find..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-[11px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
              />
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-[11px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
              />
              <button
                onClick={() => handleFindReplace('replaceAll')}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
