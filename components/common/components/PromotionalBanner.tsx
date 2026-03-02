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
        <div className="relative group bg-primary isolate flex items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 sm:before:flex-1 animate-in slide-in-from-top duration-700">
            <div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
                <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 34.1%, 55.9% 57.4%, 40.4% 2.1%, 74.8% 41.9%)' }}></div>
            </div>
            <div className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
                <div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 52.8% 34.1%, 55.9% 57.4%, 40.4% 2.1%, 74.8% 41.9%)' }}></div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-white font-medium">
                    <strong className="font-black flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                        {t('bannerText', { rate })}
                    </strong>
                </p>
                <a
                    href={getWhatsAppLink(rate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-none rounded-full bg-white px-3.5 py-1 text-xs font-black text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-tight"
                >
                    {t('ctaWhatsApp')} <MessageCircle size={14} />
                </a>
            </div>
            <div className="flex flex-1 justify-end">
                <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]" onClick={() => setIsVisible(false)}>
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5 text-white/70 hover:text-white transition-colors" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
