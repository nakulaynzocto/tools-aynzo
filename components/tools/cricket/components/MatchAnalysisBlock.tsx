"use client";
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Zap, Trophy, Shield, Target, TrendingUp, Info, Star, Medal, History } from 'lucide-react';
import { marked } from 'marked';

interface TopPlayer {
    name: string;
    team: string;
    role: string;
    record: string;
    score: number;
}

interface AnalysisData {
    reasoning: string;
    outcome: string;
    fullArticle: string;
    topPlayers?: TopPlayer[];
    stats: {
        pitchBehavior: string;
        battingPct: number;
        bowlingPct: number;
        avgScore: number;
        winProb: number;
        temp: number;
        humidity: number;
        windSpeed: number;
    }
}

export default function MatchAnalysisBlock({ match, initialData }: { match: any, initialData?: AnalysisData }) {
    const [loading, setLoading] = useState(!initialData);
    const [analysis, setAnalysis] = useState<AnalysisData | null>(initialData || null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (initialData) return; // Skip fetch if we have server data
        async function fetchAnalysis() {
            try {
                const res = await fetch('/api/cricket/stream-blog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ matchData: match })
                });
                
                if (!res.ok) throw new Error('Failed to fetch');
                
                const data = await res.json();
                setAnalysis(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalysis();
    }, [match.event_key]);

    if (loading) {
        return (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center space-y-8 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
                    <div className="relative z-10 w-24 h-24 bg-red-50 text-[#ef4123] rounded-full flex items-center justify-center shadow-inner">
                        <Loader2 size={48} className="animate-spin" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest italic">Aynzo Neural Scan in Progress</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase max-w-[320px] leading-relaxed tracking-wider">
                        Mining 2026 telemetry and historical player records using dual OpenRouter clusters.
                    </p>
                </div>
            </div>
        );
    }

    const rawHtml = analysis?.fullArticle ? marked.parse(analysis.fullArticle) : '';
    const htmlContent = String(rawHtml).replace(/^\s*<h1[^>]*>.*?<\/h1>/i, '').trim();

    return (
        <div className="space-y-8 px-1">
            {/* 1. TOP STATS BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Win Probability', val: (analysis?.stats?.winProb || 55) + '%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pitch Map', val: analysis?.stats?.pitchBehavior || 'Balanced', icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Projected Avg', val: analysis?.stats?.avgScore || '178', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Neural Alpha', val: 'V8.04', icon: BrainCircuit, color: 'text-[#ef4123]', bg: 'bg-red-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:scale-[1.02] transition-all hover:shadow-md">
                        <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center mb-3 transition-colors`}>
                            <s.icon size={18} className={s.color} />
                        </div>
                        <span className="text-sm font-black text-slate-800 uppercase italic leading-none">{s.val}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-2">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* 2. TOP 10 PLAYERS & RECORDS SECTION */}
            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
                        <Medal size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-wider leading-none">Top 10 Performers & Records</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Elite Match-up Statistics & Recent Form</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(analysis?.topPlayers || []).map((p, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-slate-50 group hover:bg-white hover:border-red-100 hover:shadow-sm transition-all">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-300 font-black text-[10px] shadow-sm shrink-0 border border-slate-50 group-hover:text-[#ef4123]">
                                #{idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-xs font-black text-slate-800 uppercase truncate">{p.name}</h4>
                                    <span className="text-[8px] font-black bg-white px-2 py-0.5 rounded-full border border-slate-100 text-slate-400 uppercase shrink-0">{p.role}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <History size={10} className="text-[#ef4123]" />
                                    <p className="text-[9px] font-bold text-slate-500 line-clamp-1">{p.record}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0 pl-2">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                    <Star size={8} fill="currentColor" />
                                    <span className="text-[10px] font-black italic">{p.score}</span>
                                </div>
                                <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">Neural Rank</span>
                            </div>
                        </div>
                    ))}
                    {(!analysis?.topPlayers || analysis.topPlayers.length === 0) && (
                        <div className="col-span-full py-10 text-center space-y-2">
                            <Trophy size={32} className="mx-auto text-slate-200" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Player Records Synthesis Pending...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. MAIN ANALYSIS CONTENT - MATCHING BLOG DETAIL DESIGN */}
            <div className="bg-white border border-border/40 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border/40 bg-secondary/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#ef4123] border border-slate-50">
                            <BrainCircuit size={20} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase italic tracking-wider leading-none">Intelligence Deep Dive</h3>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Ready for Analysis</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* BLOG-ALIGNED TYPOGRAPHY DESIGN */}
                <div className="p-6 md:p-14 bg-white">
                    <div 
                        className="content-body max-w-none selection:bg-primary/20"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>

                <div className="p-8 bg-slate-900 border-t border-white/5 flex items-center gap-6">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#ef4123] shrink-0 border border-white/10">
                        <Info size={18} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Operational Disclaimer</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-wider leading-relaxed">
                            This report utilizes OpenRouter Neural Clusters for high-fidelity T20 simulations. 
                            AI predictions are for analytical purposes and do not guarantee outcomes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
