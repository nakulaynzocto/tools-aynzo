"use client";
import { Link, usePathname } from '@/navigation';
import Image from 'next/image';
import { Trophy, Calendar, Zap, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export default function CricketNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'Match Hub', href: '/tools/cricket', icon: Zap },
        { name: 'IPL Schedule', href: '/tools/cricket/schedule', icon: Calendar },
        { name: 'AI Predictor', href: '/tools/cricket/ai-predictor', icon: Trophy },
        { name: 'Points Table', href: '/tools/cricket/points-table', icon: BarChart3 },
    ];

    return (
        <nav className="sticky top-0 z-[100] bg-[#D11414] shadow-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 md:h-16">
                    {/* Logo & Brand - Clean Professional Label */}
                    <Link href="/tools/cricket" className="flex items-center gap-2 group">
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl md:text-2xl tracking-tighter leading-none italic uppercase">
                                CRICKET <span className="text-white/80 font-extrabold">AI</span>
                            </span>
                            <span className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-black leading-none mt-1">
                                Match Predictor
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            // Exact path check
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-wide",
                                        isActive 
                                            ? "bg-white text-[#D11414] shadow-sm" 
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#D11414]" : "text-white/60")} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

        </nav>
    );
}
