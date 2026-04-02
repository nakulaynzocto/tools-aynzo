"use client";
import React, { useState, useEffect } from 'react';

export default function MatchCountdown({ startDate, startTime }: { startDate: string, startTime: string }) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const calculate = () => {
            try {
                if (!startTime) return '00:00:00';
                const [h, m] = startTime.split(':');
                const target = new Date(startDate);
                target.setUTCHours(parseInt(h), parseInt(m), 0, 0);
                const diff = target.getTime() - new Date().getTime();

                if (diff <= 0) return '00:00:00';

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / 1000 / 60) % 60);
                const secs = Math.floor((diff / 1000) % 60);

                const parts = [];
                if (days > 0) parts.push(`${days}d`);
                parts.push(`${String(hours).padStart(2, '0')}h`);
                parts.push(`${String(mins).padStart(2, '0')}m`);
                parts.push(`${String(secs).padStart(2, '0')}s`);
                return parts.join(' ');
            } catch { return ''; }
        };

        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        setTimeLeft(calculate());
        return () => clearInterval(timer);
    }, [startDate, startTime]);

    if (!timeLeft) return null;
    return (
        <div className="text-[9px] font-black text-[#D11414] tracking-widest flex items-center gap-1 opacity-80">
            <span className="w-1 h-1 rounded-full bg-[#D11414] animate-pulse" />
            {timeLeft}
        </div>
    );
}
