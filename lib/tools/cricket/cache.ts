// SERVER-ONLY: This file should never be imported in client components
import { unstable_cache } from 'next/cache';

const API_BASE = 'https://apiv2.api-cricket.com/cricket';
const API_KEY_ENV = process.env.CRICKET_API_KEY || process.env.NEXT_PUBLIC_CRICKET_API_KEY || '';
const API_KEY_BACKUP = process.env.CRICKET_API_KEY_BACKUP || '';

// ─── DYNAMIC NEURAL ENGINE (V8.0) ─────────────────
// Static fallbacks removed. All data is now resolved via Live API or Real-time AI Scan.

export interface ApiMatch {
    event_key: string;
    event_date_start: string;
    event_time: string;
    event_home_team: string;
    event_away_team: string;
    event_home_team_logo?: string;
    event_away_team_logo?: string;
    home_team_key?: string;
    away_team_key?: string;
    event_stadium?: string;
    event_status: string;
    event_live?: string;
    event_home_final_result?: string;
    event_away_final_result?: string;
    event_status_info?: string;
    league_key?: string;
    league_name?: string;
    slug?: string;
}

export interface StandingRow {
    team_name: string;
    team_key: string;
    team_logo?: string;
    overall_league_position: number;
    overall_league_played: number;
    overall_league_W: number;
    overall_league_PTS: number;
    overall_league_NRR?: string;
}

// GLOBAL RAM CACHE (Protection Layer for 10k+ Users)
const GLOBAL_RAM_CACHE: Record<string, { data: any; expiry: number }> = {};

async function fetchAPI(method: string, params: Record<string, string> = {}, useBackup = false) {
    const activeKey = (useBackup || !API_KEY_ENV) ? API_KEY_BACKUP : API_KEY_ENV;
    const cacheKey = `api_${method}_${JSON.stringify(params)}_${activeKey.substring(0, 5)}`;
    const now = Date.now();
    
    // 1. RAM SHIELD: Check if we have a fresh copy in memory
    if (GLOBAL_RAM_CACHE[cacheKey] && GLOBAL_RAM_CACHE[cacheKey].expiry > now) {
        return GLOBAL_RAM_CACHE[cacheKey].data;
    }

    let url = `${API_BASE}/?method=${method}&APIkey=${activeKey}`;
    for (const [k, v] of Object.entries(params)) if (v) url += `&${k}=${v}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); 

    try {
        const res = await fetch(url, { 
            next: { revalidate: 3600 },
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        
        // SMART RETRY: If env key is wrong, try with backup once
        if (!useBackup && API_KEY_ENV && data.result && Array.isArray(data.result) && data.result[0]?.cod === 1004) {
            return fetchAPI(method, params, true);
        }
        
        // 2. RAM STORE: Save to memory for 3600 seconds
        GLOBAL_RAM_CACHE[cacheKey] = {
            data,
            expiry: now + (3600 * 1000)
        };
        
        return data;
    } catch (err: any) {
        clearTimeout(timeout);
        // 3. STALE FALLBACK: If API fails, return last known RAM data even if expired
        if (GLOBAL_RAM_CACHE[cacheKey]) return GLOBAL_RAM_CACHE[cacheKey].data;
        throw err;
    }
}

async function aiGenerateSquad(team_name: string): Promise<string[]> {
    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";
    const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
    
    // EXTREME RESTRICTIVE PROMPT
    const prompt = `Provide the names of 15 active cricket players for the team: ${team_name}. 
    FORMAT: Name1, Name2, Name3...
    RULES: 
    - ONLY player names.
    - NO introductory sentences.
    - NO closing remarks.
    - NO explanations.
    - STRICTLY COMMA SEPARATED.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    const cleanList = (raw: string) => {
        return raw.split(/[,\n]/)
            .map(p => p.trim())
            .filter(p => {
                const lp = p.toLowerCase();
                // Filter out common AI-chat phrases
                if (lp.length < 3 || lp.length > 30) return false;
                if (lp.includes("i can") || lp.includes("as of") || lp.includes("there is") || lp.includes("provide") || lp.includes("list") || lp.includes("team") || lp.includes("october")) return false;
                return true;
            });
    };

    // 1. Try OpenRouter (Hybrid Flash)
    if (OPENROUTER_KEY) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-flash-001",
                    "messages": [{ "role": "user", "content": prompt }]
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content || "";
                return cleanList(text);
            }
        } catch (e) { }
    }

    // 2. Fallback to Native Gemini
    if (GEMINI_KEY) {
        const combinations = [{ v: 'v1', m: 'gemini-2.0-flash' }, { v: 'v1', m: 'gemini-1.5-pro' }];
        for (const combo of combinations) {
            try {
                const url = `https://generativelanguage.googleapis.com/${combo.v}/models/${combo.m}:generateContent?key=${GEMINI_KEY}`;
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                    signal: controller.signal
                });
                if (res.ok) {
                    const data = await res.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    return cleanList(text);
                }
            } catch (e) { }
        }
    }
    return [];
}

