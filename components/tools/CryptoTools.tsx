"use client";
import { useState, useEffect } from 'react';
import { Hash, Copy, Check, Download, Lock, RefreshCw, Settings, CheckCircle2, KeyRound, Shield, Binary, Fingerprint, QrCode } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { cn } from '@/utils/cn';

interface CryptoToolsProps {
    type: 'base64-encoder' | 'md5-hash' | 'sha256-hash' | 'sha512-hash' | 'bcrypt-generator' | 'uuid-generator' | 'qr-code-generator';
}

export default function CryptoTools({ type }: CryptoToolsProps) {
    // Navigation Configuration
    const securityNavTools = [
        {
            category: 'Security',
            tools: [
                { id: 'password-generator', label: 'Password', icon: KeyRound },
                { id: 'bcrypt-generator', label: 'Bcrypt', icon: Shield },
            ]
        },
        {
            category: 'Hashing',
            tools: [
                { id: 'base64-encoder', label: 'Base64', icon: Binary },
                { id: 'md5-hash', label: 'MD5', icon: Hash },
                { id: 'sha256-hash', label: 'SHA256', icon: Hash },
                { id: 'sha512-hash', label: 'SHA512', icon: Hash },
            ]
        },
        {
            category: 'Generators',
            tools: [
                { id: 'uuid-generator', label: 'UUID', icon: Fingerprint },
                { id: 'qr-code-generator', label: 'QR Code', icon: QrCode },
            ]
        }
    ];

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [rounds, setRounds] = useState(10);

    // QR Options
    const [qrOptions, setQrOptions] = useState({
        dark: '#000000',
        light: '#FFFFFF',
        margin: 2,
        width: 400
    });

    useEffect(() => {
        const process = async () => {
            if (!input && type !== 'uuid-generator') {
                setOutput('');
                setQrCodeData('');
                return;
            }

            try {
                if (type === 'base64-encoder') {
                    if (mode === 'encode') {
                        const encoded = btoa(unescape(encodeURIComponent(input)));
                        setOutput(encoded);
                    } else {
                        try {
                            const decoded = decodeURIComponent(escape(atob(input)));
                            setOutput(decoded);
                        } catch {
                            setOutput('Error: Invalid Base64 string');
                        }
                    }
                } else if (type === 'md5-hash') {
                    const hash = CryptoJS.MD5(input).toString();
                    setOutput(hash);
                } else if (type === 'sha256-hash') {
                    const hash = CryptoJS.SHA256(input).toString();
                    setOutput(hash);
                } else if (type === 'sha512-hash') {
                    const hash = CryptoJS.SHA512(input).toString();
                    setOutput(hash);
                } else if (type === 'bcrypt-generator') {
                    // Use a small timeout to avoid heavy bcrypt lag while typing
                    const timeoutId = setTimeout(() => {
                        const salt = bcrypt.genSaltSync(rounds);
                        const hash = bcrypt.hashSync(input, salt);
                        setOutput(hash);
                    }, 500);
                    return () => clearTimeout(timeoutId);
                } else if (type === 'qr-code-generator') {
                    const qrDataUrl = await QRCode.toDataURL(input, {
                        width: qrOptions.width,
                        margin: qrOptions.margin,
                        color: {
                            dark: qrOptions.dark,
                            light: qrOptions.light
                        }
                    });
                    setQrCodeData(qrDataUrl);
                    setOutput(input);
                }
            } catch (error) {
                console.error(error);
            }
        };

        process();
    }, [input, mode, type, rounds, qrOptions]);

    const handleAction = async () => {
        if (type === 'uuid-generator') {
            setOutput(uuidv4());
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

    const downloadQRCode = () => {
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = qrCodeData;
        link.click();
    };

    const getPlaceholder = () => {
        if (type === 'base64-encoder') {
            return mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...';
        }
        if (type === 'qr-code-generator') {
            return 'Enter text or URL for QR code...';
        }
        if (type === 'bcrypt-generator') {
            return 'Enter password to hash...';
        }
        if (type === 'uuid-generator') {
            return 'Click generate to create UUID';
        }
        return 'Enter text to hash...';
    };

    const showModeToggle = type === 'base64-encoder';
    const showInput = type !== 'uuid-generator';
    const showBcryptOptions = type === 'bcrypt-generator';
    const isQRCode = type === 'qr-code-generator';

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Security Navigation */}
            <ScrollableNav items={securityNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="space-y-8">
                        {/* Mode Toggle for Base64 */}
                        {showModeToggle && (
                            <div className="bg-muted p-1 rounded-2xl border-2 border-border shadow-inner flex gap-1 w-fit">
                                <button
                                    className={cn(
                                        "px-10 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest border",
                                        mode === 'encode' ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95"
                                    )}
                                    onClick={() => setMode('encode')}
                                >
                                    Encode Mode
                                </button>
                                <button
                                    className={cn(
                                        "px-10 py-3 rounded-xl font-black transition-all text-xs uppercase tracking-widest border",
                                        mode === 'decode' ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95"
                                    )}
                                    onClick={() => setMode('decode')}
                                >
                                    Decode Mode
                                </button>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-12 gap-10">
                            <div className={cn("space-y-6", isQRCode ? "lg:col-span-7" : "lg:col-span-6")}>
                                {showInput && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Input Data</label>
                                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold">{input.length} Chars</span>
                                        </div>
                                        <textarea
                                            className="w-full p-6 border-2 border-border rounded-3xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground placeholder-muted-foreground min-h-[300px] shadow-inner transition-all"
                                            placeholder={getPlaceholder()}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            rows={8}
                                        />
                                    </div>
                                )}

                                {showBcryptOptions && (
                                    <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border space-y-4 max-w-md">
                                        <h4 className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-2">
                                            <Settings size={12} /> Rounds
                                        </h4>
                                        <div className="flex items-center gap-6">
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="range"
                                                    min="4"
                                                    max="14"
                                                    step="1"
                                                    value={rounds}
                                                    onChange={(e) => setRounds(Number(e.target.value))}
                                                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="flex justify-between text-[10px] font-black opacity-50 uppercase">
                                                    <span>Fast ({rounds})</span>
                                                    <span>Secure (14)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {type === 'uuid-generator' && (
                                    <button
                                        onClick={handleAction}
                                        className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                                    >
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                        <span className="text-lg">
                                            Generate New UUID
                                        </span>
                                    </button>
                                )}
                            </div>

                            <div className={cn("space-y-6", isQRCode ? "lg:col-span-5" : "lg:col-span-6")}>
                                {isQRCode ? (
                                    <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-border space-y-8 relative overflow-hidden h-full">
                                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
                                            <Settings className="w-4 h-4 text-accent" /> Styles
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground">Foreground</label>
                                                    <input type="color" value={qrOptions.dark} onChange={e => setQrOptions({ ...qrOptions, dark: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer border-2 border-border bg-background p-1" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-muted-foreground">Background</label>
                                                    <input type="color" value={qrOptions.light} onChange={e => setQrOptions({ ...qrOptions, light: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer border-2 border-border bg-background p-1" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between text-[10px] font-black uppercase">
                                                    <span>Margin</span>
                                                    <span className="text-accent">{qrOptions.margin}px</span>
                                                </div>
                                                <input type="range" min="0" max="10" value={qrOptions.margin} onChange={e => setQrOptions({ ...qrOptions, margin: parseInt(e.target.value) })} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Result Output</label>
                                            <button
                                                onClick={copyToClipboard}
                                                disabled={!output}
                                                className={cn(
                                                    "px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all disabled:opacity-30",
                                                    copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20'
                                                )}
                                            >
                                                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                                {copied ? 'COPIED' : 'COPY'}
                                            </button>
                                        </div>
                                        <div className="w-full p-6 bg-muted/30 border-2 border-border rounded-3xl font-mono text-sm break-all text-primary shadow-inner min-h-[300px] whitespace-pre-wrap flex flex-col items-center justify-center">
                                            {output ? output : (
                                                <div className="text-muted-foreground/30 flex flex-col items-center gap-2">
                                                    <RefreshCw className="w-10 h-10 animate-spin-slow opacity-10" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Waiting for input...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results section */}
                        {isQRCode && qrCodeData && (
                            <div className="bg-muted/20 p-12 rounded-[2.5rem] border-2 border-border flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500 mt-10">
                                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-2 border-border/10">
                                    <img src={qrCodeData} alt="QR Code" className="w-72 h-72 object-contain" />
                                </div>
                                <button
                                    onClick={downloadQRCode}
                                    className="px-12 py-5 bg-emerald-600 text-white rounded-[1.25rem] font-black shadow-2xl transition-all flex items-center gap-4 text-lg"
                                >
                                    <Download className="w-6 h-6" /> SAVE QR CODE
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
}
