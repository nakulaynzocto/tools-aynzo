"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, ArrowRight, Zap } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { searchTools } from '@/lib/tools';
import { cn } from '@/utils/cn';
import { usePersistentTools } from '@/hooks/use-persistent-tools';
import { useSearchParams } from 'next/navigation';

export default function HeroSearch() {
    const t = useTranslations('Navigation');
    const tTools = useTranslations('Tools');
    const searchParams = useSearchParams();
    const urlQuery = searchParams.get('q');
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addRecentTool } = usePersistentTools();

    // Support URL search query
    useEffect(() => {
        if (urlQuery && urlQuery.trim().length > 1) {
            setQuery(urlQuery);
            const filtered = searchTools(urlQuery).slice(0, 8);
            setResults(filtered);
            setIsOpen(true);
        }
    }, [urlQuery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim().length > 1) {
            const filtered = searchTools(value).slice(0, 8);
            setResults(filtered);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-3xl mx-auto px-4 z-40">
            <div className="relative group/search">
                <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-border/80 rounded-[1.25rem] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04),0_8px_15px_-2px_rgba(0,0,0,0.02)] overflow-hidden focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/40 focus-within:bg-background transition-all duration-300">
                    <div className="pl-6 pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        onFocus={() => query.length > 1 && setIsOpen(true)}
                        placeholder={t('heroSearchPlaceholder')}
                        className="w-full py-5 px-5 bg-transparent text-foreground placeholder-muted-foreground/40 outline-none text-lg font-medium tracking-tight"
                    />
                    <div className="hidden md:flex items-center gap-2 pr-4 pointer-events-none">
                        <kbd className="h-6 w-6 flex items-center justify-center rounded border border-border bg-muted/50 text-[10px] font-bold text-muted-foreground shadow-sm">
                            /
                        </kbd>
                    </div>
                    {query && (
                        <button 
                            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                            className="pr-6 text-muted-foreground/30 hover:text-foreground transition-all group/clear"
                        >
                            <div className="p-1 rounded-full hover:bg-secondary transition-colors">
                                <Search className="h-4 w-4 rotate-45" />
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Professional Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-4 right-4 mt-3 bg-background border border-border/60 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.length > 0 ? (
                        <>
                            <div className="p-2">
                                <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">
                                    {t('foundResults', { count: results.length })}
                                </div>
                                {results.map((tool) => (
                                    <Link
                                        key={tool.slug}
                                        href={`/tools/${tool.slug}`}
                                        className="flex items-center justify-between p-4 hover:bg-secondary/40 rounded-xl transition-all group/item"
                                        onClick={() => {
                                            setIsOpen(false);
                                            addRecentTool(tool.slug);
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 border border-border/40 rounded-lg flex items-center justify-center text-primary/70 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:border-primary transition-all duration-200">
                                                <Zap size={18} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-foreground text-base tracking-tight">
                                                    {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                                                    {tool.category}
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                            <div className="bg-muted/10 p-4 border-t border-border/40 text-center">
                                <Link href="/tools" className="text-[11px] font-bold text-primary hover:opacity-70 transition-opacity flex items-center justify-center gap-2 uppercase tracking-widest">
                                    {t('browseAll')} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </>
                    ) : query.length > 1 ? (
                        <div className="p-12 text-center space-y-4">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground/40">
                                <Search size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-foreground">{t('noToolsFound', { query })}</p>
                                <p className="text-xs text-muted-foreground">{t('tryKeywords')}</p>
                            </div>
                            <div className="pt-2">
                                <button 
                                    onClick={() => setQuery('')}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                                >
                                    {t('clearSearch')}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
