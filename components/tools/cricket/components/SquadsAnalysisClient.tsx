"use client";
import React, { useState } from 'react';
import { User, Zap, MessageCircleWarning, ArrowDownNarrowWide, LayoutGrid, List } from 'lucide-react';

interface Player {
    name: string;
    image?: string;
    score: number;
    isXI: boolean;
    form: string;
}

interface Props {
    homeTeam: { name: string; logo?: string; players: Player[] };
    awayTeam: { name: string; logo?: string; players: Player[] };
    isIPL?: boolean;
}

export default function SquadsAnalysisClient({ homeTeam, awayTeam, isIPL }: Props) {
    const [sortBy, setSortBy] = useState<'score' | 'form' | 'alpha'>('score');

    const sortPlayers = (players: Player[]) => {
        return [...players].sort((a, b) => {
            if (sortBy === 'score') return b.score - a.score;
            if (sortBy === 'form') return parseFloat(b.form) - parseFloat(a.form);
            return a.name.localeCompare(b.name);
        });
    };

    const sortedHome = sortPlayers(homeTeam.players);
    const sortedAway = sortPlayers(awayTeam.players);

    const PlayerRow = ({ p }: { p: Player }) => (
        <div key={p.name} className="p-3 hover:bg-slate-50/70 transition-colors flex items-center gap-3 group">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                ) : (
                    <User size={14} className="text-slate-400" />
                )}
                {!p.isXI && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                        <span className="text-[6px] text-white font-black leading-none uppercase">
                            {isIPL ? 'SUB' : 'BNCH'}
                        </span>
                    </div>
                )}
             </div>
             <div className="flex-1 min-w-0">
                <div className="text-[11px] font-black text-slate-800 uppercase italic truncate flex items-center gap-1.5">
                    {p.name}
                    {p.isXI && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-0.5 bg-slate-100 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-800/60" style={{ width: p.score+'%' }} />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 italic shrink-0">{p.score}%</span>
                </div>
             </div>
             <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-0.5 text-[#D11414]">
                    <Zap size={9} fill="currentColor" /><span className="text-[11px] font-black italic">{p.form}</span>
                </div>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight">FORM</span>
             </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Sorting Controls */}
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                    <ArrowDownNarrowWide size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sort Analysis:</span>
                </div>
                <div className="flex gap-2">
                    {[
                        { id: 'score', label: 'Efficiency' },
                        { id: 'form', label: 'Form Index' },
                        { id: 'alpha', label: 'Player Name' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSortBy(tab.id as any)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                                sortBy === tab.id 
                                ? 'bg-slate-900 text-white shadow-lg' 
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: HOME */}
                <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-[300px]">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                            {homeTeam.logo && <img src={homeTeam.logo} className="w-6 h-6 object-contain" alt="" />}
                            <h3 className="text-[11px] font-black text-slate-800 uppercase italic leading-none">{homeTeam.name}</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-400">{sortedHome.length} Players</span>
                    </div>
                    {sortedHome.length > 0 ? (
                        <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto scrollbar-hide">
                            {sortedHome.map((p) => <PlayerRow key={p.name} p={p} />)}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-3 opacity-40">
                             <MessageCircleWarning size={32} className="text-slate-300" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-normal">Lineups TBA<br/>Wait for Toss Analysis</p>
                        </div>
                    )}
                </div>

                {/* Right: AWAY */}
                <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-[300px]">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                            {awayTeam.logo && <img src={awayTeam.logo} className="w-6 h-6 object-contain" alt="" />}
                            <h3 className="text-[11px] font-black text-slate-800 uppercase italic leading-none">{awayTeam.name}</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-400">{sortedAway.length} Players</span>
                    </div>
                    {sortedAway.length > 0 ? (
                        <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto scrollbar-hide">
                            {sortedAway.map((p) => <PlayerRow key={p.name} p={p} />)}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-3 opacity-40">
                             <MessageCircleWarning size={32} className="text-slate-300" />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-normal">Lineups TBA<br/>Wait for Toss Analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
