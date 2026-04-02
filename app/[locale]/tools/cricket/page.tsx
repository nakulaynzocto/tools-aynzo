// SERVER COMPONENT — data fetched server-side, cached for 1 hour
import React from 'react';
import { getCachedMatches } from '@/lib/tools/cricket/cache';
import dynamic from 'next/dynamic';
import { Link } from '@/navigation';
import { Trophy, Zap, BarChart3, TrendingUp, Calendar, ArrowRight, Shield } from 'lucide-react';

const MatchListClient = dynamic(() => import('@/components/tools/cricket/components/MatchListClient'), { ssr: false });
const IPLTicker = dynamic(() => import('@/components/tools/cricket/components/IPLTicker'), { ssr: false });

export const revalidate = 3600; // Next.js page-level ISR: revalidate every 1 hour

export default async function CricketMatchHub() {
    // Fetched server-side — will be cached; no client fetch, no API key exposure
    const matches = await getCachedMatches();

    const iplMatches = matches.filter(m => 
        m.league_key === '745' || 
        m.league_name?.toLowerCase().includes('ipl') || 
        (m.league_name?.toLowerCase().includes('premier league') && m.league_name?.toLowerCase().includes('indian'))
    );
    const heroMatch = iplMatches.find(m => m.event_status !== 'Finished');

    return (
        <div className="pb-20 bg-[#f8fafc]">
            {/* TOP IPL TICKER - Scrolling Right to Left */}
            <IPLTicker matches={matches} />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">Live & Upcoming Matches</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            AI-Powered Fanatasy Predictions • Neural Scan Active
                        </p>
                    </div>
                    <Link href="/tools/cricket/schedule" className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all">
                        View Schedule <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Match List — Client Component receives server-fetched data as props */}
                <MatchListClient matches={matches} />

                {/* AI Features Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 border-t border-slate-100">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                            <Zap size={20} className="text-red-600" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 uppercase mb-2 tracking-wide">Neural Scanning</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">15+ live player metrics analyzed every minute for maximum accuracy.</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                            <Shield size={20} className="text-red-600" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 uppercase mb-2 tracking-wide">Pitch Analysis</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Real-time pitch condition reports integrated into Dream XI picking.</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                            <TrendingUp size={20} className="text-red-600" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 uppercase mb-2 tracking-wide">Win Flow</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Dynamic win probability tracker that updates live as the ball moves.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

