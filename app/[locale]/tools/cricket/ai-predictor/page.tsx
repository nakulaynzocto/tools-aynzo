"use client";
import React, { useState, useEffect } from 'react';
import { Zap, Trophy, TrendingUp, BarChart2, Star, Shield, PlayCircle, Users, ArrowRight, BrainCircuit, Clock, Target, MapPin, Ticket, Activity } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/utils/cn';
import CricketTabHeader from '@/components/tools/cricket/components/CricketTabHeader';

// Helper functions matching MatchListClient
function formatTime(time: string) {
    try {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true
        }).toLowerCase() + ' IST';
    } catch { return time; }
}

function formatMatchDate(dateStr: string) {
    try {
        const d = new Date(dateStr);
        const month = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
        const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase();
        const day = d.getDate();
        return { month, weekday, day };
    } catch { return { month: 'APR', weekday: 'WED', day: '1' }; }
}

function MatchCountdown({ startDate, startTime }: { startDate: string, startTime: string }) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    useEffect(() => {
        const calculate = () => {
            try {
                const [h, m] = startTime.split(':');
                const target = new Date(startDate);
                target.setUTCHours(parseInt(h), parseInt(m), 0, 0);
                const diff = target.getTime() - new Date().getTime();
                if (diff <= 0) return '00:00:00';
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / 1000 / 60) % 60);
                const secs = Math.floor((diff / 1000) % 60);
                const parts = [];
                if (days > 0) parts.push(`${days}d`);
                parts.push(`${String(hours).padStart(2, '0')}h`);
                parts.push(`${String(mins).padStart(2, '0')}m`);
                parts.push(`${String(secs).padStart(2, '0')}s`);
                return parts.join(' ');
            } catch { return ''; }
        };
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        setTimeLeft(calculate());
        return () => clearInterval(timer);
    }, [startDate, startTime]);
    if (!timeLeft) return null;
    return (
        <div className="text-[9px] font-black text-[#D11414] tracking-widest mt-1 flex items-center gap-1 opacity-80 uppercase italic">
            <span className="w-1 h-1 rounded-full bg-[#D11414] animate-pulse" /> {timeLeft}
        </div>
    );
}

