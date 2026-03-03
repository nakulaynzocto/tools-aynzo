"use client";
import { useState, useRef, useEffect } from 'react';
import { Pen, Copy, Check, Download, RefreshCw, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

const FONTS = [
    { name: 'Caveat', label: 'Casual Handwriting' },
    { name: 'Dancing Script', label: 'Elegant Cursive' },
    { name: 'Patrick Hand', label: 'Print Style' },
    { name: 'Shadows Into Light', label: 'Light & Airy' },
    { name: 'Indie Flower', label: 'Fun & Quirky' },
];

const PAPER_STYLES = [
    { name: 'Lined', bg: '#fff9f0', lineColor: '#c7d5e8' },
    { name: 'Grid', bg: '#f8f8ff', lineColor: '#d0d8e8' },
    { name: 'Plain', bg: '#fffbf5', lineColor: 'transparent' },
];

const INK_COLORS = ['#1a1a3e', '#1a3e1a', '#3e1a1a', '#2c3e8c', '#000000'];

export function TextToHandwriting() {
    const [text, setText] = useState('The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.');
    const [font, setFont] = useState('Caveat');
    const [fontSize, setFontSize] = useState(28);
    const [inkColor, setInkColor] = useState('#1a1a3e');
    const [paper, setPaper] = useState(0);
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Load Google Fonts dynamically
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${FONTS.map(f => f.name.replace(/ /g, '+')).join('&family=')}&display=swap`;
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    useEffect(() => { renderCanvas(); }, [text, font, fontSize, inkColor, paper]);

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width = 800;
        const padding = 50;
        const lineHeight = fontSize * 1.8;
        const maxWidth = W - padding * 2;

        ctx.font = `${fontSize}px '${font}', cursive`;
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && currentLine) {
                lines.push(currentLine); currentLine = word;
            } else { currentLine = testLine; }
        }
        if (currentLine) lines.push(currentLine);

        const H = canvas.height = padding * 2 + lines.length * lineHeight + 20;
        const ps = PAPER_STYLES[paper];

        ctx.fillStyle = ps.bg;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = ps.lineColor;
        ctx.lineWidth = 1;
        if (ps.lineColor !== 'transparent') {
            if (paper === 0) {
                for (let y = padding + lineHeight; y < H - padding / 2; y += lineHeight) {
                    ctx.beginPath(); ctx.moveTo(padding - 16, y + 6); ctx.lineTo(W - padding + 16, y + 6); ctx.stroke();
                }
                ctx.strokeStyle = '#e88'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(padding + 30, 0); ctx.lineTo(padding + 30, H); ctx.stroke();
            } else if (paper === 1) {
                for (let y = padding; y < H; y += lineHeight / 2) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
                for (let x = padding; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            }
        }

        ctx.font = `${fontSize}px '${font}', cursive`;
        ctx.fillStyle = inkColor;
        ctx.textBaseline = 'alphabetic';
        lines.forEach((line, i) => {
            ctx.fillText(line, padding + (paper === 0 ? 40 : 0), padding + (i + 1) * lineHeight);
        });
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const a = document.createElement('a');
        a.download = 'handwriting.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Pen className="w-8 h-8 text-primary" /></div>
                        TEXT TO HANDWRITING
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Convert typed text into realistic handwriting images. Download as PNG.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleCopy} className="flex items-center gap-2.5 px-5 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl border-2 border-border font-bold text-sm transition-all">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-primary" />}
                        {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-2.5 px-5 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-bold text-sm transition-all shadow-lg">
                        <Download className="w-4 h-4" /> Download PNG
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
                {/* Canvas Area */}
                <div className="space-y-5">
                    <div className="bg-muted/10 p-6 rounded-[2rem] border-2 border-border/50 space-y-4">
                        <label className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Pen className="w-4 h-4" /> Your Text
                        </label>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={4}
                            className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-sm resize-none"
                            placeholder="Type your text here..."
                        />
                    </div>

                    <div className="overflow-x-auto rounded-3xl border-2 border-border shadow-lg bg-white">
                        <canvas ref={canvasRef} className="w-full max-w-full" style={{ display: 'block' }} />
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-muted/10 p-6 rounded-[2rem] border-2 border-border/50 space-y-6">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Customization</h3>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Font Style</label>
                        <div className="space-y-2">
                            {FONTS.map(f => (
                                <button key={f.name} onClick={() => setFont(f.name)} className={cn(
                                    'w-full text-left px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all',
                                    font === f.name ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:border-primary/40'
                                )}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                            Font Size <span>{fontSize}px</span>
                        </label>
                        <input type="range" min="16" max="48" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Ink Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {INK_COLORS.map(c => (
                                <button key={c} onClick={() => setInkColor(c)} className={cn('w-9 h-9 rounded-xl border-4 transition-all', inkColor === c ? 'border-primary scale-110' : 'border-transparent')} style={{ background: c }} />
                            ))}
                            <input type="color" value={inkColor} onChange={e => setInkColor(e.target.value)} className="w-9 h-9 rounded-xl border-2 border-border cursor-pointer overflow-hidden bg-transparent" title="Custom color" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Paper Style</label>
                        <div className="flex gap-2">
                            {PAPER_STYLES.map(({ name }, i) => (
                                <button key={i} onClick={() => setPaper(i)} className={cn('flex-1 py-2.5 rounded-xl border-2 font-bold text-xs transition-all', paper === i ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40')}>
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={renderCanvas} className="w-full flex items-center justify-center gap-2 py-3 bg-muted/30 hover:bg-muted/50 border-2 border-border rounded-xl font-bold text-sm transition-all">
                        <RefreshCw className="w-4 h-4" /> Refresh Canvas
                    </button>
                </div>
            </div>

            <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">How It Works</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Text is rendered on an HTML Canvas using Google Fonts — entirely in your browser, with no data sent to any server. Download the PNG for use in documents, social media, or as digital notes.</p>
                </div>
            </div>
        </div>
    );
}
