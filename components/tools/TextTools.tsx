"use client";
import { useState, useEffect } from 'react';
import { Copy, Check, FileText, Hash, AlignLeft, Trash2, Download, Clock, Search, Type, MoveVertical, Eraser, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';


interface TextToolProps {
  type: 'word-counter' | 'character-counter' | 'text-case-converter' | 'remove-line-breaks' | 'reverse-text';
}

export default function TextTools({ type }: TextToolProps) {
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
        case 'capitalize':
          result = input.replace(/\b\w/g, l => l.toUpperCase());
          break;
        case 'alternating':
          result = input.split('').map((char, i) =>
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          ).join('');
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
        case 'inverse':
          result = input.split('').map(char =>
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          ).join('');
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Premium Header */}

      {/* 1. Statistics Cards - Modern & Clean */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: t('words'), value: stats.words, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: t('characters'), value: stats.chars, icon: Type, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: t('sentences'), value: stats.sentences, icon: AlignLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: t('paragraphs'), value: stats.paragraphs, icon: MoveVertical, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: t('lines'), value: stats.lines, icon: Hash, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: t('readTime'), value: `${stats.readingTime}m`, icon: Clock, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* 2. Main Input Card - The "Workshop" */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border-2 border-border shadow-lg overflow-hidden flex flex-col h-[500px]">
            {/* Card Header with Actions */}
            {/* Card Header with Actions */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">{t('editor')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={downloadText} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title={t('download')}>
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={copyToClipboard} className={`p-2 rounded-lg transition-colors ${copied ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-green-400 hover:bg-green-500/10'}`} title={t('copy')}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => setInput('')} className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title={t('clear')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Area */}
            <textarea
              className="flex-1 w-full p-6 text-base leading-relaxed resize-none focus:outline-none text-foreground bg-input font-normal placeholder-muted-foreground"
              placeholder={t('placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              spellCheck={false}
            />

            {/* Quick Keyword Density Pill */}
            {keywordDensity.length > 0 && (
              <div className="px-6 py-3 bg-muted border-t border-border flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">{t('topKeywords')}:</span>
                {keywordDensity.slice(0, 5).map((k, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-card border border-border rounded-md text-foreground shadow-sm whitespace-nowrap">
                    {k.word} <span className="text-muted-foreground">({k.count})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Sidebar Tools - "The Toolbox" */}
        <div className="space-y-6">

          {/* Quick Actions Card */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-md p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t('quickTransformers')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAction('uppercase')} className="p-3 rounded-xl border border-border bg-input hover:bg-primary/10 hover:border-primary/30 text-left transition-all group">
                <div className="text-xs font-semibold text-muted-foreground group-hover:text-primary mb-1">{t('allCaps')}</div>
                <div className="text-sm font-bold text-foreground">{t('uppercase')}</div>
              </button>
              {type === 'reverse-text' && (
                <button onClick={() => handleAction('inverse')} className="col-span-2 p-3 rounded-xl border border-border bg-input hover:bg-primary/10 hover:border-primary/30 text-left transition-all group">
                  <div className="text-xs font-semibold text-muted-foreground group-hover:text-primary mb-1">{t('mirrorMode')}</div>
                  <div className="text-sm font-bold text-foreground">{t('reverseText')}</div>
                </button>
              )}
              <button onClick={() => handleAction('lowercase')} className="p-3 rounded-xl border border-border bg-input hover:bg-primary/10 hover:border-primary/30 text-left transition-all group">
                <div className="text-xs font-semibold text-muted-foreground group-hover:text-primary mb-1">{t('allSmall')}</div>
                <div className="text-sm font-bold text-foreground">{t('lowercase')}</div>
              </button>
              <button onClick={() => handleAction('title')} className="p-3 rounded-xl border border-border bg-input hover:bg-primary/10 hover:border-primary/30 text-left transition-all group">
                <div className="text-xs font-semibold text-muted-foreground group-hover:text-primary mb-1">{t('headlineStyle')}</div>
                <div className="text-sm font-bold text-foreground">{t('titleCase')}</div>
              </button>
              <button onClick={() => handleAction('sentence')} className="p-3 rounded-xl border border-border bg-input hover:bg-primary/10 hover:border-primary/30 text-left transition-all group">
                <div className="text-xs font-semibold text-muted-foreground group-hover:text-primary mb-1">{t('naturalFlow')}</div>
                <div className="text-sm font-bold text-foreground">{t('sentenceCase')}</div>
              </button>
              <button onClick={() => handleAction('clean-spaces')} className="col-span-2 p-3 rounded-xl border border-border bg-input hover:bg-green-500/10 hover:border-green-500/30 flex items-center justify-between transition-all group">
                <div className="flex flex-col text-left">
                  <div className="text-xs font-semibold text-muted-foreground group-hover:text-green-400">{t('fixSpacing')}</div>
                  <div className="text-sm font-bold text-foreground">{t('removeExtraSpaces')}</div>
                </div>
                <Eraser className="w-5 h-5 text-muted-foreground group-hover:text-green-400" />
              </button>
              {(type === 'remove-line-breaks' || true) && (
                <button onClick={() => handleAction('remove-line-breaks')} className="col-span-2 p-3 rounded-xl border border-border bg-input hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-between transition-all group">
                  <div className="flex flex-col text-left">
                    <div className="text-xs font-semibold text-muted-foreground group-hover:text-red-400">{t('joinText')}</div>
                    <div className="text-sm font-bold text-foreground">{t('removeLineBreaks')}</div>
                  </div>
                  <MoveVertical className="w-5 h-5 text-muted-foreground group-hover:text-red-400" />
                </button>
              )}
            </div>
          </div>

          {/* Find & Replace Card (Condensed) */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-md p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-400" />
              {t('findReplace')}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder={t('find')}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder={t('replaceWith')}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleFindReplace('find')}
                  className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-semibold hover:bg-secondary transition-all"
                >
                  {t('count')}
                </button>
                <button
                  onClick={() => handleFindReplace('replaceAll')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
                >
                  {t('replaceAll')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
