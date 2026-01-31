"use client";
import { Globe, Smartphone, Monitor, ZoomIn, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ResolutionData } from '@/components/types/web/types';

interface ResolutionSimulatorProps {
    iframeUrl: string;
    setIframeUrl: (url: string) => void;
    resolution: ResolutionData;
    setResolution: (res: ResolutionData) => void;
    scale: number;
    setScale: (scale: number) => void;
}

export function ResolutionSimulator({ iframeUrl, setIframeUrl, resolution, setResolution, scale, setScale }: ResolutionSimulatorProps) {
    const handleResolutionChange = (res: ResolutionData) => {
        setResolution(res);
        if (res.w > 1000) setScale(0.4);
        else if (res.w > 600) setScale(0.6);
        else setScale(1);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row gap-8 items-end">
                <div className="flex-1 w-full space-y-3">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">SIMULATION SOURCE</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                            <Globe size={22} />
                        </div>
                        <input
                            value={iframeUrl} onChange={e => setIframeUrl(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 border-2 border-border rounded-[1.25rem] bg-input font-black text-lg focus:border-primary outline-none transition-all shadow-inner"
                            placeholder="Enter Website URL (e.g. google.com)"
                        />
                    </div>
                </div>
                <div className="flex p-2 bg-muted rounded-[1.5rem] border-2 border-border gap-2 shadow-inner">
                    {[
                        { w: 375, h: 667, label: 'Mobile', icon: Smartphone },
                        { w: 768, h: 1024, label: 'Tablet', icon: Monitor },
                        { w: 1920, h: 1080, label: 'Desktop', icon: Monitor },
                    ].map(device => (
                        <button
                            key={device.label}
                            onClick={() => handleResolutionChange(device)}
                            className={cn(
                                "px-6 py-3 rounded-2xl flex items-center gap-3 transition-all",
                                resolution.label === device.label ? "bg-primary shadow-xl text-primary-foreground border-2 border-primary" : "bg-transparent border border-border text-foreground hover:bg-primary/10 hover:border-primary active:scale-95"
                            )}
                        >
                            <device.icon size={18} />
                            <span className="text-[11px] font-black uppercase tracking-tighter">{device.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 bg-muted p-2 rounded-[1.25rem] border-2 border-border shadow-inner px-4">
                    <ZoomIn size={16} className="text-muted-foreground" />
                    <input
                        type="range"
                        min="0.2"
                        max="1.5"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-24 accent-primary cursor-pointer"
                    />
                    <span className="text-[10px] font-black w-8 text-right font-mono">{Math.round(scale * 100)}%</span>
                </div>
            </div>

            <div className="relative bg-muted/10 border-2 border-border rounded-[3rem] p-8 flex flex-col items-center overflow-hidden transition-all duration-500 ease-in-out">
                <div className="absolute top-6 left-8 flex items-center gap-6 z-10">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Simulator</span>
                    </div>
                    <div className="px-5 py-2 bg-card border-2 border-border rounded-full text-xs font-black text-primary shadow-sm">{resolution.w} x {resolution.h}</div>
                </div>

                <div
                    className="mt-16 w-full flex justify-center origin-top transition-all duration-300 ease-in-out"
                    style={{ height: (resolution.h * scale) + 40 }}
                >
                    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }} className="absolute">
                        <div className="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] border-[12px] border-border rounded-[3.5rem] bg-card p-2">
                            <div className="bg-background rounded-[2.5rem] overflow-hidden shadow-inner">
                                {iframeUrl ? (
                                    <div style={{ width: resolution.w, height: resolution.h }} className="bg-background overflow-hidden">
                                        <iframe
                                            src={iframeUrl.startsWith('http') ? iframeUrl : `https://${iframeUrl}`}
                                            className="w-full h-full border-none"
                                            title="SimulatorView"
                                            sandbox="allow-scripts allow-same-origin allow-forms"
                                        />
                                    </div>
                                ) : (
                                    <div style={{ width: resolution.w, height: resolution.h }} className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-card">
                                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
                                            <ExternalLink size={40} className="opacity-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-black text-foreground">Awaiting Source URL</p>
                                            <p className="text-xs font-medium text-muted-foreground max-w-xs">Enter a valid website address above to begin the responsive simulation for <b>{resolution.label}</b> device.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <div className="w-12 h-1 bg-muted rounded-full"></div>
                    <div className="w-1.5 h-1 bg-muted rounded-full"></div>
                    <div className="w-1.5 h-1 bg-muted rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

