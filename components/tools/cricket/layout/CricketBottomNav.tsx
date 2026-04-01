"use client";
import { Link, usePathname } from '@/navigation';
import { LayoutGrid, Zap, Trophy, Calendar, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function CricketBottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: 'Matches', href: '/tools/cricket', icon: Home },
        { name: 'Schedule', href: '/tools/cricket/schedule', icon: Calendar },
        { name: 'Predictor', href: '/tools/cricket/ai-predictor', icon: Zap, highlight: true },
        { name: 'Standings', href: '/tools/cricket/points-table', icon: Trophy },
    ];

    return (
        <div className="md:hidden fixed bottom-1 left-0 right-0 z-[100] px-4 pb-4">
           {/* Floating Bottom Bar style like high-end apps */}
           <div className="bg-white border border-slate-200/50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-around h-16 px-2 overflow-hidden backdrop-blur-md bg-white/95">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    
                    // Improved active logic for sub-pages
                    const isActive = tab.href === '/tools/cricket' 
                        ? (pathname === tab.href || (pathname.startsWith('/tools/cricket/') && !tabs.some(t => t.href !== '/tools/cricket' && pathname.startsWith(t.href))))
                        : pathname.startsWith(tab.href);

                    return (
                        <Link 
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all relative overflow-hidden",
                                isActive ? "text-[#D11414]" : "text-slate-400"
                            )}
                        >
                            {/* Active Indicator bar - cleaner look */}
                            <div className={cn(
                                "absolute top-0 w-8 h-1 bg-[#D11414] rounded-full transition-all duration-300",
                                isActive ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                            )} />
                            
                            <div className={cn(
                                "p-1.5 transition-transform",
                                isActive && "scale-110",
                                tab.highlight && "bg-[#D11414]/5 rounded-xl p-2 border border-[#D11414]/10"
                            )}>
                               <Icon size={isActive ? 22 : 20} className={cn(isActive && "fill-[#D11414]/10")} />
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-tighter mt-0.5",
                                isActive ? "text-[#D11414]" : "text-slate-500"
                            )}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
           </div>
        </div>
    );
}
