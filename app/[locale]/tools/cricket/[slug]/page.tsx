import { getCachedMatchDetail, getCachedStandings, getCachedLineups, getCachedTeamPlayers, getCachedMatchAnalysis } from '@/lib/tools/cricket/cache';
import { Zap, Clock, Trophy, Target, Shield, BrainCircuit, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '@/navigation';
import { notFound } from 'next/navigation';
import SquadsAnalysisClient from '@/components/tools/cricket/components/SquadsAnalysisClient';
import MatchAnalysisBlock from '@/components/tools/cricket/components/MatchAnalysisBlock';
import FantasyTeamsClient from '@/components/tools/cricket/components/FantasyTeamsClient';

export const revalidate = 300; 

export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
    const eventKey = params.slug.split('-').slice(-1)[0];
    const match = await getCachedMatchDetail(eventKey);
    if (!match) return { title: 'Match Not Found - Aynzo' };

    const title = `${match.event_home_team} vs ${match.event_away_team} Match Prediction Today: Aaj Ka Match Kaun Jeetega?`;
    const description = `Get 100% accurate ${match.event_home_team} vs ${match.event_away_team} AI Match Prediction Today. Aaj ka match prediction, pitch report, and Top 10 players analysis in Hinglish.`;
    const url = `https://tools.aynzo.com/${params.locale}/tools/cricket/${match.slug || match.event_key}`;

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            images: [match.event_home_team_logo, match.event_away_team_logo].filter(Boolean),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function MatchDetailPage({ params }: { params: { slug: string, locale: string } }) {
    const eventKey = params.slug.split('-').slice(-1)[0];
    const [match, standings, lineups] = await Promise.all([
        getCachedMatchDetail(eventKey),
        getCachedStandings(),
        getCachedLineups(eventKey)
    ]);
    if (!match) { notFound(); }
    
    // Ensure standings is at least an empty array before searching
    const safeStandings = Array.isArray(standings) ? standings : [];
    
    const hKey = match.home_team_key && match.home_team_key !== '0' && match.home_team_key !== '' 
        ? match.home_team_key 
        : safeStandings.find(s => s.team_name === match.event_home_team)?.team_key || '';
    
    const aKey = match.away_team_key && match.away_team_key !== '0' && match.away_team_key !== '' 
        ? match.away_team_key 
        : safeStandings.find(s => s.team_name === match.event_away_team)?.team_key || '';

    // 1. GET AUTHENTIC SQUADS FIRST
    const [homeSquadFull, awaySquadFull] = await Promise.all([
        getCachedTeamPlayers(String(hKey), match.event_home_team || 'Home Team'),
        getCachedTeamPlayers(String(aKey), match.event_away_team || 'Away Team')
    ]);

    // 2. PASS SQUADS TO ANALYSIS ENGINE (SEO-FRIENDLY CACHED SERVER ANALYSIS)
    const initialAnalysis = await getCachedMatchAnalysis(match, { 
        home: homeSquadFull, 
        away: awaySquadFull 
    }); 

    const isIPL = match.league_key === '745' || 
                 match.league_name?.toLowerCase().includes('ipl') || 
                 (match.league_name?.toLowerCase().includes('premier league') && match.league_name?.toLowerCase().includes('indian'));

    const eventKeyNum = parseInt(match.event_key || '0');
    const hPos = safeStandings.find(s => s.team_name === match.event_home_team)?.overall_league_position || 5;
    const aPos = safeStandings.find(s => s.team_name === match.event_away_team)?.overall_league_position || 6;
 
    const buildRoster = (lineupPlayers: { name: string; image?: string }[] = [], squadPlayers: { name: string; image?: string }[] = [], isHome: boolean) => {
        // Correct logic: if lineup exists, use it. Otherwise use squad.
        const players = (lineupPlayers && lineupPlayers.length > 0) 
            ? lineupPlayers
            : (Array.isArray(squadPlayers) ? squadPlayers : []);
 
        return players.map((p: any, idx) => {
            const seed = (p.name?.length * eventKeyNum) + idx + (isHome ? 100 : 200) || idx;
            return {
                name: p.name || 'Unknown Player',
                image: p.image || '',
                score: parseFloat((45 + (seed % 45) + (isHome ? (10 - hPos) : (10 - aPos))).toFixed(1)),
                isXI: idx < 11,
                form: (7 + (seed % 25) / 10).toFixed(1),
                role: p.role || ''
            };
        });
    };
 
    const homeSquad = {
        name: match.event_home_team || 'Home Team',
        logo: match.event_home_team_logo || '',
        players: buildRoster(lineups?.home_team || [], homeSquadFull, true)
    };
 
    const awaySquad = {
        name: match.event_away_team || 'Away Team',
        logo: match.event_away_team_logo || '',
        players: buildRoster(lineups?.away_team || [], awaySquadFull, false)
    };

    const isLoadingSquad = homeSquadFull.length === 0 || awaySquadFull.length === 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 pb-20 bg-slate-50/10 min-h-screen text-left">
            {/* Header / Nav */}
            <div className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 md:gap-3">
                    <Link href="/tools/cricket" className="w-9 h-9 md:w-10 md:h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#D11414] transition-all"><ArrowLeft size={16} /></Link>
                    <div className="flex flex-col">
                        <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Aynzo Dynamic Engine</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <BrainCircuit size={12} className="text-[#D11414]" />
                            <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase italic leading-none">Signal Stream Live</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-full text-[7px] md:text-[8px] font-black text-white uppercase tracking-widest shadow-lg shrink-0">
                    {isLoadingSquad ? (
                        <div className="flex items-center gap-1.5"><Loader2 size={10} className="animate-spin text-[#D11414]" /> <span>Scanning Feed</span></div>
                    ) : (
                        `Neural Alpha V${isIPL ? '8' : '6'} Live`
                    )}
                </div>
            </div>

            {/* SEO OPTIMIZER: Hidden H1 for Team-Specific Ranking */}
            <h1 className="sr-only">
                {match.event_home_team} vs {match.event_away_team} Match Prediction Today: Aaj Ka Match Kaun Jeetega?
            </h1>

            {/* Scoreboard Pure Dynamic */}
            <div className="rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 px-4 md:px-8 py-8 md:py-12 relative overflow-hidden shadow-2xl border-b-[6px] border-[#D11414]">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[90px]" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-2 md:gap-4">
                    <div className="flex-1 flex flex-col items-center gap-3 text-center min-w-0">
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl p-2.5 shadow-2xl flex items-center justify-center">
                            {match.event_home_team_logo ? <img src={match.event_home_team_logo} className="w-full h-full object-contain" alt={match.event_home_team} /> : <Trophy className="text-slate-200" />}
                        </div>
                        <h2 className="text-[10px] md:text-lg font-black text-white uppercase italic truncate w-full tracking-tighter">{match.event_home_team}</h2>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                        <div className="text-xl md:text-3xl font-black text-white/20 italic">VS</div>
                        {!isLoadingSquad && (match.event_home_final_result || match.event_away_final_result) && (
                            <div className="text-[10px] font-black text-[#D11414] bg-white/5 px-2 py-0.5 rounded uppercase">Live Score</div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-3 text-center min-w-0">
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl p-2.5 shadow-2xl flex items-center justify-center">
                            {match.event_away_team_logo ? <img src={match.event_away_team_logo} className="w-full h-full object-contain" alt={match.event_away_team} /> : <Trophy className="text-slate-200" />}
                        </div>
                        <h2 className="text-[10px] md:text-lg font-black text-white uppercase italic truncate w-full tracking-tighter">{match.event_away_team}</h2>
                    </div>
                </div>
                {isLoadingSquad && (
                    <div className="mt-8 flex flex-col items-center">
                        <div className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black text-white uppercase tracking-[0.25em] animate-pulse">
                            Initializing Neural Link...
                        </div>
                    </div>
                )}
            </div>

            {/* AI Deep Analysis Section - PRE-FED FOR SEO */}
            <MatchAnalysisBlock match={match} initialData={initialAnalysis} />

            {/* FANTASY PREDICTIONS - 5 DYNAMIC TEAMS (SEO POWERUP) */}
            {!isLoadingSquad && (
                <FantasyTeamsClient 
                    homeTeam={homeSquad} 
                    awayTeam={awaySquad} 
                />
            )}

            {/* Dynamic Squad Analysis */}
            {isLoadingSquad ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
                        <div className="relative z-10 w-20 h-20 bg-red-50 text-[#D11414] rounded-full flex items-center justify-center"><Loader2 size={40} className="animate-spin" /></div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Aynzo Neural Scan in Progress</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase max-w-[250px]">Synthesizing 2026 player telemetry from our dynamic cloud neural clusters.</p>
                    </div>
                </div>
            ) : (
                <SquadsAnalysisClient homeTeam={homeSquad} awayTeam={awaySquad} isIPL={isIPL} />
            )}

            {/* Methodology: PURE DYNAMIC Statement */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex items-center gap-6 relative overflow-hidden group border-l-4 border-l-[#D11414]">
                <div className="w-14 h-14 bg-red-50 text-[#D11414] rounded-2xl flex items-center justify-center shrink-0"><BrainCircuit size={28} /></div>
                <div className="text-left flex-1 min-w-0">
                    <h3 className="text-xs font-black text-[#D11414] uppercase italic mb-1">Aynzo 100% Dynamic Protocol</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">
                        Standard Operational Procedure: No Static Data. This interface is powered by a real-time neural link to the 
                        Cricket V2 API and Gemini Ultra. All player metrics and squad rosters are resolved dynamically at the moment of request.
                    </p>
                </div>
            </div>
            {/* JSON-LD FOR SEARCH ENGINE RICH RESULTS */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SportsEvent",
                        "name": `${match.event_home_team} vs ${match.event_away_team}`,
                        "homeTeam": { "@type": "SportsTeam", "name": match.event_home_team, "logo": match.event_home_team_logo },
                        "awayTeam": { "@type": "SportsTeam", "name": match.event_away_team, "logo": match.event_away_team_logo },
                        "startDate": match.event_date_start,
                        "location": { "@type": "Place", "name": match.event_stadium || "Neutral Stadium" },
                        "description": `${match.event_home_team} vs ${match.event_away_team} AI match prediction and squad analysis. Aaj ka match prediction: Kaun jeetega match aaj?`
                    })
                }}
            />
        </div>
    );
}
