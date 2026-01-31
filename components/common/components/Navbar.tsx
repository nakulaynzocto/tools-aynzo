"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Menu, X, ChevronDown, Search, Image as ImageIcon, FileText, Type, Code, ArrowRightLeft, Settings as SettingsIcon, Shield, Hash, Layout, Share2, Youtube, Search as SearchIcon, Globe, Smartphone, Calculator } from 'lucide-react';
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
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
                            <span className="text-foreground font-black text-lg md:text-xl tracking-tighter inline-block">
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
                            // 1. Calculate Costs (Estimated Widths)
                            const categories = Object.keys(toolCategories);
                            const categoryCosts = categories.map(cat => {
                                const label = tNavbar.has(cat) ? tNavbar(cat) : (tCategories.has(cat) ? tCategories(cat) : cat.replace(' Tools', ''));
                                // Avg char width ~8.5px + 50px padding/icon overhead
                                return (label.length * 8.5) + 50;
                            });

                            // 2. Determine Limits for Breakpoints
                            // Available space estimates: LG=480px, XL=700px, 2XL=950px
                            const BUDGET_LG = 480;
                            const BUDGET_XL = 700;
                            const BUDGET_2XL = 950;

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

                            // Ensure realistic minimums (fallback to safe conservative if calc fails weirdly)
                            countLG = Math.max(1, countLG);
                            countXL = Math.max(countLG, countXL);
                            count2XL = Math.max(countXL, count2XL);

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
                                    const lgClass = index < countLG ? 'lg:block' : 'lg:hidden';
                                    const xlClass = index < countXL ? 'xl:block' : 'xl:hidden';
                                    const xxlClass = index < count2XL ? '2xl:block' : '2xl:hidden';
                                    return `hidden ${lgClass} ${xlClass} ${xxlClass}`;
                                } else {
                                    // More Menu Item (Inverse)
                                    // If visible in main, hidden here.
                                    const lgClass = index < countLG ? 'lg:hidden' : 'lg:block';
                                    const xlClass = index < countXL ? 'xl:hidden' : 'xl:block';
                                    const xxlClass = index < count2XL ? '2xl:hidden' : '2xl:block';
                                    return `block ${lgClass} ${xlClass} ${xxlClass}`;
                                }
                            };

                            return (
                                <>
                                    {categories.map((category, index) => {
                                        // Max limit for DOM cleanliness (optional, prevent rendering items that never show)
                                        // If index >= count2XL, it never shows in main menu.
                                        if (index >= count2XL && index >= 6) return null; // Keep some buffer

                                        return (
                                            <div
                                                key={category}
                                                className={`relative group ${getVisibilityClasses(index, false)}`}
                                                onMouseEnter={() => handleMouseEnter(category)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <button className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-all flex items-center gap-1 font-medium text-[15.5px] whitespace-nowrap">
                                                    {tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category.replace(' Tools', ''))}
                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                </button>

                                                {/* Mega Menu Dropdown */}
                                                {activeCategory === category && (() => {
                                                    const hasGroups = toolCategories[category as keyof typeof toolCategories].some(tool => tool.group);
                                                    
                                                    // Calculate grouped tools once for reuse
                                                    const groupedTools = hasGroups ? toolCategories[category as keyof typeof toolCategories].reduce((acc, tool) => {
                                                        const g = tool.group || 'other';
                                                        if (!acc[g]) acc[g] = [];
                                                        acc[g].push(tool);
                                                        return acc;
                                                    }, {} as Record<string, typeof toolCategories[string]>) : {};
                                                    
                                                    const groupCount = Object.keys(groupedTools).length;
                                                    let dropdownWidth = "";
                                                    
                                                    if (hasGroups) {
                                                        // Dynamic width based on number of columns to prevent text overlap
                                                        // Each column needs ~180-200px + gaps + padding
                                                        if (groupCount <= 2) {
                                                            dropdownWidth = "w-auto min-w-[500px] max-w-[95vw] lg:min-w-[600px] lg:max-w-[700px]";
                                                        } else if (groupCount <= 3) {
                                                            dropdownWidth = "w-auto min-w-[650px] max-w-[95vw] lg:min-w-[750px] lg:max-w-[900px]";
                                                        } else if (groupCount <= 4) {
                                                            dropdownWidth = "w-auto min-w-[750px] max-w-[95vw] lg:min-w-[850px] lg:max-w-[1050px]";
                                                        } else if (groupCount <= 5) {
                                                            dropdownWidth = "w-auto min-w-[900px] max-w-[95vw] lg:min-w-[1050px] lg:max-w-[1250px]";
                                                        } else {
                                                            dropdownWidth = "w-auto min-w-[1000px] max-w-[95vw] lg:min-w-[1200px] lg:max-w-[1500px]";
                                                        }
                                                    }
                                                    
                                                    // Dynamic grid columns based on number of groups
                                                    let gridCols = 'grid-cols-2';
                                                    if (groupCount <= 2) gridCols = 'grid-cols-2';
                                                    else if (groupCount <= 3) gridCols = 'grid-cols-3';
                                                    else if (groupCount <= 4) gridCols = 'grid-cols-4';
                                                    else if (groupCount <= 5) gridCols = 'grid-cols-5';
                                                    else gridCols = 'grid-cols-6';
                                                    
                                                    return (
                                                        <div className={cn(
                                                            "mt-1 bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200",
                                                            hasGroups
                                                                ? `fixed left-1/2 -translate-x-1/2 top-16 ${dropdownWidth} p-6 lg:p-8`
                                                                : cn("absolute", index > 2 ? 'right-0' : 'left-0', "w-auto min-w-[300px] max-w-[500px] lg:max-w-[750px]", toolCategories[category as keyof typeof toolCategories].length > 20 && "lg:max-w-[750px]")
                                                        )}>
                                                            {!hasGroups ? (
                                                            <>
                                                                <div className="p-3 bg-secondary/50 border-b border-border">
                                                                    <h3 className="text-foreground font-semibold text-sm">{tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}</h3>
                                                                </div>
                                                                <div className={`grid ${toolCategories[category as keyof typeof toolCategories].length > 20 ? 'grid-cols-3' : 'grid-cols-2'} gap-0 p-2`}>
                                                                    {toolCategories[category as keyof typeof toolCategories].map((tool) => (
                                                                        <Link
                                                                            key={tool.slug}
                                                                            href={`/tools/${tool.slug}`}
                                                                            className="block px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-[15.6px] rounded-md m-1"
                                                                            onClick={() => setActiveCategory(null)}
                                                                        >
                                                                            {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className={`grid ${gridCols} gap-6 lg:gap-8`}>
                                                                {Object.entries(groupedTools).map(([group, tools]) => (
                                                                    <div key={group} className="space-y-3 min-w-[160px]">
                                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary border-b border-border pb-1.5 mb-2 whitespace-nowrap">
                                                                            {tImageGroups.has(group) ? tImageGroups(group) : group}
                                                                        </h4>
                                                                        <div className="flex flex-col gap-1.5">
                                                                            {tools.map((tool) => (
                                                                                <Link
                                                                                    key={tool.slug}
                                                                                    href={`/tools/${tool.slug}`}
                                                                                    className="text-[16.25px] text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 duration-200 break-words"
                                                                                    onClick={() => setActiveCategory(null)}
                                                                                >
                                                                                    {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
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
                                        <button className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-all flex items-center gap-1 font-medium text-[15.5px] whitespace-nowrap">
                                            {t('allTools')}
                                            <ChevronDown className={`h-4 w-4 transition-transform ${activeCategory === 'AllTools' ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* MEGA MENU CONTAINER */}
                                        {activeCategory === 'AllTools' && (
                                            <div className="fixed top-16 left-0 w-full bg-card border-b border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="max-w-[1400px] mx-auto p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-10">
                                                        {Object.entries(toolCategories).map(([category, tools], idx) => {
                                                            const displayClass = getVisibilityClasses(idx, true);
                                                            // If displayClass hides it on all larger screens (lg/xl/2xl), we keep it in ALL TOOLS.
                                                            // If it's visible in the top bar, we hide it here to avoid duplication.

                                                            // Map categories to icons
                                                            const getCategoryIcon = (cat: string) => {
                                                                const c = cat.toLowerCase();
                                                                if (c.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
                                                                if (c.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
                                                                if (c.includes('text')) return <Type className="w-5 h-5 text-emerald-500" />;
                                                                if (c.includes('developer') || c.includes('dev')) return <Code className="w-5 h-5 text-purple-500" />;
                                                                if (c.includes('converter')) return <ArrowRightLeft className="w-5 h-5 text-orange-500" />;
                                                                if (c.includes('utility')) return <SettingsIcon className="w-5 h-5 text-sky-500" />;
                                                                if (c.includes('security')) return <Shield className="w-5 h-5 text-red-600" />;
                                                                if (c.includes('crypto')) return <Hash className="w-5 h-5 text-amber-500" />;
                                                                if (c.includes('seo')) return <SearchIcon className="w-5 h-5 text-indigo-500" />;
                                                                if (c.includes('keyword')) return <Layout className="w-5 h-5 text-rose-500" />;
                                                                if (c.includes('webmaster')) return <Globe className="w-5 h-5 text-blue-600" />;
                                                                if (c.includes('social')) return <Share2 className="w-5 h-5 text-pink-500" />;
                                                                if (c.includes('youtube')) return <Youtube className="w-5 h-5 text-red-500" />;
                                                                if (c.includes('tech')) return <Smartphone className="w-5 h-5 text-zinc-500" />;
                                                                if (c.includes('calculator')) return <Calculator className="w-5 h-5 text-green-600" />;
                                                                return <SettingsIcon className="w-5 h-5" />;
                                                            };

                                                            return (
                                                                <div key={category} className={cn("space-y-4", displayClass)}>
                                                                    <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                                                        {getCategoryIcon(category)}
                                                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">
                                                                            {tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}
                                                                        </h3>
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        {tools.map((tool) => (
                                                                            <Link
                                                                                key={tool.slug}
                                                                                href={`/tools/${tool.slug}`}
                                                                                className="text-[16.25px] text-muted-foreground hover:text-primary transition-colors font-medium hover:translate-x-1 duration-200"
                                                                                onClick={() => setActiveCategory(null)}
                                                                            >
                                                                                {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
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

                    {/* Search - Desktop */}
                    <div className="hidden lg:block relative ml-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchQuery.length > 0 && setShowSearch(true)}
                                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                                className="pl-9 pr-4 py-2 w-32 xl:w-48 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-secondary/80 focus:w-48 xl:focus:w-64 transition-all text-[15.5px]"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearch && searchResults.length > 0 && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-card rounded-lg shadow-2xl border border-border max-h-96 overflow-y-auto z-50">
                                {searchResults.map((tool) => (
                                    <Link
                                        key={tool.slug}
                                        href={`/tools/${tool.slug}`}
                                        className="block px-4 py-3 hover:bg-secondary transition-all border-b border-border last:border-0"
                                        onClick={() => {
                                            setShowSearch(false);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <div className="font-medium text-foreground text-sm">{tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{tool.category}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:flex items-center gap-2">
                        <LanguageSwitcher />
                        <ModeToggle />
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
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-border bg-secondary text-foreground rounded-lg focus:outline-none focus:border-foreground/50 text-sm"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                                    {searchResults.slice(0, 8).map((tool) => (
                                        <Link
                                            key={tool.slug}
                                            href={`/tools/${tool.slug}`}
                                            className="block p-2.5 hover:bg-secondary rounded-md border border-border"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                        >
                                            <div className="font-medium text-foreground text-sm">{tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{tool.category}</div>
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
                                    className="w-full px-4 py-3.5 flex items-center justify-between text-left font-semibold text-foreground hover:bg-secondary text-sm"
                                >
                                    <span>{tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${activeCategory === category ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {activeCategory === category && (
                                    <div className="bg-muted/50 px-4 pb-2">
                                        {tools.map((tool) => (
                                            <Link
                                                key={tool.slug}
                                                href={`/tools/${tool.slug}`}
                                                className="block py-2.5 text-muted-foreground hover:text-foreground text-sm pl-2"
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
        </nav >
    );
}
