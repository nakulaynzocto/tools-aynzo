"use client";
import { MapPin, Clock, Zap, ChevronDown, Filter, ArrowRight, Calendar } from 'lucide-react';
import { Link } from '@/navigation';
import { useState } from 'react';
import { ApiMatch } from '@/lib/tools/cricket/cache';
import { formatMatchDate, formatTime } from '@/lib/tools/cricket/utils';
import CricketTabHeader from './CricketTabHeader';

type FilterTab = 'fixtures' | 'results' | 'live';

function groupByDate(matches: ApiMatch[]) {
    const groups: Record<string, ApiMatch[]> = {};
    matches.forEach(m => {
        const key = m.event_date_start || 'TBA';
        if (!groups[key]) groups[key] = [];
        groups[key].push(m);
    });
    return groups;
}

interface Props { 
    matches: ApiMatch[]; 
    heroMatch?: ApiMatch | null;
}

export default function ScheduleClient({ matches, heroMatch }: Props) {
    const [activeTab, setActiveTab] = useState<FilterTab>('fixtures');

    // ONLY SHOW IPL MATCHES ON THE SCHEDULE PAGE
    const iplMatches = matches.filter(m => 
        m.league_key === '745' || 
        m.league_name?.toLowerCase().includes('ipl') || 
        (m.league_name?.toLowerCase().includes('premier league') && m.league_name?.toLowerCase().includes('indian'))
    );

    const filtered = iplMatches.filter(m => {
        const isCurrentlyLive = m.event_live === '1' || m.event_status === 'In Progress' || m.event_status === 'Live';
        if (activeTab === 'live')     return isCurrentlyLive;
        if (activeTab === 'results')  return m.event_status === 'Finished';
        // Fixtures show upcoming matches that are not currently live
        return m.event_status !== 'Finished' && !isCurrentlyLive;
    });

    const grouped = groupByDate(filtered);
    let matchCounter = 0;

    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            <CricketTabHeader 
                currentTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab)} 
                heroMatch={heroMatch}
            />


            {/* Match Listing */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {Object.keys(grouped).length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-xl border border-slate-200 mt-4">
                        <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-400">No matches found for this filter.</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([date, dateMatches]) => {
                        const { month, weekday, day } = formatMatchDate(date);
                        return (
                            <div key={date}>
                                {dateMatches.map((match, idx) => {
                                    matchCounter++;
                                    const num = matchCounter;
                                    const isLive = match.event_live === '1' || match.event_status === 'In Progress' || match.event_status === 'Live';
                                    return (
                                        <div key={match.event_key} className="group bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-stretch min-h-[90px] max-w-5xl">

                                                {/* Left: Match # + Date */}
                                                <div className="w-32 shrink-0 border-r border-slate-100 px-4 py-4 flex flex-col justify-center">
                                                    <div className="inline-flex items-center border border-[#D11414] text-[#D11414] text-[8px] font-black uppercase px-1.5 py-0.5 rounded mb-1.5 w-fit">
                                                        Match {num}
                                                    </div>
                                                    {idx === 0 && (
                                                        <div className="text-[11px] font-bold text-slate-700 leading-tight">
                                                            {weekday}, {month} {day}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
                                                        <Clock size={8} />
                                                        {formatTime(match.event_time, match.event_date_start)}
                                                    </div>
                                                </div>

                                                {/* Center: Venue + Teams */}
                                                <div className="flex-1 px-5 py-3 flex flex-col justify-center gap-2">
                                                    <div className="flex items-center gap-1 text-[9px] text-[#D11414] font-semibold">
                                                        <MapPin size={9} />
                                                        <span className="truncate">{match.event_stadium || 'Venue TBA'}</span>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                                                        <div className="flex items-center justify-between md:justify-start md:gap-4 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                {match.event_home_team_logo
                                                                    ? <img src={match.event_home_team_logo} alt={match.event_home_team} className="w-8 h-8 object-contain flex-shrink-0" />
                                                                    : <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">{match.event_home_team.substring(0,3)}</div>
                                                                }
                                                                <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{match.event_home_team}</span>
                                                            </div>
                                                            {match.event_home_final_result && (
                                                                <span className="text-sm font-black text-slate-900 ml-2">{match.event_home_final_result}</span>
                                                            )}
                                                        </div>

                                                        <div className="hidden md:block text-[10px] font-black text-slate-200 uppercase tracking-widest italic grow-0 shrink-0">V/S</div>
                                                        <div className="md:hidden flex items-center gap-2 opacity-30">
                                                            <div className="h-px flex-1 bg-slate-300" />
                                                            <span className="text-[8px] font-black text-slate-400">V/S</span>
                                                            <div className="h-px flex-1 bg-slate-300" />
                                                        </div>

                                                        <div className="flex items-center justify-between md:justify-start md:gap-4 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                {match.event_away_team_logo
                                                                    ? <img src={match.event_away_team_logo} alt={match.event_away_team} className="w-8 h-8 object-contain flex-shrink-0" />
                                                                    : <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">{match.event_away_team.substring(0,3)}</div>
                                                                }
                                                                <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{match.event_away_team}</span>
                                                            </div>
                                                            {match.event_away_final_result && (
                                                                <span className="text-sm font-black text-slate-900 ml-2">{match.event_away_final_result}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {match.event_status_info && (
                                                        <div className="text-[10px] font-bold text-red-600 bg-red-50/50 px-2 py-1 rounded w-fit">
                                                            {match.event_status_info}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: CTA */}
                                                <div className="w-40 shrink-0 border-l border-slate-100 px-4 flex items-center justify-end gap-2">
                                                    {isLive && (
                                                        <span className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full">
                                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                                            LIVE
                                                        </span>
                                                    )}
                                                    <Link
                                                        href={`/tools/cricket/${match.slug || match.event_key}`}
                                                        className="flex items-center gap-1.5 bg-[#D11414] hover:bg-[#b01010] text-white text-[10px] font-black px-6 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                                                    >
                                                        <Zap size={10} /> AI PREDICTIONS
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
