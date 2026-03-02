"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Zap, Command, X, ArrowRight } from 'lucide-react';
import { Link, useRouter } from '@/navigation';
import { tools } from '@/lib/tools';
import { useTranslations } from 'next-intl';
import { usePersistentTools } from '@/hooks/use-persistent-tools';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const tTools = useTranslations('Tools');
    const { addRecentTool } = usePersistentTools();
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredTools = query.trim() === '' 
        ? tools.slice(0, 5) 
        : tools.filter(t => 
            t.name.toLowerCase().includes(query.toLowerCase()) || 
            t.category.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 10);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const onSelect = (tool: typeof tools[0]) => {
        addRecentTool(tool.slug);
        router.push(`/tools/${tool.slug}`);
        setIsOpen(false);
    };

    const handleListKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredTools.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
        } else if (e.key === 'Enter') {
            onSelect(filteredTools[selectedIndex]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
            
            <div className="relative w-full max-w-2xl bg-card border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
                    <Search className="h-5 w-5 text-muted-foreground/50" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleListKeyDown}
                        placeholder="Type to search tools..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-foreground placeholder-muted-foreground/30 py-2"
                    />
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        ESC
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground/40 hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        {query ? 'Search Results' : 'Suggested Tools'}
                    </div>
                    
                    {filteredTools.map((tool, index) => (
                        <button
                            key={tool.slug}
                            onClick={() => onSelect(tool)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 text-left ${
                                selectedIndex === index ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.01]' : 'hover:bg-secondary/50'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-colors ${
                                    selectedIndex === index ? 'bg-white/20 border-white/20' : 'bg-secondary border-border/40'
                                }`}>
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <div className={`font-bold tracking-tight ${selectedIndex === index ? 'text-white' : 'text-foreground'}`}>
                                        {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                    </div>
                                    <div className={`text-[11px] font-medium uppercase tracking-widest opacity-60 ${selectedIndex === index ? 'text-white' : 'text-muted-foreground'}`}>
                                        {tool.category}
                                    </div>
                                </div>
                            </div>
                            <Command size={14} className={`opacity-0 transition-opacity ${selectedIndex === index ? 'opacity-100' : ''}`} />
                        </button>
                    ))}

                    {filteredTools.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="text-muted-foreground/20 flex justify-center">
                                <Search size={48} />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No tools found for "{query}"</p>
                        </div>
                    )}
                </div>

                <div className="bg-muted/30 p-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <span className="flex items-center justify-center w-5 h-5 rounded border border-border bg-background">↑</span>
                            <span className="flex items-center justify-center w-5 h-5 rounded border border-border bg-background">↓</span>
                            to navigate
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <span className="flex items-center justify-center w-5 h-5 rounded border border-border bg-background">↵</span>
                            to select
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
