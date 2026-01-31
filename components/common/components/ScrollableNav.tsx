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
                "absolute left-0 top-0 bottom-4 sm:bottom-6 w-12 sm:w-16 bg-gradient-to-r from-background via-background/80 to-transparent z-10 flex items-center justify-start transition-all duration-300 pointer-events-none rounded-l-xl",
                canScrollLeft ? "opacity-100" : "opacity-0"
            )}>
                <button
                    onClick={() => scroll('left')}
                    className="pointer-events-auto ml-0.5 sm:ml-1 p-2 sm:p-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors hover:scale-110 active:scale-95 touch-manipulation"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>

            {/* Right Gradient & Button */}
            <div className={cn(
                "absolute right-0 top-0 bottom-4 sm:bottom-6 w-12 sm:w-16 bg-gradient-to-l from-background via-background/80 to-transparent z-10 flex items-center justify-end transition-all duration-300 pointer-events-none rounded-r-xl",
                canScrollRight ? "opacity-100" : "opacity-0"
            )}>
                <button
                    onClick={() => scroll('right')}
                    className="pointer-events-auto mr-0.5 sm:mr-1 p-2 sm:p-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors hover:scale-110 active:scale-95 touch-manipulation"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="bg-card rounded-xl border border-border p-2 sm:p-3 shadow-sm mb-4 sm:mb-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                <div className="flex items-center gap-3 sm:gap-6 min-w-max px-1 sm:px-2">
                    {items.map((group) => (
                        <div key={group.category} className="flex items-center gap-1.5 sm:gap-2 border-r border-border pr-3 sm:pr-6 last:border-0 last:pr-0">
                            <span className="text-[10px] sm:text-xs font-black uppercase text-foreground/80 tracking-widest whitespace-nowrap" dir="auto">{group.category}</span>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                {group.tools.map((tool) => (
                                    <Link
                                        key={tool.id}
                                        href={`/tools/${tool.id}`}
                                        className={cn(
                                            "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap touch-manipulation",
                                            activeToolId === tool.id
                                                ? "bg-accent text-white shadow-md transform scale-105"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95"
                                        )}
                                    >
                                        {tool.icon && (
                                            typeof tool.icon === 'string' ? (
                                                <span className="text-xs sm:text-sm">{tool.icon}</span>
                                            ) : (
                                                <tool.icon size={12} className="sm:w-[14px] sm:h-[14px]" />
                                            )
                                        )}
                                        <span className="hidden sm:inline">{tool.label}</span>
                                        <span className="sm:hidden">{tool.label.split(' ')[0]}</span>
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
