"use client";

import { Link } from '@/navigation';
import { ArrowRight, Shield, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePersistentTools } from '@/hooks/use-persistent-tools';
import { cn } from '@/utils/cn';
import { getCategoryIcon } from '@/utils/icon-mapping';

interface ToolCardProps {
    _id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    categoryKey: string;
}

export function ToolCard({ _id, slug, name, description, category, categoryKey }: ToolCardProps) {
    const t = useTranslations('Tools');
    const { isFavorite, toggleFavorite, addRecentTool } = usePersistentTools();
    const favorite = isFavorite(slug);
    const IconComponent = getCategoryIcon(categoryKey);

    return (
        <div className="group relative">
            <Link
                href={`/tools/${slug}`}
                onClick={() => addRecentTool(slug)}
                title={`Use Free Online ${name} Tool - Aynzo`}
                className="block bg-card/60 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 border border-border/50 hover:border-primary/30 hover:-translate-y-2 overflow-hidden relative h-full"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <IconComponent className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                </div>

                {/* Category & Badge */}
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                        {category}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                        <Shield size={10} />
                        100% Secure
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2 opacity-80">
                    {description}
                </p>

                {/* Hover Indicator */}
                <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span>{t('tryNow')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            {/* Favorite Button - Floating */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(slug);
                }}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                className={cn(
                    "absolute top-6 right-6 p-2.5 rounded-xl border transition-all duration-300 z-10",
                    favorite 
                        ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" 
                        : "bg-white/50 text-muted-foreground border-border/50 hover:bg-white hover:text-amber-500 hover:border-amber-500/30"
                )}
            >
                <Star size={18} fill={favorite ? "currentColor" : "none"} className={cn(favorite && "animate-pulse")} />
            </button>
        </div>
    );
}
