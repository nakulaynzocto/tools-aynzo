"use client";
import { Link, usePathname } from '@/navigation';
import { ArrowRight, Trophy } from 'lucide-react';
import { ApiMatch } from '@/lib/tools/cricket/cache';

interface CricketTabHeaderProps {
    title?: string;
    currentTab?: 'fixtures' | 'live' | 'results' | 'points-table' | 'ai-picks';
    onTabChange?: (tab: 'fixtures' | 'live' | 'results') => void;
    heroMatch?: ApiMatch | null;
}

export default function CricketTabHeader({ title = "IPL HUB 2026", currentTab, onTabChange, heroMatch }: CricketTabHeaderProps) {
    const pathname = usePathname();

    const tabs = [
        { id: 'fixtures', label: '🏏 Fixtures', href: '/tools/cricket/schedule' },
        { id: 'live', label: '🔴 Live', href: '/tools/cricket/schedule' },
        { id: 'results', label: '✅ Results', href: '/tools/cricket/schedule' },
        { id: 'points-table', label: 'Points Table', href: '/tools/cricket/points-table' },
        { id: 'ai-picks', label: '⚡ AI Picks', href: '/tools/cricket/ai-predictor' },
    ];

    const getActive = (tabId: string) => {
        if (currentTab) return currentTab === tabId;
        if (tabId === 'points-table') return pathname.includes('points-table');
        if (tabId === 'ai-picks') return pathname.includes('ai-predictor');
        if (pathname.includes('schedule') && tabId === 'fixtures') return true;
        return false;
    };

    return (
        <div className="bg-[#0d1b2a] text-white">
            <div className="max-w-5xl mx-auto px-4 pt-8 pb-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            <Link href="/tools/cricket" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-white">Cricket Tools</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">{title}</h1>
                    </div>

                    {/* Mini Hero Spotlight in Header */}
                    {heroMatch && (
                        <div className="hidden md:flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 pr-5 group hover:bg-white/10 transition-colors">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center p-1.5 border border-[#0d1b2a]">
                                    {heroMatch.event_home_team_logo ? <img src={heroMatch.event_home_team_logo} className="w-full h-full object-contain" /> : <Trophy size={12} />}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center p-1.5 border border-[#0d1b2a]">
                                    {heroMatch.event_away_team_logo ? <img src={heroMatch.event_away_team_logo} className="w-full h-full object-contain" /> : <Trophy size={12} />}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">NEXT ⚡</span>
                                    <span className="text-[10px] font-black text-red-500 uppercase leading-none">65% Conf.</span>
                                </div>
                                <div className="text-[11px] font-black uppercase italic mt-1 leading-none tracking-wide">
                                    {heroMatch.event_home_team.substring(0,3)} vs {heroMatch.event_away_team.substring(0,3)}
                                </div>
                            </div>
                            <Link href={`/tools/cricket/${heroMatch.event_key}`} className="ml-2 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tab Pills */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => {
                        const active = getActive(tab.id);
                        if (onTabChange && (tab.id === 'fixtures' || tab.id === 'live' || tab.id === 'results')) {
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id as any)}
                                    className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-t-lg transition-all whitespace-nowrap ${
                                        active ? 'bg-[#f0f2f5] text-[#D11414]' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        }
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href as any}
                                className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-t-lg transition-all whitespace-nowrap ${
                                    active ? 'bg-[#f0f2f5] text-[#D11414]' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
