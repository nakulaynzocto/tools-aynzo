'use client';

import { useState } from 'react';
import { Code2, Copy, Check, ExternalLink } from 'lucide-react';

interface EmbedWidgetProps {
    slug: string;
    toolName: string;
    locale?: string;
}

export function EmbedWidget({ slug, toolName, locale = 'en' }: EmbedWidgetProps) {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const embedUrl = `https://tools.aynzo.com/${locale}/tools/${slug}`;
    const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  title="${toolName} - Aynzo Tools"
  loading="lazy"
  style="border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.1);"
></iframe>
<p style="text-align:center; margin-top:8px; font-size:12px; color:#888;">
  Powered by <a href="https://tools.aynzo.com" target="_blank" rel="noopener">Aynzo Tools</a>
</p>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-card border border-border rounded-2xl p-5 mt-4">
            {/* Header Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 text-left group"
            >
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Code2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground text-sm">Embed this Tool on Your Website</p>
                        <p className="text-xs text-muted-foreground">Free to embed — no API key needed</p>
                    </div>
                </div>
                <span className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                </span>
            </button>

            {/* Expandable Content */}
            {isOpen && (
                <div className="mt-4 space-y-3">
                    <div className="relative bg-muted/60 rounded-xl border border-border overflow-hidden">
                        <pre className="text-xs text-muted-foreground p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {embedCode}
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all"
                        >
                            {copied ? (
                                <><Check className="h-3 w-3" /> Copied!</>
                            ) : (
                                <><Copy className="h-3 w-3" /> Copy</>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                            Paste this code anywhere in your HTML. The tool will load directly on your site —{' '}
                            <strong className="text-foreground">100% free, forever.</strong>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
