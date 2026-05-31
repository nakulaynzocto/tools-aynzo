'use client';
import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings, Info, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: true,
        marketing: true
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent-preferences');
        if (!consent) {
            // Smooth delay for visual delight
            const timer = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const prefs = { essential: true, analytics: true, marketing: true };
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(prefs));
        setVisible(false);
    };

    const handleAcceptSelected = () => {
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(preferences));
        setVisible(false);
    };

    const handleDeclineAll = () => {
        const prefs = { essential: true, analytics: false, marketing: false };
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(prefs));
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 right-0 z-[9999] w-full p-4 md:p-6 md:max-w-md animate-in slide-in-from-bottom-8 duration-500 ease-out">
            {/* Main Premium Floating Card */}
            <div className="relative overflow-hidden bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-5 md:p-6">
                
                {/* Decorative Premium Glow Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
                
                {/* Background Ambient Aura */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/10">
                        <Cookie size={18} className="animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black text-foreground flex items-center gap-1.5 leading-none">
                            Cookie Preference <Sparkles size={14} className="text-primary" />
                        </h3>
                        <p className="text-[10px] font-bold text-primary tracking-wider uppercase mt-1">
                            Aynzo Privacy Shield
                        </p>
                    </div>
                    <button
                        onClick={handleDeclineAll}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-lg"
                        aria-label="Close and decline non-essential cookies"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Card Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                    We use cookies to personalize content and ads, analyze traffic, and ensure site security. Google AdSense serves tailored ads based on your browser history. You can customize your preferences below.{' '}
                    <Link href="/privacy" className="text-primary hover:underline font-bold whitespace-nowrap">
                        Cookie Policy →
                    </Link>
                </p>

                {/* Smooth Customization Settings Drawer */}
                {showDetails && (
                    <div className="space-y-3 mb-5 border-t border-border/60 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        
                        {/* Essential Category */}
                        <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-secondary/30 border border-border/40">
                            <div className="flex-1">
                                <span className="text-xs font-bold text-foreground block">Necessary Cookies</span>
                                <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">Required for the core website functionality.</span>
                            </div>
                            <div className="w-8 h-5 bg-primary/20 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                            </div>
                        </div>

                        {/* Analytics Category */}
                        <label className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-secondary/30 border border-border/40 hover:border-primary/20 transition-all cursor-pointer group">
                            <div className="flex-1">
                                <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">Performance & Analytics</span>
                                <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">Anonymous metrics to understand popular tools and optimize load speeds.</span>
                            </div>
                            <div className="relative mt-0.5 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={preferences.analytics}
                                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-8 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3" />
                            </div>
                        </label>

                        {/* Marketing/Ads Category */}
                        <label className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-secondary/30 border border-border/40 hover:border-primary/20 transition-all cursor-pointer group">
                            <div className="flex-1">
                                <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">Targeted Advertising</span>
                                <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">Google AdSense personalized ads matched to your demographic interest.</span>
                            </div>
                            <div className="relative mt-0.5 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={preferences.marketing}
                                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-8 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3" />
                            </div>
                        </label>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5">
                    {showDetails ? (
                        <button
                            onClick={handleAcceptSelected}
                            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
                        >
                            <Check size={14} /> Save Preferences
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-primary/15"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleDeclineAll}
                                className="flex-1 border border-border text-foreground hover:border-primary hover:text-primary py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                Decline
                            </button>
                        </div>
                    )}
                    
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-[11px] text-muted-foreground hover:text-primary font-bold transition-colors text-center py-1 mt-1 underline underline-offset-4"
                    >
                        {showDetails ? 'Hide Cookie Settings' : 'Customize Preferences'}
                    </button>
                </div>

            </div>
        </div>
    );
}
