"use client";
import { FileText, Type, AlignLeft, MoveVertical, Hash, Clock, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TextStats } from '@/components/types/text/types';

interface TextMetricsProps {
    stats: TextStats;
}

export function TextMetrics({ stats }: TextMetricsProps) {
    const t = useTranslations('TextTools');

    return (
        <div className="bg-card rounded-2xl sm:rounded-3xl border-2 border-border shadow-xl p-3 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                <Activity size={10} className="sm:w-3 sm:h-3 text-primary" /> Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-2">
                {[
                    { label: t('words'), value: stats.words, icon: FileText, color: 'text-blue-400' },
                    { label: t('characters'), value: stats.chars, icon: Type, color: 'text-indigo-400' },
                    { label: t('sentences'), value: stats.sentences, icon: AlignLeft, color: 'text-emerald-400' },
                    { label: t('paragraphs'), value: stats.paragraphs, icon: MoveVertical, color: 'text-purple-400' },
                    { label: t('lines'), value: stats.lines, icon: Hash, color: 'text-amber-400' },
                    { label: 'Time', value: `${stats.readingTime}m`, icon: Clock, color: 'text-rose-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-muted/30 rounded-lg sm:rounded-xl p-2 sm:p-2.5 border border-border transition-all">
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 opacity-60">
                            <stat.icon className={`w-2 sm:w-2.5 h-2 sm:h-2.5 ${stat.color}`} />
                            <span className="text-[6px] sm:text-[7px] font-black text-muted-foreground uppercase tracking-tighter">{stat.label}</span>
                        </div>
                        <div className={`text-sm sm:text-base font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}


