"use client";

import { Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function BlogShareButtons({ title, url }: { title: string; url: string }) {
    const t = useTranslations('Share');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success(t('linkCopied') || "Link copied to clipboard!");
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={shareOnFacebook}
                className="h-10 w-10 flex items-center justify-center bg-card border-border hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:text-[#1877F2] transition-all rounded-full ring-1 ring-border"
                title="Share on Facebook"
            >
                <Facebook size={16} />
            </button>
            <button
                onClick={shareOnTwitter}
                className="h-10 w-10 flex items-center justify-center bg-card border-border hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 hover:text-[#1DA1F2] transition-all rounded-full ring-1 ring-border"
                title="Share on Twitter"
            >
                <Twitter size={16} />
            </button>
            <button
                onClick={shareOnLinkedin}
                className="h-10 w-10 flex items-center justify-center bg-card border-border hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:text-[#0A66C2] transition-all rounded-full ring-1 ring-border"
                title="Share on LinkedIn"
            >
                <Linkedin size={16} />
            </button>
            <button
                onClick={copyToClipboard}
                className="h-10 w-10 flex items-center justify-center bg-card border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all rounded-full ring-1 ring-border"
                title="Copy Link"
            >
                <Copy size={16} />
            </button>
        </div>
    );
}
