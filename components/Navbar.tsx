"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { toolCategories, searchTools } from '@/lib/tools';
import LanguageSwitcher from './LanguageSwitcher';
import { ModeToggle } from './ModeToggle';

import { useTranslations } from 'next-intl';

export default function Navbar() {
    const t = useTranslations('Navigation');
    const tApp = useTranslations('App');
    const tCategories = useTranslations('Categories');
    const tNavbar = useTranslations('NavbarCategories');
    const tTools = useTranslations('Tools');
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
                            <span className="text-foreground font-black text-xl tracking-tighter hidden md:inline-block lg:hidden xl:inline-block">
                                {tApp('name')}<span className="text-primary">{tApp('nameHighlight')}</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1 flex-1 justify-center xl:max-w-none">
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
                                                <button className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-all flex items-center gap-1 font-medium text-sm whitespace-nowrap">
                                                    {tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category.replace(' Tools', ''))}
                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                </button>

                                                {/* Mega Menu Dropdown */}
                                                {activeCategory === category && (
                                                    <div className={`absolute ${index > 2 ? 'right-0' : 'left-0'} mt-1 ${toolCategories[category as keyof typeof toolCategories].length > 20 ? 'w-[750px]' : 'w-[500px]'} bg-card rounded-lg shadow-2xl border border-border overflow-hidden z-50`}>
                                                        <div className="p-3 bg-secondary/50 border-b border-border">
                                                            <h3 className="text-foreground font-semibold text-sm">{tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}</h3>
                                                        </div>
                                                        <div className={`grid ${toolCategories[category as keyof typeof toolCategories].length > 20 ? 'grid-cols-3' : 'grid-cols-2'} gap-0 p-2`}>
                                                            {toolCategories[category as keyof typeof toolCategories].map((tool) => (
                                                                <Link
                                                                    key={tool.slug}
                                                                    href={`/tools/${tool.slug}`}
                                                                    className="block px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-sm rounded-md m-1"
                                                                    onClick={() => setActiveCategory(null)}
                                                                >
                                                                    {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}

                                    {/* More Dropdown */}
                                    <div
                                        className="relative group block"
                                        onMouseEnter={() => handleMouseEnter('More')}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <button className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-all flex items-center gap-1 font-medium text-sm whitespace-nowrap">
                                            {t('more')}
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </button>

                                        {activeCategory === 'More' && (
                                            <div className="absolute right-0 mt-1 w-[250px] bg-card rounded-lg shadow-2xl border border-border z-[60] py-2">
                                                <div className="space-y-0.5">
                                                    {categories.map((category, idx) => {
                                                        const displayClass = getVisibilityClasses(idx, true);

                                                        // Optimization: If displayClass is 'hidden hidden hidden hidden' (meaning hidden everywhere), don't render?
                                                        // Actually, 'More' logic: if idx < countLG, it is hidden on LG. 
                                                        // If idx is very large, it is ALWAYS block.

                                                        return (
                                                            <div key={category} className={`group/nested relative px-1 ${displayClass}`}>
                                                                <button className="w-full text-left px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-sm rounded-md flex justify-between items-center group-hover/nested:bg-secondary">
                                                                    {tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category.replace(' Tools', ''))}
                                                                    <ChevronDown className="h-3.5 w-3.5 -rotate-90 group-hover/nested:rotate-0 transition-transform duration-300" />
                                                                </button>
                                                                {/* Nested Sub-menu */}
                                                                <div className="absolute top-0 right-full w-[280px] bg-card rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border z-[70] overflow-hidden invisible opacity-0 -translate-x-2 group-hover/nested:visible group-hover/nested:opacity-100 group-hover/nested:translate-x-0 transition-all duration-300">
                                                                    <div className="p-4 bg-muted/30 border-b border-border">
                                                                        <h3 className="text-foreground font-bold text-xs uppercase tracking-widest">{tNavbar.has(category) ? tNavbar(category) : (tCategories.has(category) ? tCategories(category) : category)}</h3>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 gap-0.5 p-1.5 max-h-[400px] overflow-y-auto">
                                                                        {toolCategories[category as keyof typeof toolCategories].map((tool) => (
                                                                            <Link
                                                                                key={tool.slug}
                                                                                href={`/tools/${tool.slug}`}
                                                                                className="block px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-sm rounded-md truncate"
                                                                                onClick={() => setActiveCategory(null)}
                                                                            >
                                                                                {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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
                                className="pl-9 pr-4 py-2 w-32 xl:w-48 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-secondary/80 focus:w-48 xl:focus:w-64 transition-all text-sm"
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

                    <div className="hidden lg:block">
                        <LanguageSwitcher />
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
                        <div className="p-4 border-b border-border flex justify-end">
                            <LanguageSwitcher />
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
