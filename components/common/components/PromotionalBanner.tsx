"use client";

import { getWhatsAppLink } from "@/lib/constants";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function PromotionalBanner() {
    const t = useTranslations('Marketing');
    const [isVisible, setIsVisible] = useState(false);
    const rate = t('rate');

    const pathname = usePathname();

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible || pathname.includes('/admin')) return null;

    return (
        <div className="relative bg-primary text-white overflow-hidden py-3 px-4 sm:px-6 animate-in slide-in-from-top duration-500">
            {/* Ambient Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-primary to-purple-600 opacity-90" />
            
            <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-8 sm:pr-0">
                {/* Text and Icon */}
                <div className="flex items-start sm:items-center gap-2.5">
                    <div className="bg-white/10 p-1.5 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed sm:leading-normal">
                        {t('bannerText', { rate })}
                    </p>
                </div>

                {/* Call To Action Button */}
                <a
                    href={getWhatsAppLink(rate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 bg-white text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-white/95 active:scale-95 transition-all shadow-sm shadow-black/10"
                >
                    {t('ctaWhatsApp')} <MessageCircle size={14} />
                </a>
            </div>

            {/* Absolute Position Close Button to prevent layout squishing */}
            <button 
                type="button" 
                onClick={() => setIsVisible(false)}
                className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Dismiss banner"
            >
                <X size={16} />
            </button>
        </div>
    );
}
