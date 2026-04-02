"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Activity, Clock, ArrowRight, BrainCircuit } from 'lucide-react';
import { ApiMatch } from '@/lib/tools/cricket/cache';
import { Link } from '@/navigation';

import MatchCountdown from './MatchCountdown';

interface Props { matches: ApiMatch[]; }

export default function IPLTicker({ matches }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const iplMatches = matches.filter(m => 
        m.league_key === '745' || 
        m.league_name?.toLowerCase().includes('ipl') || 
        (m.league_name?.toLowerCase().includes('premier league') && m.league_name?.toLowerCase().includes('indian'))
    ).filter(m => m.event_status !== 'Finished').slice(0, 10);

    if (!isMounted || iplMatches.length === 0) return null;

    return (
        <div className="w-full bg-[#f8fafc] pb-0 pt-4 overflow-visible">
             {/* Ticker Cards Container (Manual Scroll) */}
             <div className="relative group">
                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 snap-x scroll-smooth scrollbar-hide px-[max(1rem,calc((100vw-1024px)/2+1rem))]">
                    {iplMatches.map((match) => (
                        <Link 
                            key={match.event_key} 
                            href={`/tools/cricket/${match.event_key}`}
                            className="min-w-[240px] md:min-w-[270px] shrink-0 bg-white border border-slate-100 rounded-2xl p-4 snap-start shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group/card relative overflow-hidden"
                        >
                            {/* Card Background Decoration */}
                            <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#ef4123]/5 rounded-full blur-xl group-hover/card:bg-[#ef4123]/10 transition-colors" />
                            
                            {/* Compact Card Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-0.5">
                                    <div className="text-[9px] font-black text-[#ef4123] uppercase tracking-widest flex items-center gap-1">
                                        <Activity size={10} className={match.event_live === '1' ? 'animate-pulse' : ''} />
                                        {match.event_live === '1' ? 'Live' : 'Upcoming'}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        {new Date(match.event_date_start).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="bg-slate-50 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        {match.event_time}
                                    </div>
                                    {match.event_live !== '1' && (
                                        <MatchCountdown startDate={match.event_date_start} startTime={match.event_time} />
                                    )}
                                </div>
                            </div>

                            {/* Compact Score Area */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover/card:border-red-100 transition-colors">
                                            {match.event_home_team_logo ? <img src={match.event_home_team_logo} className="w-full h-full object-contain" alt="" /> : <Trophy size={12} className="text-slate-200" />}
                                        </div>
                                        <span className="text-[11px] font-black text-slate-700 uppercase italic truncate max-w-[85px]">{match.event_home_team}</span>
                                    </div>
                                    <span className="text-base font-black text-slate-900">{match.event_home_final_result}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover/card:border-red-100 transition-colors">
                                            {match.event_away_team_logo ? <img src={match.event_away_team_logo} className="w-full h-full object-contain" alt="" /> : <Trophy size={12} className="text-slate-200" />}
                                        </div>
                                        <span className="text-[11px] font-black text-slate-700 uppercase italic truncate max-w-[85px]">{match.event_away_team}</span>
                                    </div>
                                    <span className="text-base font-black text-slate-900">{match.event_away_final_result}</span>
                                </div>
                            </div>

                            {/* Compact Card Footer */}
                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover/card:text-[#ef4123] transition-colors">
                                    <BrainCircuit size={12} /> AI Analyst
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover/card:bg-[#ef4123] group-hover/card:text-white transition-all text-slate-300">
                                    <ArrowRight size={12} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
             </div>

             <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
             `}</style>
        </div>
    );
}
