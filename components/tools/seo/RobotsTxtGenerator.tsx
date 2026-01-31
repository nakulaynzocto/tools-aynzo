"use client";
import { Settings, Code, CheckCircle2, Copy } from 'lucide-react';
import { RobotsData } from '@/components/types/seo/types';
import { cn } from '@/utils/cn';

interface RobotsTxtGeneratorProps {
    robots: RobotsData;
    setRobots: (robots: RobotsData) => void;
    result: string;
    copied: boolean;
    onCopy: () => void;
}

export function RobotsTxtGenerator({ robots, setRobots, result, copied, onCopy }: RobotsTxtGeneratorProps) {
    return (
        <>
            <div className="p-8 space-y-6 h-full overflow-y-auto no-scrollbar bg-muted/5">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary border-b border-border pb-4">
                        <Settings size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Crawler Rules</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <button onClick={() => setRobots({ ...robots, allAgents: true })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all", robots.allAgents ? "bg-primary text-white" : "bg-muted text-muted-foreground/50 border border-border")}>All Agents</button>
                            <button onClick={() => setRobots({ ...robots, allAgents: false })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all", !robots.allAgents ? "bg-primary text-white" : "bg-muted text-muted-foreground/50 border border-border")}>Google Only</button>
                        </div>
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Allow Indexing</label>
                                <input value={robots.allow} onChange={e => setRobots({ ...robots, allow: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card" placeholder="Allow Path" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Block Path</label>
                                <input value={robots.disallow} onChange={e => setRobots({ ...robots, disallow: e.target.value })} className="w-full p-3.5 border-2 border-border rounded-xl bg-card" placeholder="Disallow Path" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-muted px-8 py-6 flex flex-col h-full overflow-hidden">
                <div className="flex-1 flex flex-col space-y-6 overflow-y-auto no-scrollbar pr-1">
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <Code size={12} className="text-primary" /> Markup Output
                            </h3>
                            {result && (
                                <button onClick={onCopy} className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 transition-all uppercase tracking-widest border", copied ? "bg-emerald-500 text-white border-emerald-500" : "bg-card text-primary border-primary/20 hover:border-primary/50")}>
                                    {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy Snippet'}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 bg-card rounded-2xl border border-border p-6 font-mono text-[11px] text-primary overflow-auto shadow-inner relative group">
                            {result ? (
                                <div className="animate-in fade-in duration-300">
                                    <pre className="whitespace-pre-wrap break-all leading-relaxed opacity-90">{result}</pre>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 gap-3">
                                    <p className="font-black text-[9px] uppercase tracking-[0.2em] text-center">Awaiting Data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