export const getCachedTeamPlayers = unstable_cache(
    async (team_key: string, team_name: string): Promise<{ name: string; image?: string; role?: string }[]> => {
        // 1. API Primary
        if (team_key && team_key !== '0' && team_key !== '') {
            try {
                const data = await fetchAPI('get_players', { team_key });
                const raw = data?.result ?? [];
                if (Array.isArray(raw) && raw.length > 0) {
                    return raw.map((p: any) => ({
                        name: p.player_name,
                        image: p.player_image || p.player_image_url || p.player_logo || '',
                        role: p.player_type || p.player_role || ''
                    }));
                }
            } catch (err) { }
        }

        // 2. AI Secondary
        if (team_name) {
            const aiPlayers = await aiGenerateSquad(team_name);
            if (aiPlayers.length > 0) {
                return aiPlayers.map(name => ({ name }));
            }
        }

        return [];
    },
    ['ipl-squads-dynamic-v17'], 
    { revalidate: 3600, tags: ['cricket', 'ipl-team-players'] }
);

const getMatchSlug = (m: any) => {
    const home = (m.event_home_team || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const away = (m.event_away_team || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    return `${home}-vs-${away}-match-prediction-today-${m.event_key}`;
};

// Retain other functions (getCachedMatches, getCachedMatchDetail, getCachedStandings, getCachedLineups)
export const getCachedMatches = unstable_cache(
    async (): Promise<ApiMatch[]> => {
        try {
            const d = new Date();
            const from = new Date(d); from.setDate(d.getDate() - 10);
            const to = new Date(d); to.setDate(d.getDate() + 30);
            const fmt = (dt: Date) => dt.toISOString().split('T')[0];
            const data = await fetchAPI('get_events', { date_start: fmt(from), date_stop: fmt(to) });
            const raw: any[] = Array.isArray(data) ? data : (data?.result ?? []);
            if (raw.length > 0 && raw[0].param) return [];
            return raw.map((m: any): ApiMatch => ({
                event_key: String(m.event_key),
                event_date_start: m.event_date_start || '',
                event_time: m.event_time || '',
                event_home_team: m.event_home_team || 'Home Team',
                event_away_team: m.event_away_team || 'Away Team',
                event_home_team_logo: m.event_home_team_logo || '',
                event_away_team_logo: m.event_away_team_logo || '',
                home_team_key: String(m.home_team_key || ''),
                away_team_key: String(m.away_team_key || ''),
                event_stadium: m.event_stadium || '',
                event_status: m.event_status || (m.event_status_info === 'Match yet to begin' ? 'Scheduled' : ''),
                event_live: String(m.event_live || '0'),
                event_home_final_result: m.event_home_final_result || '',
                event_away_final_result: m.event_away_final_result || '',
                event_status_info: m.event_status_info || '',
                league_key: String(m.league_key || ''),
                league_name: m.league_name || '',
                slug: getMatchSlug(m),
            }));
        } catch (err) { return []; }
    },
    ['ipl-matches-pure-v6'], { revalidate: 3600, tags: ['cricket', 'ipl-matches'] }
);

export const getCachedMatchDetail = unstable_cache(
    async (event_key: string): Promise<ApiMatch | null> => {
        try {
            const data = await fetchAPI('get_events', { event_key });
            const raw: any[] = Array.isArray(data) ? data : (data?.result ?? []);
            if (raw.length === 0 || raw[0].param) return null;
            const m = raw[0];
            return {
                event_key: String(m.event_key),
                event_date_start: m.event_date_start || '',
                event_time: m.event_time || '',
                event_home_team: m.event_home_team || 'Home Team',
                event_away_team: m.event_away_team || 'Away Team',
                event_home_team_logo: m.event_home_team_logo || '',
                event_away_team_logo: m.event_away_team_logo || '',
                home_team_key: String(m.home_team_key || ''),
                away_team_key: String(m.away_team_key || ''),
                event_stadium: m.event_stadium || '',
                event_status: m.event_status || (m.event_status_info === 'Match yet to begin' ? 'Scheduled' : ''),
                event_live: String(m.event_live || '0'),
                event_home_final_result: m.event_home_final_result || '',
                event_away_final_result: m.event_away_final_result || '',
                event_status_info: m.event_status_info || '',
                league_key: String(m.league_key || ''),
                league_name: m.league_name || '',
                slug: getMatchSlug(m),
            };
        } catch (err) { return null; }
    },
    ['ipl-match-detail-pure-v1'], { revalidate: 300, tags: ['cricket', 'ipl-match-detail'] }
);

export const getCachedStandings = unstable_cache(
    async (): Promise<StandingRow[]> => {
        try {
            const data = await fetchAPI('get_standings', { league_key: '745' }); 
            const raw = data?.result?.total ?? data?.result ?? [];
            if (!Array.isArray(raw)) return [];
            return raw.map((r: any): StandingRow => ({
                team_name: r.standing_team || '',
                team_key: String(r.team_key || r.standing_team_key || ''),
                team_logo: r.team_logo || '',
                overall_league_position: parseInt(String(r.standing_place || '0')),
                overall_league_played: parseInt(String(r.standing_P || '0')),
                overall_league_W: parseInt(String(r.standing_W || '0')),
                overall_league_PTS: parseInt(String(r.standing_Pts || '0')),
                overall_league_NRR: String(r.standing_NRR || '0.000'),
            }));
        } catch (err) { return []; }
    },
    ['ipl-standings-pure-v2'], { revalidate: 3600, tags: ['cricket', 'ipl-standings'] }
);

export const getCachedLineups = unstable_cache(
    async (event_key: string): Promise<{ home_team: { name: string; image?: string }[], away_team: { name: string; image?: string }[] } | null> => {
        try {
            const data = await fetchAPI('get_lineups', { event_key });
            const lineups = data?.result?.lineups;
            if (!lineups) return null;
            return {
                home_team: lineups.home_team?.map((p: any) => ({ name: p.player_name, image: p.player_image || '', role: p.player_type || '' })) || [],
                away_team: lineups.away_team?.map((p: any) => ({ name: p.player_name, image: p.player_image || '', role: p.player_type || '' })) || []
            };
        } catch (err) { return null; }
    },
    ['ipl-lineups-pure-v2'], { revalidate: 300, tags: ['cricket', 'ipl-lineups'] }
);

import { generateMatchInsightsSummary } from './gemini';

// RAM SHIELD for AI (1-day persistence in memory)
const AI_RAM_CACHE: Record<string, { data: any; expiry: number }> = {};

export const getCachedMatchAnalysis = unstable_cache(
    async (match: any, squads?: { home: { name: string; image?: string }[], away: { name: string; image?: string }[] }) => {
        const key = `ai_${match.event_key}`;
        const now = Date.now();
        
        if (AI_RAM_CACHE[key] && AI_RAM_CACHE[key].expiry > now) {
            return AI_RAM_CACHE[key].data;
        }

        const data = await generateMatchInsightsSummary(match, squads);
        
        AI_RAM_CACHE[key] = {
            data,
            expiry: now + (3600 * 4 * 1000) // 4-hour memory stickiness
        };
        
        return data;
    },
    ['ipl-match-ai-analysis-v5'], { revalidate: 3600, tags: ['cricket', 'ai-analysis'] }
);
