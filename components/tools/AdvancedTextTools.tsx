"use client";
import { useState, useEffect } from 'react';
import { Copy, Download, RotateCcw, Search, Settings, Type, ArrowRightLeft, Trash2, ArrowDownAZ, Repeat, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollableNav } from '@/components/ScrollableNav';


interface AdvancedTextToolsProps {
    type: string;
}

export default function AdvancedTextTools({ type }: AdvancedTextToolsProps) {
    const t = useTranslations('TextTools');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [useRegex, setUseRegex] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);

    // Unicode character mappings for text transformations
    const unicodeMaps = {
        italic: {
            a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫',
            k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵',
            u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
            A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑',
            K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛',
            U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
        },
        strikethrough: (char: string) => char + '\u0336',
        underline: (char: string) => char + '\u0332',
        small: {
            a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ',
            k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'ᷫ', r: 'ʳ', s: 'ˢ', t: 'ᵗ',
            u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
            A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ',
            K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'Q', R: 'ᴿ', S: 'ˢ', T: 'ᵀ',
            U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
        },
        upsideDown: {
            a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
            k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
            u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
            A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ',
            K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ɹ', S: 'S', T: '⊥',
            U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
        },
        bold: {
            a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣',
            k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭',
            u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
            A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉',
            K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓',
            U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
            0: '𝟎', 1: '𝟏', 2: '𝟐', 3: '𝟑', 4: '𝟒', 5: '𝟓', 6: '𝟔', 7: '𝟕', 8: '𝟖', 9: '𝟗'
        },
        cursive: {
            a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿',
            k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉',
            u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
            A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥',
            K: '𝒦', L: 'ℒ', M: 'ℳ', N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯',
            U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵'
        },
        doubleUnderline: (char: string) => char + '\u0333',
    };

    useEffect(() => {
        if (!input) {
            setOutput('');
            return;
        }

        let result = '';
        switch (type) {
            case 'italic-text':
                result = input.split('').map(char => (unicodeMaps.italic as any)[char] || char).join('');
                break;
            case 'strikethrough-text':
                result = input.split('').map(char => unicodeMaps.strikethrough(char)).join('');
                break;
            case 'underline-text':
                result = input.split('').map(char => unicodeMaps.underline(char)).join('');
                break;
            case 'double-underline-text':
                result = input.split('').map(char => unicodeMaps.doubleUnderline(char)).join('');
                break;
            case 'bold-text':
                result = input.split('').map(char => (unicodeMaps.bold as any)[char] || char).join('');
                break;
            case 'cursive-text':
                result = input.split('').map(char => (unicodeMaps.cursive as any)[char] || char).join('');
                break;
            case 'small-text':
                result = input.split('').map(char => (unicodeMaps.small as any)[char] || char).join('');
                break;
            case 'upside-down-text':
                result = input.split('').reverse().map(char => (unicodeMaps.upsideDown as any)[char] || char).join('');
                break;
            case 'mirror-text':
                result = input.split('').reverse().join('');
                break;
            case 'duplicate-line-remover':
                const lines = input.split('\n');
                const uniqueLines = Array.from(new Set(lines));
                result = uniqueLines.join('\n');
                break;
            case 'sort-alphabetically':
                const sortLines = input.split('\n').filter(line => line.trim());
                result = sortLines.sort((a, b) => a.localeCompare(b)).join('\n');
                break;
            case 'text-replace':
                if (findText) {
                    result = input.split(findText).join(replaceText);
                } else {
                    result = input;
                }
                break;
            case 'whitespace-remover':
                result = input.replace(/\s+/g, ' ').trim();
                break;
            case 'word-frequency':
                const words = input.toLowerCase().match(/\b\w+\b/g) || [];
                const frequency: { [key: string]: number } = {};
                words.forEach(word => {
                    frequency[word] = (frequency[word] || 0) + 1;
                });
                const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
                result = sorted.map(([word, count]) => `${word}: ${count}`).join('\n');
                break;
            case 'find-replace':
                if (findText) {
                    try {
                        if (useRegex) {
                            const flags = caseSensitive ? 'g' : 'gi';
                            const regex = new RegExp(findText, flags);
                            result = input.replace(regex, replaceText);
                        } else {
                            const flags = caseSensitive ? 'g' : 'gi';
                            const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(escapedFind, flags);
                            result = input.replace(regex, replaceText);
                        }
                    } catch (error) {
                        result = input;
                    }
                } else {
                    result = input;
                }
                break;
            default:
                result = input;
        }
        setOutput(result);
    }, [input, type, findText, replaceText, useRegex, caseSensitive]);

    const processText = () => {
        // Function kept for legacy or explicit trigger if needed, but not used by main button anymore
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadText = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setFindText('');
        setReplaceText('');
    };

    // Helper to determine icon and title based on type
    const getToolInfo = () => {
        switch (type) {
            case 'italic-text': return { icon: Type, label: t('italicConverter') };
            case 'strikethrough-text': return { icon: Type, label: t('strikethrough') };
            case 'sort-alphabetically': return { icon: ArrowDownAZ, label: t('sortAZ') };
            case 'duplicate-line-remover': return { icon: Trash2, label: t('removeDuplicates') };
            case 'find-replace': return { icon: Search, label: t('findReplace') };
            case 'bold-text': return { icon: Type, label: t('boldText') };
            case 'cursive-text': return { icon: Type, label: t('cursiveText') };
            case 'double-underline-text': return { icon: Type, label: t('doubleUnderline') };
            default: return { icon: Settings, label: t('textTool') };
        }
    };

    const toolInfo = getToolInfo();

    // Define text style tools for the group navigation
    const textStyleTools = [
        { id: 'bold-text', icon: '𝐁', label: 'Bold' },
        { id: 'italic-text', icon: '𝐼', label: 'Italic' },
        { id: 'cursive-text', icon: '𝒞', label: 'Cursive' },
        { id: 'underline-text', icon: 'U̲', label: 'Underline' },
        { id: 'double-underline-text', icon: 'U̳', label: 'Double' },
        { id: 'strikethrough-text', icon: 'S̶', label: 'Strike' },
        { id: 'small-text', icon: 'Sₘ', label: 'Small' },
        { id: 'upside-down-text', icon: 'uʍoᗡ', label: 'Flip' },
        { id: 'mirror-text', icon: 'ЯR', label: 'Mirror' },
    ];

    const navItems = [
        {
            category: 'Styles',
            tools: textStyleTools
        }
    ];

    const isTextStyleTool = textStyleTools.some(t => t.id === type);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Text Style Navigation Tabs */}
            {isTextStyleTool && (
                <ScrollableNav items={navItems} activeToolId={type} />
            )}

            {/* Premium Header */}

            <div className="grid lg:grid-cols-2 gap-6">

                {/* 1. Input Section */}
                <div className="bg-card rounded-2xl border-2 border-border shadow-lg flex flex-col h-[600px]">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <toolInfo.icon className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-sm font-bold text-foreground">{t('input')}</span>
                        </div>
                        <button onClick={clearAll} className="text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" /> {t('reset')}
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('pastePlaceholder')}
                        className="flex-1 w-full p-6 text-sm leading-relaxed resize-none focus:outline-none text-foreground bg-input font-normal placeholder-muted-foreground font-mono"
                        spellCheck={false}
                    />
                </div>

                {/* 2. Configuration & Output Section */}
                <div className="flex flex-col gap-6 h-[600px]">

                    {/* Controls Card */}
                    <div className="bg-card rounded-2xl border-2 border-border shadow-md p-6 flex-shrink-0">
                        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <Settings className="w-4 h-4 text-muted-foreground" /> {t('options')}
                        </h3>

                        {(type === 'text-replace' || type === 'find-replace') ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('findLabel')}</label>
                                        <input
                                            type="text"
                                            value={findText}
                                            onChange={(e) => setFindText(e.target.value)}
                                            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-foreground placeholder-muted-foreground"
                                            placeholder={t('find')}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('replaceLabel')}</label>
                                        <input
                                            type="text"
                                            value={replaceText}
                                            onChange={(e) => setReplaceText(e.target.value)}
                                            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-foreground placeholder-muted-foreground"
                                            placeholder={t('replaceWith')}
                                        />
                                    </div>
                                </div>
                                {type === 'find-replace' && (
                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                                            <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                                            {t('useRegex')}
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                                            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                                            {t('caseSensitive')}
                                        </label>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">{t('noConfig')}</p>
                        )}

                    </div>

                    {/* Output Card */}
                    <div className="bg-card rounded-2xl border-2 border-border shadow-lg flex flex-col flex-1 overflow-hidden relative text-foreground">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${output ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`}></span>
                                <span className="text-sm font-bold">{t('output')}</span>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={copyToClipboard} disabled={!output} className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${copied ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-green-400 hover:bg-green-500/10'}`}>
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button onClick={downloadText} disabled={!output} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-30">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {output ? (
                            <textarea
                                value={output}
                                readOnly
                                className="flex-1 w-full p-6 text-sm leading-relaxed resize-none focus:outline-none text-foreground bg-input font-mono"
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground gap-2">
                                <Repeat className="w-8 h-8 opacity-20" />
                                <span className="text-sm font-medium opacity-50">{t('resultsPlaceholder')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
