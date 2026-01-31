"use client";
import { useState, useEffect } from 'react';
import { Download, Settings } from 'lucide-react';
import { generateQRCode } from '@/components/utils/crypto/cryptoProcessing';

export function QRCodeGenerator() {
    const [input, setInput] = useState('');
    const [qrCodeData, setQrCodeData] = useState('');
    const [qrOptions, setQrOptions] = useState({
        dark: '#000000',
        light: '#FFFFFF',
        margin: 2,
        width: 400
    });

    useEffect(() => {
        if (!input) {
            setQrCodeData('');
            return;
        }
        const process = async () => {
            try {
                const qrDataUrl = await generateQRCode(input);
                setQrCodeData(qrDataUrl);
            } catch (error: any) {
                setQrCodeData('');
            }
        };
        process();
    }, [input, qrOptions]);

    const downloadQRCode = () => {
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = qrCodeData;
        link.click();
    };

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Input Data</label>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold">{input.length} Chars</span>
                    </div>
                    <textarea
                        className="w-full p-6 border-2 border-border rounded-3xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground placeholder-muted-foreground min-h-[300px] shadow-inner transition-all"
                        placeholder="Enter text or URL for QR code..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        rows={8}
                    />
                </div>
                <div className="lg:col-span-5 space-y-6">
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
                </div>
            </div>
            {qrCodeData && (
                <div className="bg-muted/20 p-12 rounded-[2.5rem] border-2 border-border flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-500">
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
    );
}

