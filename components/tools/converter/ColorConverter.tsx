"use client";
import { useState, useEffect } from 'react';
import { Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface ColorValues {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

export function ColorConverter() {
    const t = useTranslations('Common');
    const [hex, setHex] = useState('#FF5733');
    const [rgb, setRgb] = useState({ r: 255, g: 87, b: 51 });
    const [hsl, setHsl] = useState({ h: 11, s: 100, l: 60 });
    const [copied, setCopied] = useState<string | null>(null);

    const updateFromHex = (newHex: string) => {
        if (!/^#?[0-9A-Fa-f]{6}$/.test(newHex.replace('#', ''))) return;
        const rgbVal = hexToRgb(newHex);
        if (rgbVal) {
            setRgb(rgbVal);
            setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
        }
    };

    const updateFromRgb = (r: number, g: number, b: number) => {
        setRgb({ r, g, b });
        setHex(rgbToHex(r, g, b));
        setHsl(rgbToHsl(r, g, b));
    };

    const updateFromHsl = (h: number, s: number, l: number) => {
        setHsl({ h, s, l });
        const rgbVal = hslToRgb(h, s, l);
        setRgb(rgbVal);
        setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
    };

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Color Preview */}
            <div className="bg-card rounded-2xl border-2 border-border p-8">
                <div 
                    className="w-full h-48 rounded-xl mb-4 border-2 border-border"
                    style={{ backgroundColor: hex }}
                />
                <div className="text-center">
                    <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">Color Preview</div>
                    <div className="text-2xl font-black text-foreground">{hex.toUpperCase()}</div>
                </div>
            </div>

            {/* HEX Input */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground">HEX</label>
                    <button
                        onClick={() => handleCopy(hex, 'hex')}
                        className={cn(
                            "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            copied === 'hex'
                                ? "bg-emerald-500 text-white"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        {copied === 'hex' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        Copy
                    </button>
                </div>
                <div className="flex gap-3 items-center">
                    <input
                        type="color"
                        value={hex}
                        onChange={(e) => {
                            setHex(e.target.value);
                            updateFromHex(e.target.value);
                        }}
                        className="w-20 h-20 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <input
                        type="text"
                        value={hex}
                        onChange={(e) => {
                            const val = e.target.value;
                            setHex(val);
                            if (/^#?[0-9A-Fa-f]{6}$/.test(val.replace('#', ''))) {
                                updateFromHex(val.startsWith('#') ? val : '#' + val);
                            }
                        }}
                        className="flex-1 px-4 py-3 bg-background border-2 border-border rounded-xl text-lg font-bold text-foreground focus:border-primary focus:outline-none"
                        placeholder="#FF5733"
                    />
                </div>
            </div>

            {/* RGB Input */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground">RGB</label>
                    <button
                        onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                        className={cn(
                            "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            copied === 'rgb'
                                ? "bg-emerald-500 text-white"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        {copied === 'rgb' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        Copy
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(['r', 'g', 'b'] as const).map((channel) => (
                        <div key={channel}>
                            <label className="text-xs font-bold text-foreground block mb-2 uppercase">{channel.toUpperCase()}</label>
                            <input
                                type="number"
                                min="0"
                                max="255"
                                value={rgb[channel]}
                                onChange={(e) => {
                                    const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                                    updateFromRgb(
                                        channel === 'r' ? val : rgb.r,
                                        channel === 'g' ? val : rgb.g,
                                        channel === 'b' ? val : rgb.b
                                    );
                                }}
                                className="w-full px-3 py-2 bg-background border-2 border-border rounded-xl text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                            />
                            <input
                                type="range"
                                min="0"
                                max="255"
                                value={rgb[channel]}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    updateFromRgb(
                                        channel === 'r' ? val : rgb.r,
                                        channel === 'g' ? val : rgb.g,
                                        channel === 'b' ? val : rgb.b
                                    );
                                }}
                                className="w-full mt-2 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center text-sm font-bold text-muted-foreground">
                    rgb({rgb.r}, {rgb.g}, {rgb.b})
                </div>
            </div>

            {/* HSL Input */}
            <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground">HSL</label>
                    <button
                        onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                        className={cn(
                            "px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            copied === 'hsl'
                                ? "bg-emerald-500 text-white"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        {copied === 'hsl' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        Copy
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(['h', 's', 'l'] as const).map((channel) => (
                        <div key={channel}>
                            <label className="text-xs font-bold text-foreground block mb-2 uppercase">{channel.toUpperCase()}</label>
                            <input
                                type="number"
                                min={channel === 'h' ? 0 : 0}
                                max={channel === 'h' ? 360 : 100}
                                value={hsl[channel]}
                                onChange={(e) => {
                                    const val = Math.max(0, Math.min(channel === 'h' ? 360 : 100, parseInt(e.target.value) || 0));
                                    updateFromHsl(
                                        channel === 'h' ? val : hsl.h,
                                        channel === 's' ? val : hsl.s,
                                        channel === 'l' ? val : hsl.l
                                    );
                                }}
                                className="w-full px-3 py-2 bg-background border-2 border-border rounded-xl text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                            />
                            <input
                                type="range"
                                min={channel === 'h' ? 0 : 0}
                                max={channel === 'h' ? 360 : 100}
                                value={hsl[channel]}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    updateFromHsl(
                                        channel === 'h' ? val : hsl.h,
                                        channel === 's' ? val : hsl.s,
                                        channel === 'l' ? val : hsl.l
                                    );
                                }}
                                className="w-full mt-2 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center text-sm font-bold text-muted-foreground">
                    hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </div>
            </div>
        </div>
    );
}


