"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/utils/cn';

interface Tool {
    id: string;
    label: string;
    icon: any;
}

interface Category {
    category: string;
    tools: Tool[];
}

interface ScrollableNavProps {
    items: Category[];
    activeToolId: string;
}

export function ScrollableNav({ items, activeToolId }: ScrollableNavProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10); // buffer of 10px
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [items]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group mx-auto max-w-full">
            {/* Left Gradient & Button */}
            <div className={cn(
                "absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 flex items-center justify-start transition-all duration-300 pointer-events-none rounded-l-xl",
                canScrollLeft ? "opacity-100" : "opacity-0"
            )}>
                <button
                    onClick={() => scroll('left')}
                    className="pointer-events-auto ml-1 p-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors hover:scale-110 active:scale-95"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            {/* Right Gradient & Button */}
            <div className={cn(
                "absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 flex items-center justify-end transition-all duration-300 pointer-events-none rounded-r-xl",
                canScrollRight ? "opacity-100" : "opacity-0"
            )}>
                <button
                    onClick={() => scroll('right')}
                    className="pointer-events-auto mr-1 p-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors hover:scale-110 active:scale-95"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="bg-card rounded-xl border border-border p-3 shadow-sm mb-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                <div className="flex items-center gap-6 min-w-max px-2">
                    {items.map((group) => (
                        <div key={group.category} className="flex items-center gap-2 border-r border-border pr-6 last:border-0 last:pr-0">
                            <span className="text-xs font-black uppercase text-foreground/80 tracking-widest whitespace-nowrap">{group.category}</span>
                            <div className="flex items-center gap-2">
                                {group.tools.map((tool) => (
                                    <Link
                                        key={tool.id}
                                        href={`/tools/${tool.id}`}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                                            activeToolId === tool.id
                                                ? "bg-accent text-white shadow-md transform scale-105"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tool.icon && (
                                            typeof tool.icon === 'string' ? (
                                                <span className="text-sm">{tool.icon}</span>
                                            ) : (
                                                <tool.icon size={14} />
                                            )
                                        )}
                                        <span>{tool.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
