"use client";

import { Share2, Twitter, MessageCircle, Link2, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function ShareButtons({ title, url }: { title: string; url: string }) {
    const t = useTranslations('Share');

    const shareData = {
        title: title,
        text: `${t('shareThisTool')} ${title}`,
        url: url,
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success(t('linkCopied'));
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + url)}`, '_blank');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    return (
        <div className="flex flex-wrap items-center gap-3 py-6 border-t border-border mt-12">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Share2 className="h-4 w-4" /> {t('shareThisTool')}
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={shareOnTwitter}
                    className="p-2.5 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all"
                    title={t('shareOn', { network: 'Twitter' })}
                >
                    <Twitter className="h-4 w-4" />
                </button>
                <button
                    onClick={shareOnWhatsApp}
                    className="p-2.5 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                    title={t('shareOn', { network: 'WhatsApp' })}
                >
                    <MessageCircle className="h-4 w-4" />
                </button>
                <button
                    onClick={shareOnFacebook}
                    className="p-2.5 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
                    title={t('shareOn', { network: 'Facebook' })}
                >
                    <Facebook className="h-4 w-4" />
                </button>
                <button
                    onClick={copyToClipboard}
                    className="p-2.5 rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all"
                    title={t('copyLink')}
                >
                    <Link2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
