"use client";

import { getWhatsAppLink } from "@/lib/constants";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function PromotionalBanner() {
    const t = useTranslations('Marketing');
    const [isVisible, setIsVisible] = useState(false);
    const rate = t('rate');

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="relative group bg-slate-900 isolate flex items-center gap-x-6 overflow-hidden px-6 py-2 md:py-2.5 sm:px-3.5 sm:before:flex-1 animate-in slide-in-from-top duration-700 border-b border-white/10 shadow-lg">
            {/* Dynamic Slate/Indigo Gradient Blobs */}
            <div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
                <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-slate-400 to-indigo-500 opacity-20 animate-pulse" style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 34.1%, 55.9% 57.4%, 40.4% 2.1%, 74.8% 41.9%)' }}></div>
            </div>
            <div className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
                <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-indigo-300 to-slate-500 opacity-20 animate-pulse delay-500" style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 34.1%, 55.9% 57.4%, 40.4% 2.1%, 74.8% 41.9%)' }}></div>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 relative z-10">
                <div className="text-xs md:text-sm leading-6 text-white font-medium flex items-center gap-2">
                    <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                    </div>
                    <strong className="font-black flex items-center gap-2 uppercase italic tracking-tight">
                        {t('bannerText', { rate })}
                    </strong>
                </div>
                <a
                    href={getWhatsAppLink(rate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-none rounded-xl bg-white px-4 py-1.5 text-[10px] font-black text-slate-800 shadow-xl shadow-black/10 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest border border-transparent hover:border-slate-800/10"
                >
                    {t('ctaWhatsApp')} <MessageCircle size={14} />
                </a>
            </div>
            <div className="flex flex-1 justify-end relative z-10">
                <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={() => setIsVisible(false)}>
                    <span className="sr-only">Dismiss</span>
                    <div className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                        <X className="h-4 w-4 text-white" aria-hidden="true" />
                    </div>
                </button>
            </div>
        </div>
    );
}
