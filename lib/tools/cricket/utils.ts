/**
 * Shared utilities for Cricket AI Tool
 */

/**
 * Formats match time from API (HH:MM) to 12-hour IST format (UTC+5:30)
 * with a -2hr correction for API data discrepancy.
 */
export function formatTime(time: string, dateStr?: string) {
    try {
        const [hoursStr, minutesStr] = time.split(':');
        let utcHours = parseInt(hoursStr);
        const utcMinutes = parseInt(minutesStr);
        
        // API returns times ~2hrs ahead of actual match time, apply correction
        utcHours = (utcHours - 2 + 24) % 24;
        
        const date = dateStr 
            ? new Date(`${dateStr}T${String(utcHours).padStart(2,'0')}:${String(utcMinutes).padStart(2,'0')}:00Z`) 
            : new Date();
        
        if (!dateStr) {
            date.setUTCHours(utcHours, utcMinutes, 0, 0);
        }

        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true,
            timeZone: 'Asia/Kolkata'
        }).toLowerCase() + ' IST';
    } catch { 
        return time; 
    }
}

/**
 * Formats match date into components for UI
 */
export function formatMatchDate(dateStr: string) {
    try {
        const d = new Date(dateStr);
        return {
            month:   d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
            weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
            day:     d.getDate(),
        };
    } catch { 
        return { month: 'APR', weekday: 'TBA', day: 1 }; 
    }
}
