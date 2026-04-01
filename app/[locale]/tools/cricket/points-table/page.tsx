// SERVER COMPONENT — standings cached for 1 hour via unstable_cache
import { getCachedStandings, StandingRow } from '@/lib/tools/cricket/cache';
import { Trophy, Shield } from 'lucide-react';
import { cn } from '@/utils/cn';

import CricketTabHeader from '@/components/tools/cricket/components/CricketTabHeader';
import { getCachedMatches } from '@/lib/tools/cricket/cache';

export const revalidate = 3600;

export default async function PointsTablePage() {
    const table: StandingRow[] = await getCachedStandings();
    const matches = await getCachedMatches();
    const iplMatches = matches.filter(m => 
        m.league_key === '745' || 
        m.league_name?.toLowerCase().includes('ipl') || 
        (m.league_name?.toLowerCase().includes('premier league') && m.league_name?.toLowerCase().includes('indian'))
    );
    const heroMatch = iplMatches.find(m => m.event_status !== 'Finished');

    return (
        <div className="space-y-8 pb-10">
            <CricketTabHeader 
                title="POINTS TABLE" 
                currentTab="points-table" 
                heroMatch={heroMatch}
            />

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Pos</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">M</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">W</th>
                            <th className="px-6 py-5 text-[10px] font-black text-[#D11414] uppercase tracking-widest">Pts</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">NRR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {table.length > 0 ? table.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs italic",
                                        idx < 4
                                            ? "bg-red-50 text-[#D11414] border border-red-100 shadow-sm"
                                            : "bg-slate-50 text-slate-400 border border-slate-100"
                                    )}>
                                        {row.overall_league_position || idx + 1}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center font-black text-slate-800 text-xs shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                            {row.team_logo
                                                ? <img src={row.team_logo} alt={row.team_name} className="w-full h-full object-contain" />
                                                : row.team_name?.substring(0, 3).toUpperCase()
                                            }
                                        </div>
                                        <span className="text-xs font-black text-slate-800 uppercase italic tracking-tight">{row.team_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs font-bold text-slate-500">{row.overall_league_played}</td>
                                <td className="px-6 py-5 text-xs font-bold text-slate-500">{row.overall_league_W ?? '—'}</td>
                                <td className="px-6 py-5 text-sm font-black text-slate-800 italic">{row.overall_league_PTS ?? '—'}</td>
                                <td className={cn(
                                    "px-6 py-5 text-xs font-black italic",
                                    parseFloat(row.overall_league_NRR ?? '0') >= 0 ? "text-emerald-500" : "text-red-500"
                                )}>
                                    {row.overall_league_NRR ?? '—'}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <Shield size={48} className="mx-auto text-slate-100 mb-4" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        Season standings not yet available.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Legend */}
                <div className="bg-slate-50 p-6 flex flex-wrap items-center gap-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-100 border border-red-200" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qualifier Spot (Top 4)</span>
                    </div>
                    <div className="text-[9px] text-slate-300 font-medium">
                        M = Matches · W = Wins · Pts = Points · NRR = Net Run Rate
                    </div>
                </div>
            </div>
        </div>
    );
}
