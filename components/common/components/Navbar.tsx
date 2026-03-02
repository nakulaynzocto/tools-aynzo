"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Menu, X, ChevronDown, Search, Image as ImageIcon, FileText, Type, Code, ArrowRightLeft, Settings as SettingsIcon, Shield, Hash, Layout, Share2, Youtube, Search as SearchIcon, Globe, Smartphone, Calculator, Zap } from 'lucide-react';
import { toolCategories, searchTools } from '@/lib/tools';
import LanguageSwitcher from './LanguageSwitcher';
import { ModeToggle } from './ModeToggle';
import { cn } from '@/utils/cn';

import { useTranslations } from 'next-intl';

export default function Navbar() {
    const t = useTranslations('Navigation');
    const tApp = useTranslations('App');
    const tCategories = useTranslations('Categories');
    const tNavbar = useTranslations('NavbarCategories');
    const tTools = useTranslations('Tools');
    const tImageGroups = useTranslations('ImageGroups');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Timeout ref for hover intent
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (category: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setActiveCategory(category);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActiveCategory(null);
        }, 300);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = searchTools(query);
            setSearchResults(results);
            setShowSearch(true);
        } else {
            setSearchResults([]);
            setShowSearch(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="w-full px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 flex-shrink-0 group">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    fill
                                    priority
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
                            <span className="text-foreground font-bold text-lg md:text-xl tracking-tight inline-block">
                                {tApp('name')}<span className="text-primary">{tApp('nameHighlight')}</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1 flex-1 justify-center xl:max-w-none">
                        {/* Existing Dynamic Categories */}
                        {/* 
                         Dynamic Responsive Logic:
                         Calculates how many items fit based on character length of the executed translation.
                        */}
                        {(() => {
                            // Helper function to detect CJK (Chinese, Japanese, Korean) characters
                            const hasCJK = (text: string): boolean => {
                                return /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/.test(text);
                            };

                            // Helper function to detect Arabic/Hebrew (RTL languages)
                            const hasRTL = (text: string): boolean => {
                                return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
                            };

                            // Helper function to detect Cyrillic (Russian, etc.)
                            const hasCyrillic = (text: string): boolean => {
                                return /[\u0400-\u04FF]/.test(text);
                            };

                            // Helper function to detect Devanagari (Hindi, etc.)
                            const hasDevanagari = (text: string): boolean => {
                                return /[\u0900-\u097F]/.test(text);
                            };

                            // Helper function to calculate text width
                            const calculateTextWidth = (text: string): number => {
                                if (hasCJK(text)) {
                                    // CJK characters are wider: ~16-18px per character
                                    return (text.length * 16) + 30;
                                } else if (hasDevanagari(text)) {
                                    // Hindi: ~12-14px per character
                                    return (text.length * 12.5) + 30;
                                } else if (hasRTL(text)) {
                                    // RTL characters (Arabic, Hebrew): ~10-12px per character
                                    return (text.length * 11) + 30;
                                } else if (hasCyrillic(text)) {
                                    // Cyrillic characters: ~9-10px per character
                                    return (text.length * 9.5) + 30;
                                } else {
                                    // English/Latin characters: ~8.5px per character
                                    // For longer German/compound words, add slight buffer
                                    const baseWidth = text.length * 8.5;
                                    // If text is very long (like German compound words), add extra buffer
                                    const extraBuffer = text.length > 25 ? (text.length - 25) * 2 : 0;
                                    return baseWidth + extraBuffer + 30;
                                }
                            };

                            // 1. Calculate Costs (Estimated Widths)
                            const categories = Object.keys(toolCategories);
                            const categoryCosts = categories.map(cat => {
                                const label = tNavbar.has(cat) ? tNavbar(cat) : (tCategories.has(cat) ? tCategories(cat) : cat.replace(' Tools', ''));
                                return calculateTextWidth(label);
                            });

                            // 2. Determine Limits for Breakpoints
                            // Available space estimates: LG=600px, XL=850px, 2XL=1100px
                            const BUDGET_LG = 600;
                            const BUDGET_XL = 850;
                            const BUDGET_2XL = 1100;

                            let acc = 0;
                            let countLG = 0;
                            let countXL = 0;
                            let count2XL = 0;

                            for (let i = 0; i < categoryCosts.length; i++) {
                                acc += categoryCosts[i];
                                if (acc < BUDGET_LG) countLG++;
                                if (acc < BUDGET_XL) countXL++;
                                if (acc < BUDGET_2XL) count2XL++;
                            }

                            // Ensure realistic minimums
                            // Hydration-safe defaults for server/initial render
                            const finalLG = mounted ? Math.max(1, countLG) : 1;
                            const finalXL = mounted ? Math.max(finalLG, countXL) : 2;
                            const final2XL = mounted ? Math.max(finalXL, count2XL) : 3;

                            // Helper to generate classes
                            const getVisibilityClasses = (index: number, isMoreMenu: boolean) => {
                                // For Main Menu:
                                // Default: hidden
                                // LG: block if index < countLG
                                // XL: block if index < countXL
                                // 2XL: block if index < count2XL

                                // Tailwind logic needs to be explicit overrides
                                // Base: hidden
                                // lg: (index < countLG ? 'block' : 'hidden') -> actually if hidden base, we just need 'lg:block'
                                // But if index >= countLG, it stays hidden. 
                                // What if index < countXL but >= countLG? It needs 'xl:block'.

                                if (!isMoreMenu) {
                                    // Main Menu Item
                                    const lgClass = index < finalLG ? 'lg:block' : 'lg:hidden';
                                    const xlClass = index < finalXL ? 'xl:block' : 'xl:hidden';
                                    const xxlClass = index < final2XL ? '2xl:block' : '2xl:hidden';
                                    return `hidden ${lgClass} ${xlClass} ${xxlClass}`;
                                } else {
                                    // More Menu Item (Inverse)
                                    // If visible in main, hidden here.
                                    const lgClass = index < finalLG ? 'lg:hidden' : 'lg:block';
                                    const xlClass = index < finalXL ? 'xl:hidden' : 'xl:block';
                                    const xxlClass = index < final2XL ? '2xl:hidden' : '2xl:block';
                                    return `block ${lgClass} ${xlClass} ${xxlClass}`;
                                }
                            };

                            return (
                                <>
                                    {categories.map((category, index) => {
                                        // If index >= final2XL, it never shows in main menu.
                                        if (index >= final2XL) return null;

                                        return (
                                            <div
                                                key={category}
                                                className={`relative group ${getVisibilityClasses(index, false)}`}
                                                onMouseEnter={() => handleMouseEnter(category)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <button 
                                                    className={cn(
                                                        "px-4 py-2 text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 font-semibold text-[14.5px] whitespace-nowrap min-w-0 group-hover:bg-primary/5 rounded-lg",
                                                        activeCategory === category && "text-primary bg-primary/5"
                                                    )}
                                                    onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                                >
                                                    <span className="truncate max-w-[200px] sm:max-w-[250px]">{tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category.replace(' Tools', ''))}</span>
                                                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 opacity-60", activeCategory === category && "rotate-180 opacity-100")} />
                                                </button>

                                                {/* Mega Menu Dropdown */}
                                                {activeCategory === category && (() => {
                                                    // Simplify all dropdowns to move away from sub-grouping
                                                    const categoryTools = toolCategories[category as keyof typeof toolCategories] || [];
                                                    
                                                    // Dropdown appearance logic
                                                    const dropdownWidth = "w-[95vw] lg:w-[900px]";
                                                    const dropdownStyle: React.CSSProperties = {
                                                        maxWidth: '95vw',
                                                    };

                                                    return (
                                                        <div
                                                            className={cn(
                                                                "fixed inset-x-0 top-16 mx-auto z-[100] animate-in fade-in slide-in-from-top-2 duration-200 mt-1 bg-background rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border/60 overflow-hidden",
                                                                dropdownWidth
                                                            )}
                                                            style={dropdownStyle}
                                                        >
                                                            <div className="p-4 lg:p-6 max-h-[85vh] overflow-y-auto custom-scrollbar flex justify-center">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 w-full max-w-full justify-items-center md:justify-items-start">
                                                                    {categoryTools.map((tool) => (
                                                                        <Link
                                                                            key={tool.slug}
                                                                            href={`/tools/${tool.slug}`}
                                                                            prefetch={false}
                                                                            className="flex items-center gap-4 p-1.5 hover:bg-primary/5 rounded-xl transition-all group/tool border border-transparent hover:border-primary/10"
                                                                            onClick={() => setActiveCategory(null)}
                                                                        >
                                                                            <div className="h-9 w-9 flex-shrink-0 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover/tool:bg-primary group-hover/tool:text-white transition-all">
                                                                                <Zap size={16} />
                                                                            </div>
                                                                            <div className="flex flex-col min-w-0">
                                                                                <span className="text-[14.5px] font-bold text-foreground group-hover/tool:text-primary transition-colors leading-tight whitespace-nowrap truncate">
                                                                                    {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                                                </span>
                                                                            </div>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )
                                    })}

                                    {/* All Tools Mega Menu (Replacing 'More') */}
                                    <div
                                        className="relative group block"
                                        onMouseEnter={() => handleMouseEnter('AllTools')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <button 
                                            className={cn(
                                                "px-4 py-2 text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 font-semibold text-[14.5px] whitespace-nowrap min-w-0 hover:bg-primary/5 rounded-lg",
                                                activeCategory === 'AllTools' && "text-primary bg-primary/5"
                                            )}
                                            onClick={() => setActiveCategory(activeCategory === 'AllTools' ? null : 'AllTools')}
                                        >
                                            <span className="truncate max-w-[150px]">{t('allTools')}</span>
                                            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 opacity-60", activeCategory === 'AllTools' && "rotate-180 opacity-100")} />
                                        </button>

                                        {/* MEGA MENU CONTAINER */}
                                        {activeCategory === 'AllTools' && (
                                            <div className="fixed top-16 left-0 w-full bg-card border-b border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="max-w-[1400px] mx-auto p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-10">
                                                        {Object.entries(toolCategories).map(([category, tools], idx) => {
                                                            const displayClass = getVisibilityClasses(idx, true);
                                                            // If displayClass hides it on all larger screens (lg/xl/2xl), we keep it in ALL TOOLS.
                                                            // If it's visible in the top bar, we hide it here to avoid duplication.


                                                            return (
                                                                <div key={category} className={cn("space-y-4 w-full md:w-[250px] lg:w-[280px]", displayClass)}>
                                                                    <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-4">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                                                        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/80 break-words overflow-hidden flex-1">
                                                                            {tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}
                                                                        </h3>
                                                                    </div>
                                                                    <div className="flex flex-col gap-0">
                                                                        {tools.map((tool) => (
                                                                            <Link
                                                                                key={tool.slug}
                                                                                href={`/tools/${tool.slug}`}
                                                                                prefetch={false}
                                                                                className="flex items-start gap-4 p-1.5 hover:bg-primary/5 rounded-xl transition-all group/tool border border-transparent hover:border-primary/10"
                                                                                onClick={() => setActiveCategory(null)}
                                                                            >
                                                                                <div className="h-8 w-8 flex-shrink-0 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover/tool:bg-primary group-hover/tool:text-white transition-all">
                                                                                    <Zap size={14} />
                                                                                </div>
                                                                                <div className="flex flex-col min-w-0">
                                                                                    <span className="text-[13px] font-bold text-foreground group-hover/tool:text-primary transition-colors leading-tight whitespace-nowrap truncate">
                                                                                        {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                                                    </span>

                                                                                </div>
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="bg-muted/30 py-4 border-t border-border">
                                                    <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                                        <span>Explore {Object.values(toolCategories).flat().length} free online tools</span>
                                                        <div className="flex gap-6">
                                                            <span>No Signup Required</span>
                                                            <span className="text-emerald-500">Local Processing</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Action Hub - Professional & Clean */}
                    <div className="hidden lg:flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-full border border-border/40">
                            <LanguageSwitcher />
                            <div className="h-4 w-px bg-border/40 mx-1" />
                            <ModeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-md ml-2"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div >

            {/* Mobile Menu */}
            {
                mobileMenuOpen && (
                    <div className="lg:hidden bg-background border-t border-border max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {/* Mobile Language Switcher */}
                        <div className="p-4 border-b border-border flex justify-end gap-2 items-center">
                            <LanguageSwitcher />
                            <ModeToggle />
                        </div>
                        {/* Mobile Search */}
                        <div className="p-4 border-b border-border bg-card">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-border bg-secondary text-foreground rounded-lg focus:outline-none focus:border-foreground/50 text-sm break-words"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                                    {searchResults.slice(0, 8).map((tool) => (
                                        <Link
                                            key={tool.slug}
                                            href={`/tools/${tool.slug}`}
                                            prefetch={false}
                                            className="block p-2.5 hover:bg-secondary rounded-md border border-border"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                        >
                                            <div className="font-medium text-foreground text-sm break-words overflow-hidden line-clamp-2">{tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5 break-words overflow-hidden">{tool.category}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Categories */}
                        {Object.entries(toolCategories).map(([category, tools]) => (
                            <div key={category} className="border-b border-border">
                                <button
                                    onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                    className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-foreground hover:bg-secondary text-sm min-w-0"
                                >
                                    <span className="truncate flex-1">{tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform flex-shrink-0 ${activeCategory === category ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {activeCategory === category && (
                                    <div className="bg-muted/50 px-4 pb-2">
                                        {tools.map((tool) => (
                                            <Link
                                                key={tool.slug}
                                                href={`/tools/${tool.slug}`}
                                                prefetch={false}
                                                className="block py-2.5 text-muted-foreground hover:text-foreground text-sm pl-2 break-words overflow-hidden line-clamp-2"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }
        </nav>
    );
}
