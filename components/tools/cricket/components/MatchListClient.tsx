"use client";
import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Zap, Trophy, Activity, Ticket, MapPin, BrainCircuit } from 'lucide-react';
import { Link } from '@/navigation';
import { ApiMatch } from '@/lib/tools/cricket/cache';
import { formatTime, formatMatchDate } from '@/lib/tools/cricket/utils';

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
        <div className="text-[9px] font-black text-[#D11414] tracking-widest mt-1 flex items-center gap-1 opacity-80">
            <span className="w-1 h-1 rounded-full bg-[#D11414] animate-pulse" />
            {timeLeft}
        </div>
    );
}

interface Props { matches: ApiMatch[]; }

export default function MatchListClient({ matches }: Props) {
    const [filter, setFilter] = useState<'upcoming' | 'finished' | 'live'>('upcoming');

    const now = new Date();
    const filteredAll = matches.filter(m => {
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
        <div className="w-full">
            {/* Filter Tabs - Matching Schedule Style Strip */}
            <div className="flex justify-center border-b border-slate-200 mb-6 bg-white overflow-x-auto scrollbar-hide">
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

            {/* List - Direct Table Rows like Schedule Page */}
            <div className="bg-white border-t border-slate-100 divide-y divide-slate-100">
                {filteredAll.map((match, idx) => {
                    const { month, weekday, day } = formatMatchDate(match.event_date_start);
                    const isLive = match.event_live === '1' || match.event_status === 'In Progress';
                    const isUpcoming = !isLive && match.event_status !== 'Finished';
                    
                    return (
                        <div key={match.event_key} className="group hover:bg-slate-50/70 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-stretch min-h-[90px]">
                                
                                {/* 1. LEFT: MATCH # + DATE (Matches SchedulePage Width) */}
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
                                            {formatTime(match.event_time, match.event_date_start)}
                                        </div>
                                        {isUpcoming && <MatchCountdown startDate={match.event_date_start} startTime={match.event_time} />}
                                    </div>
                                </div>

                                {/* 2. CENTER: VENUE + TEAMS (Matches SchedulePage Center) */}
                                <div className="flex-1 p-4 flex flex-col justify-center space-y-2 lg:border-r border-slate-100">
                                    <div className="flex items-center gap-1 text-[10px] text-[#D11414] font-black uppercase tracking-tight italic">
                                        <MapPin size={10} className="shrink-0" />
                                        <span className="truncate">{match.event_stadium || 'Wait for Stadium TBA'}</span>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
                                        <div className="flex items-center justify-between md:justify-start md:gap-4 flex-1">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover:scale-110 transition-transform flex-shrink-0">
                                                    {match.event_home_team_logo ? <img src={match.event_home_team_logo} className="w-full h-full object-contain" alt="" /> : <Trophy size={14} className="text-slate-100" />}
                                                </div>
                                                <span className="text-[12px] md:text-sm font-black text-slate-700 uppercase italic truncate max-w-[140px] md:max-w-none">{match.event_home_team}</span>
                                            </div>
                                            {match.event_home_final_result && <span className="text-sm md:text-base font-black text-slate-900">{match.event_home_final_result}</span>}
                                        </div>

                                        <div className="hidden md:block text-[9px] font-black text-slate-200 uppercase tracking-widest italic shrink-0">V/S</div>
                                        <div className="md:hidden flex items-center gap-2 opacity-30">
                                            <div className="h-px flex-1 bg-slate-300" />
                                            <span className="text-[8px] font-black text-slate-400">V/S</span>
                                            <div className="h-px flex-1 bg-slate-300" />
                                        </div>

                                        <div className="flex items-center justify-between md:justify-start md:gap-4 flex-1">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover:scale-110 transition-transform flex-shrink-0">
                                                    {match.event_away_team_logo ? <img src={match.event_away_team_logo} className="w-full h-full object-contain" alt="" /> : <Trophy size={14} className="text-slate-100" />}
                                                </div>
                                                <span className="text-[12px] md:text-sm font-black text-slate-700 uppercase italic truncate max-w-[140px] md:max-w-none">{match.event_away_team}</span>
                                            </div>
                                            {match.event_away_final_result && <span className="text-sm md:text-base font-black text-slate-900">{match.event_away_final_result}</span>}
                                        </div>
                                    </div>

                                    {/* Match Yet to Begin Badge */}
                                    <div className="mt-1 flex items-center gap-2">
                                        <div className={`px-3 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                            isLive ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-orange-50 text-orange-600 border-orange-200'
                                        }`}>
                                            {isLive ? 'Live Now' : 'Match yet to begin'}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. RIGHT: CTA (Slanted AI Preview Button) */}
                                <div className="w-full lg:w-48 p-4 flex items-center justify-center lg:justify-end gap-3">
                                    <Ticket size={20} className="text-slate-100 hover:text-[#D11414] transition-colors cursor-pointer hidden xl:block" />
                                    <Link 
                                        href={`/tools/cricket/${match.slug || match.event_key}`}
                                        className="relative flex items-center justify-center min-w-[145px] px-6 h-9 group/btn"
                                    >
                                        <div 
                                            className="absolute inset-0 bg-[#D11414] group-hover/btn:bg-[#B11414] transition-all duration-300 shadow-sm"
                                            style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
                                        />
                                        <div className="relative z-10 flex items-center gap-1.5 text-white">
                                            <Zap size={11} className="group-hover/btn:rotate-12 transition-transform" />
                                            <span className="text-[9px] font-black uppercase tracking-widest italic pt-0.5">
                                                AI PREDICTIONS
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Summary Strip */}
            <div className="mt-8 bg-slate-50 p-4 border rounded-xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-14">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <BrainCircuit size={14} className="text-[#D11414]" /> Neural Analysis Engine Active
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Activity size={14} className="text-[#D11414]" /> Real-time Probabilities Live
                </div>
            </div>
        </div>
    );
}
