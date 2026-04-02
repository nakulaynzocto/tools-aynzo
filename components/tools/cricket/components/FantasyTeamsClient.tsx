"use client";
import React, { useState, useMemo } from 'react';
import { Trophy, Zap, Shield, Target, BrainCircuit, Star, ChevronRight, ChevronDown, User, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Player {
    name: string;
    image?: string;
    score: number;
    isXI: boolean;
    form: string;
    role?: string;
}

interface TeamProps {
    homeTeam: { name: string; logo?: string; players: Player[] };
    awayTeam: { name: string; logo?: string; players: Player[] };
}

export default function FantasyTeamsClient({ homeTeam, awayTeam }: TeamProps) {
    const [selectedTeamTab, setSelectedTeamTab] = useState(0);

    const allPlayers = useMemo(() => {
        return [
            ...homeTeam.players.map(p => ({ ...p, team: homeTeam.name, logo: homeTeam.logo })),
            ...awayTeam.players.map(p => ({ ...p, team: awayTeam.name, logo: awayTeam.logo }))
        ].sort((a, b) => {
            if (a.isXI && !b.isXI) return -1;
            if (!a.isXI && b.isXI) return 1;
            return b.score - a.score;
        });
    }, [homeTeam, awayTeam]);

    const teams = useMemo(() => {
        if (allPlayers.length < 11) return [];
        
        const generated = [];

        // Helper to get roles correctly
        const playersWithRoles = allPlayers.map(p => ({
            ...p,
            normalizedRole: (p.role || '').toLowerCase().includes('wk') || (p.role || '').toLowerCase().includes('keeper') ? 'WK' :
                            (p.role || '').toLowerCase().includes('all') ? 'AR' :
                            (p.role || '').toLowerCase().includes('bowl') ? 'BOWL' : 'BAT'
        }));

        // 1. SAFE TEAM (H2H - Top Performers)
        const safePlayers = playersWithRoles.slice(0, 11);
        generated.push({
            name: "SAFE TEAM (H2H)",
            type: "Safe",
            desc: "Best for head-to-head and small leagues. High reliability.",
            players: safePlayers,
            captain: safePlayers[0],
            vc: safePlayers[1],
            color: "border-blue-500",
            bg: "bg-blue-50"
        });

        // 2. BALANCED (Medium Risk)
        const balancedPlayers = [
            ...playersWithRoles.slice(0, 7),
            ...playersWithRoles.slice(11, 15)
        ].slice(0, 11);
        generated.push({
            name: "BALANCED (Medium)",
            type: "Medium",
            desc: "Balanced mix of stars and finishers. Good for 3-4 member leagues.",
            players: balancedPlayers,
            captain: balancedPlayers[2],
            vc: balancedPlayers[0],
            color: "border-emerald-500",
            bg: "bg-emerald-50"
        });

        // 3. RISKY (Grand League)
        const riskyPlayers = [
            playersWithRoles[0],
            playersWithRoles[3],
            playersWithRoles[5],
            ...playersWithRoles.slice(15, 23)
        ].slice(0, 11);
        generated.push({
            name: "GRAND LEAGUE (Risky)",
            type: "Risky",
            desc: "High risk high reward. Focuses on potential game-changers.",
            players: riskyPlayers,
            captain: riskyPlayers[7] || riskyPlayers[0],
            vc: riskyPlayers[1],
            color: "border-amber-500",
            bg: "bg-amber-50"
        });

        // 4. MEGA CONTEST SPECIAL
        const megaPlayers = [
            ...playersWithRoles.slice(2, 8),
            ...playersWithRoles.slice(12, 17)
        ].slice(0, 11);
        generated.push({
            name: "MEGA CONTEST",
            type: "Medium",
            desc: "Experimental combo for large pools. Low competition picks.",
            players: megaPlayers,
            captain: megaPlayers[5],
            vc: megaPlayers[0],
            color: "border-purple-500",
            bg: "bg-purple-50"
        });

        // 5. UNDERDOG SPECIAL
        const underdogPlayers = [
            ...playersWithRoles.slice(8, 16),
            ...playersWithRoles.slice(0, 3)
        ].slice(0, 11);
        generated.push({
            name: "UNDERDOG SPECIAL",
            type: "Risky",
            desc: "Unique combination for those who want to beat the crowd.",
            players: underdogPlayers,
            captain: underdogPlayers[0],
            vc: underdogPlayers[10],
            color: "border-[#D11414]",
            bg: "bg-red-50"
        });

        return generated;
    }, [allPlayers]);

    if (teams.length === 0) return null;

    const currentTeam = teams[selectedTeamTab];

    // Group current team by role for the field view
    const fieldRoles = [
        { label: 'WICKET-KEEPER', players: (currentTeam?.players || []).filter((p: any) => p.normalizedRole === 'WK') },
        { label: 'BATTERS', players: (currentTeam?.players || []).filter((p: any) => p.normalizedRole === 'BAT') },
        { label: 'ALL-ROUNDERS', players: (currentTeam?.players || []).filter((p: any) => p.normalizedRole === 'AR') },
        { label: 'BOWLERS', players: (currentTeam?.players || []).filter((p: any) => p.normalizedRole === 'BOWL') }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8 border-b border-slate-50 pb-6 md:pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-red-50 text-[#D11414] rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/10">
                            <BrainCircuit size={24} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Fantasy Teams</h2>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest md:tracking-[0.2em] truncate">Neural Picks: Safe, Balanced & GL Combinations</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {teams.map((t, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedTeamTab(idx)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                                    selectedTeamTab === idx 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-105" 
                                        : "bg-white border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {t.type} {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Team Info Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className={cn("p-6 rounded-[2.5rem] border-2 shadow-sm transition-all relative overflow-hidden", currentTeam.color, currentTeam.bg)}>
                            <div className="relative z-10">
                                <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4 inline-block">
                                    {currentTeam.type} Strategy active
                                </span>
                                <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none truncate">{currentTeam.name}</h3>
                                <p className="text-xs font-bold text-slate-500 mt-3 leading-relaxed">
                                    {currentTeam.desc}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900 p-5 rounded-[2rem] text-center shadow-lg relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Star size={40} className="text-amber-400" />
                                </div>
                                <div className="relative z-10">
                                    <span className="w-6 h-6 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black mx-auto mb-3">C</span>
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-tight">Captain</p>
                                    <h4 className="text-xs font-black text-white uppercase italic mt-1 truncate">{currentTeam.captain.name}</h4>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-5 rounded-[2rem] text-center shadow-lg relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap size={40} className="text-blue-400" />
                                </div>
                                <div className="relative z-10">
                                    <span className="w-6 h-6 bg-blue-400 text-white rounded-lg flex items-center justify-center text-[10px] font-black mx-auto mb-3">VC</span>
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-tight">Vice Captain</p>
                                    <h4 className="text-xs font-black text-white uppercase italic mt-1 truncate">{currentTeam.vc.name}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Players Field View Column */}
                    <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[600px] border-4 border-slate-800">
                        {/* Stadium/Pitch Background */}
                        <div className="absolute inset-0 bg-[#386641] opacity-90">
                            {/* Grass Patterns */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 50px, transparent 50px, transparent 100px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-white/10 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] border border-white/5 rounded-full" />
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between py-10 px-4">
                            {/* Distribution of 11 players across field layers (generic positions) */}
                            {fieldRoles.map((row, rowIdx) => (
                                <div key={rowIdx} className="space-y-2">
                                    <div className="flex justify-center gap-2 md:gap-6 flex-wrap">
                                        {row.players.map((p: any, pIdx: number) => (
                                            <div key={pIdx} className="flex flex-col items-center group cursor-default">
                                                <div className="relative mb-1">
                                                    {/* Player Avatar */}
                                                    <div className={cn(
                                                        "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-110 overflow-hidden",
                                                        (homeTeam.name === p.team || p.team === 'HOME') ? "bg-white border-white text-slate-800" : "bg-slate-800 border-slate-700 text-white"
                                                    )}>
                                                        {p.image ? (
                                                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <User size={20} />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Captain/VC Badge */}
                                                    {(p.name === currentTeam.captain.name || p.name === currentTeam.vc.name) && (
                                                        <div className={cn(
                                                            "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-900 text-white shadow-xl z-20",
                                                            p.name === currentTeam.captain.name ? "bg-amber-500" : "bg-blue-500"
                                                        )}>
                                                            {p.name === currentTeam.captain.name ? "C" : "VC"}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Player Name Tag (Authentic Look) */}
                                                <div className="flex flex-col items-center">
                                                    <div className={cn(
                                                        "px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase tracking-tight shadow-sm whitespace-nowrap",
                                                        (homeTeam.name === p.team || p.team === 'HOME') ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                                                    )}>
                                                        {p.name.split(' ').slice(-1)[0]}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Zap size={8} className="text-amber-400 fill-amber-400" />
                                                        <span className="text-[7px] font-black text-white/80">{p.form}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Field Overlay Info */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white border border-slate-200" />
                                    <span className="text-[8px] font-black text-white/50 uppercase">{homeTeam.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
                                    <span className="text-[8px] font-black text-white/50 uppercase">{awayTeam.name}</span>
                                </div>
                            </div>
                            <div className="bg-black/50 backdrop-blur-md px-3 py-1 transparent rounded-lg flex items-center gap-2">
                                <BrainCircuit size={12} className="text-[#D11414]" />
                                <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Neural Field View</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