export default function AIPredictorPage() {
    const [matches, setMatches] = useState<any[]>([]);
    const [filter, setFilter] = useState<'upcoming' | 'live' | 'finished'>('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetch('/api/cricket/matches');
            if (res.ok) {
                const data = await res.json();
                // Filter for IPL only for AI Predictor
                const ipl = data.filter((m: any) => 
                    m.league_key === '745' || 
                    m.league_name?.toLowerCase().includes('ipl') || 
                    (m.league_name?.toLowerCase().includes('premier league') && m.league_name?.toLowerCase().includes('indian'))
                );
                setMatches(ipl);
            }
            setLoading(false);
        }
        load();
    }, []);

    const now = new Date();
    const filteredMatches = matches.filter(m => {
        const isLive = m.event_live === '1' || m.event_status === 'In Progress' || m.event_status === 'Live';
        try {
            const [hours, minutes] = (m.event_time || '00:00').split(':');
            const target = new Date(m.event_date_start);
            target.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
            const isFinished = m.event_status === 'Finished' || (target < now && !isLive);
            if (filter === 'live') return isLive;
            if (filter === 'upcoming') return !isFinished && !isLive;
            return isFinished;
        } catch { 
            if (filter === 'live') return isLive;
            if (filter === 'upcoming') return m.event_status !== 'Finished' && !isLive;
            return m.event_status === 'Finished';
        }
    });

    return (
        <div className="space-y-4 pb-20 bg-[#f8fafc] min-h-screen">
            <CricketTabHeader 
                title="AI PREDICTIONS" 
                currentTab="ai-picks" 
            />

            <div className="max-w-5xl mx-auto px-4 space-y-6">
                {/* Filter Tabs - EXACT MATCH to Landing Page */}
                <div className="flex justify-center border-b border-slate-200 mb-6 bg-white overflow-x-auto scrollbar-hide rounded-2xl md:rounded-3xl shadow-sm">
                    <div className="flex gap-10 shrink-0 px-4">
                        {['upcoming', 'live', 'finished'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab as any)}
                                className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                                    filter === tab ? 'text-[#D11414]' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {tab}
                                {filter === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D11414]" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Match Table - Row by Row */}
                <div className="bg-white border-t border-slate-100 divide-y divide-slate-100 rounded-3xl overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <BrainCircuit className="animate-spin text-[#D11414]" size={40} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Syncing Neural Grid...</span>
                        </div>
                    ) : filteredMatches.length === 0 ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><Trophy size={32} /></div>
                            <h3 className="text-sm font-black text-slate-800 uppercase italic">No Matches Found</h3>
                            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest leading-none">Neural scanner returning empty for current filter.</p>
                        </div>
                    ) : (
                        filteredMatches.map((match, idx) => {
                            const { month, weekday, day } = formatMatchDate(match.event_date_start);
                            const isLiveMatch = match.event_live === '1' || match.event_status === 'In Progress';
                            const isUpcomingMatch = !isLiveMatch && match.event_status !== 'Finished';
                            
                            return (
                                <div key={match.event_key} className="group hover:bg-slate-50/70 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-stretch min-h-[90px]">
                                        
                                        {/* LEFT: MATCH # + DATE */}
                                        <div className="w-full lg:w-40 shrink-0 lg:border-r border-slate-100 p-4 flex flex-row lg:flex-col justify-center lg:items-start items-center gap-4 lg:gap-0">
                                            <div className="inline-flex items-center border border-[#D11414] text-[#D11414] text-[8px] font-black uppercase px-1.5 py-0.5 rounded mb-1.5 w-fit bg-white">
                                                MATCH {idx + 1}
                                            </div>
                                            <div className="flex flex-col lg:items-start items-center">
                                                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                                                    {weekday}, {month} {day}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-0.5 font-bold italic">
                                                    <Clock size={10} className="shrink-0" />
                                                    {formatTime(match.event_time)}
                                                </div>
                                                {isUpcomingMatch && <MatchCountdown startDate={match.event_date_start} startTime={match.event_time} />}
                                            </div>
                                        </div>

                                        {/* CENTER: VENUE + TEAMS */}
                                        <div className="flex-1 p-4 flex flex-col justify-center space-y-2 lg:border-r border-slate-100">
                                            <div className="flex items-center gap-1 text-[10px] text-[#D11414] font-black uppercase tracking-tight italic">
                                                <MapPin size={10} className="shrink-0" />
                                                <span className="truncate">{match.event_stadium || 'Wait for Stadium TBA'}</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-center md:justify-start gap-4 md:gap-10">
                                                <div className="flex items-center gap-2 md:gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover:scale-110 transition-transform">
                                                        {match.event_home_team_logo ? <img src={match.event_home_team_logo} className="w-full h-full object-contain" alt="" /> : <Trophy size={14} className="text-slate-100" />}
                                                    </div>
                                                    <span className="text-[11px] md:text-sm font-black text-slate-700 uppercase italic truncate max-w-[120px]">{match.event_home_team}</span>
                                                    {match.event_home_final_result && <span className="text-base font-black text-slate-900">{match.event_home_final_result}</span>}
                                                </div>

                                                <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest italic grow-0 shrink-0">V/S</span>

                                                <div className="flex items-center gap-2 md:gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover:scale-110 transition-transform">
                                                        {match.event_away_team_logo ? <img src={match.event_away_team_logo} className="w-full h-full object-contain" alt="" /> : <Trophy size={14} className="text-slate-100" />}
                                                    </div>
                                                    <span className="text-[11px] md:text-sm font-black text-slate-700 uppercase italic truncate max-w-[120px]">{match.event_away_team}</span>
                                                    {match.event_away_final_result && <span className="text-base font-black text-slate-900">{match.event_away_final_result}</span>}
                                                </div>
                                            </div>

                                            <div className="mt-1 flex items-center gap-2">
                                                <div className={`px-3 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                                    isLiveMatch ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-orange-50 text-orange-600 border-orange-200'
                                                }`}>
                                                    {isLiveMatch ? 'Live Now' : 'Match yet to begin'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT: CTA (Slanted AI Preview Button) */}
                                        <div className="w-full lg:w-48 p-4 flex items-center justify-center lg:justify-end gap-3">
                                            <Ticket size={20} className="text-slate-100 hover:text-[#D11414] transition-colors cursor-pointer hidden xl:block" />
                                            <Link 
                                                href={`/tools/cricket/${match.event_key}`}
                                                className="relative flex items-center justify-center min-w-[110px] h-9 group/btn"
                                            >
                                                <div 
                                                    className="absolute inset-0 bg-[#D11414] group-hover/btn:bg-[#B11414] transition-all duration-300 shadow-sm"
                                                    style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                                                />
                                                <div className="relative z-10 flex items-center gap-1.5 text-white">
                                                    <Zap size={11} className="group-hover/btn:rotate-12 transition-transform" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest italic pt-0.5">
                                                        AI Preview
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* AI Footer Summary Strip */}
                <div className="bg-white p-6 border rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-4 md:gap-14 shadow-sm">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <BrainCircuit size={14} className="text-[#D11414]" /> Neural Analysis Engine Active
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Activity size={14} className="text-[#D11414]" /> 10k+ Sessions Simulated
                    </div>
                </div>
            </div>
        </div>
    );
}
