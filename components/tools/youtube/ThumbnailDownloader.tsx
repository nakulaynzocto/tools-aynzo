"use client";
import { Download } from 'lucide-react';
import { YouTubeThumbnails } from '@/components/types/youtube/types';

interface ThumbnailDownloaderProps {
    result: YouTubeThumbnails;
}

export function ThumbnailDownloader({ result }: ThumbnailDownloaderProps) {
    return (
        <div className="grid grid-cols-2 gap-6 pb-6">
            {Object.entries(result).map(([quality, url]: [string, any]) => (
                <div key={quality} className="bg-card p-4 rounded-3xl border-2 border-border group overflow-hidden shadow-xl hover:border-primary/30 transition-all">
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-border">
                        <img src={url} alt={quality} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] text-white font-black uppercase tracking-widest rounded-full">
                            {quality}
                        </div>
                    </div>
                    <a href={url} target="_blank" rel="noreferrer" download className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black text-center text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                        <Download size={14} /> Download
                    </a>
                </div>
            ))}
        </div>
    );
}

