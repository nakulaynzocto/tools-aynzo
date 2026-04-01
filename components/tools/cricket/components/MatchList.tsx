// This file is kept for backward compatibility only.
// The recommended component is MatchListClient (receives server-fetched props).
// If used directly without props, it will do a client-side fetch as fallback.
"use client";
import { useState, useEffect } from 'react';
import MatchListClient from './MatchListClient';

interface ApiMatch {
    event_key: string;
    event_date_start: string;
    event_time: string;
    event_home_team: string;
    event_away_team: string;
    event_home_team_logo?: string;
    event_away_team_logo?: string;
    event_stadium?: string;
    event_status: string;
}

export default function MatchList() {
    const [matches, setMatches] = useState<ApiMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/cricket?method=get_events&league_id=745', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const raw: any[] = Array.isArray(data) ? data : (data?.result ?? []);
                setMatches(raw.filter((m: any) => m.event_status !== 'Finished').map((m: any) => ({
                    event_key: String(m.event_key),
                    event_date_start: m.event_date_start || '',
                    event_time: m.event_time || '',
                    event_home_team: m.event_home_team || 'Home Team',
                    event_away_team: m.event_away_team || 'Away Team',
                    event_home_team_logo: m.event_home_team_logo || '',
                    event_away_team_logo: m.event_away_team_logo || '',
                    event_stadium: m.event_stadium || '',
                    event_status: m.event_status || 'Scheduled',
                })));
            })
            .catch(() => setMatches([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 border-b border-slate-100 animate-pulse bg-slate-50 last:border-0" />
                ))}
            </div>
        );
    }

    return <MatchListClient matches={matches} />;
}
