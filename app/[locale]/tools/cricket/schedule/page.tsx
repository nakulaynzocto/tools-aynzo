// SERVER COMPONENT — data cached for 1 hour
import { getCachedMatches, ApiMatch } from '@/lib/tools/cricket/cache';
import ScheduleClient from '@/components/tools/cricket/components/ScheduleClient';

export const revalidate = 3600;

export default async function IPLSchedulePage() {
    const matches = await getCachedMatches();
    const iplMatches = matches.filter(m => 
        m.league_key === '745' || 
        m.league_name?.toLowerCase().includes('ipl') || 
        (m.league_name?.toLowerCase().includes('premier league') && m.league_name?.toLowerCase().includes('indian'))
    );
    const heroMatch = iplMatches.find(m => m.event_status !== 'Finished');

    return <ScheduleClient matches={matches} heroMatch={heroMatch} />;
}
