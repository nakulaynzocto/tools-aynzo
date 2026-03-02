"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, Rocket, Sparkles, ExternalLink } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";

export default function AdCard() {
    const t = useTranslations('Marketing');
    const rate = t('rate');

    return (
        <div className="group relative overflow-hidden rounded-[2.5rem] border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.2)]">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
            
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="p-4 bg-primary rounded-2xl shadow-lg shadow-primary/20 text-white animate-bounce-slow">
                        <Rocket size={24} />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/20 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-400/30">
                        <Sparkles size={10} className="fill-yellow-600" /> Professional Service
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight text-foreground leading-tight">
                        {t('adCardTitle')}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {t('adCardDesc', { rate })}
                    </p>
                </div>

                <div className="pt-4">
                    <a
                        href={getWhatsAppLink(rate)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95"
                    >
                        <MessageCircle size={18} />
                        {t('adCardCTA')}
                        <ExternalLink size={14} className="opacity-40" />
                    </a>
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />
        </div>
    );
}
