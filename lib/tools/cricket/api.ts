export interface ApiMatch {
    event_key: string;
    event_date_start: string;
    event_time: string;
    event_home_team: string;
    event_away_team: string;
    event_home_team_logo?: string;
    event_away_team_logo?: string;
    event_stadium?: string;
    event_status: string;
    league_key?: string;
    league_name?: string;
}

export async function fetchIPLMatches(): Promise<ApiMatch[]> {
    try {
        const res = await fetch('/api/cricket?method=get_events&league_id=745', {
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = await res.json();
        const raw: any[] = Array.isArray(data) ? data : (data?.result ?? []);

        return raw
            .filter((m: any) => m.event_status !== 'Finished')
            .map((m: any): ApiMatch => ({
                event_key: String(m.event_key),
                event_date_start: m.event_date_start || '',
                event_time: m.event_time || '',
                event_home_team: m.event_home_team || 'Home Team',
                event_away_team: m.event_away_team || 'Away Team',
                event_home_team_logo: m.event_home_team_logo || '',
                event_away_team_logo: m.event_away_team_logo || '',
                event_stadium: m.event_stadium || '',
                event_status: m.event_status || 'Scheduled',
                league_key: String(m.league_key || ''),
                league_name: m.league_name || '',
            }));

    } catch (err) {
        console.error('[cricket/api] fetchIPLMatches failed:', err);
        return [];
    }
}

export async function fetchPointsTable(): Promise<any[]> {
    try {
        const res = await fetch('/api/cricket?method=get_standings&league_id=745', {
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = await res.json();

        // API returns: { result: { total: [...] } } or { result: [...] }
        const raw = data?.result?.total ?? data?.result ?? [];
        return Array.isArray(raw) ? raw : [];

    } catch (err) {
        console.error('[cricket/api] fetchPointsTable failed:', err);
        return [];
    }
}
