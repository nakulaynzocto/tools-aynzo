"use client";
import { useState } from 'react';
import { Copy, Download, Type, Settings, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface UtilityToolsProps {
    type: 'reverse-text' | 'bold-text' | 'lorem-ipsum';
}

export default function UtilityTools({ type }: UtilityToolsProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [paragraphs, setParagraphs] = useState(3);

    const loremIpsumText = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
    ];

    const handleAction = () => {
        if (!input.trim() && type !== 'lorem-ipsum') {
            return;
        }

        switch (type) {
            case 'reverse-text':
                setOutput(input.split('').reverse().join(''));
                break;
            case 'bold-text':
                const boldMap: { [key: string]: string } = {
                    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺',
                    'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
                    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗵', 'I': '𝗶', 'J': '𝗷', 'K': '𝗸', 'L': '𝗹', 'M': '𝗺',
                    'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗿', 'S': '𝘀', 'T': '𝘁', 'U': '𝘂', 'V': '𝘃', 'W': '𝘄', 'X': '𝘅', 'Y': '𝘆', 'Z': '𝗭',
                    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
                };
                setOutput(input.split('').map(char => boldMap[char] || char).join(''));
                break;
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
        }
    };

    const downloadText = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const [typeOption, setTypeOption] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [startWithLorem, setStartWithLorem] = useState(true);

    const generateLorem = () => {
        let content = loremIpsumText.join(' ');
        if (typeOption === 'paragraphs') {
            content = loremIpsumText.slice(0, paragraphs).join('\n\n');
        } else if (typeOption === 'sentences') {
            content = content.split('. ').slice(0, paragraphs).join('. ') + '.';
        } else if (typeOption === 'words') {
            content = content.split(' ').slice(0, paragraphs * 10).join(' ');
        }

        if (startWithLorem && !content.startsWith('Lorem ipsum')) {
            content = "Lorem ipsum dolor sit amet, " + content.toLowerCase();
        }
        setOutput(content);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8">
                    <div className="grid lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-6 relative overflow-hidden">
                                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Settings size={14} /> Configuration
                                </h3>

                                {type !== 'lorem-ipsum' ? (
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Input Text</label>
                                        <textarea
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            className="w-full h-48 p-5 border-2 border-border rounded-2xl bg-input focus:border-accent outline-none font-medium transition-all"
                                            placeholder="Type or paste here..."
                                        />
                                        <button
                                            onClick={handleAction}
                                            className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all"
                                        >
                                            Process Text
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Generate Type</label>
                                            <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl">
                                                {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setTypeOption(t)}
                                                        className={cn(
                                                            "py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                                                            typeOption === t ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                                                        )}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-black uppercase">
                                                <span>Count</span>
                                                <span className="text-primary">{paragraphs}</span>
                                            </div>
                                            <input
                                                type="range" min="1" max="20"
                                                value={paragraphs}
                                                onChange={e => setParagraphs(parseInt(e.target.value))}
                                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>

                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase">Start with Lorem</span>
                                            <div className={cn("w-10 h-6 flex items-center rounded-full p-1 transition-colors", startWithLorem ? 'bg-primary' : 'bg-muted-foreground/30')}>
                                                <div className={cn("bg-primary-foreground w-4 h-4 rounded-full shadow-md transform transition-transform", startWithLorem ? 'translate-x-4' : 'translate-x-0')} />
                                                <input type="checkbox" className="hidden" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} />
                                            </div>
                                        </label>

                                        <button
                                            onClick={generateLorem}
                                            className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl"
                                        >
                                            Generate Now
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-blue-500/5 rounded-2xl border-2 border-blue-500/10 space-y-2">
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Info size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Did you know?</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                    {type === 'lorem-ipsum' ? "Lorem Ipsum has been the industry standard placeholder text since the 1500s." : "Our text tools process data locally in your browser for 100% privacy."}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6 flex flex-col">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Output</h3>
                                {output && (
                                    <div className="flex gap-2">
                                        <button onClick={copyToClipboard} className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-muted hover:bg-border text-primary'}`}>
                                            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                        </button>
                                        <button onClick={downloadText} className="p-2 bg-muted hover:bg-border rounded-lg text-primary transition-all">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-muted/20 border-2 border-border rounded-[2rem] p-8 min-h-[400px] relative overflow-hidden group shadow-inner">
                                {output ? (
                                    <div className="animate-in fade-in duration-500 text-lg leading-relaxed text-foreground font-medium whitespace-pre-wrap">
                                        {output}
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                                        <Type size={64} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Output Available</span>
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
