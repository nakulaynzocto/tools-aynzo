"use client";
import { useState, useEffect } from 'react';
import { Send, ExternalLink, RefreshCw, Copy, Check, Settings, X, MessageSquare, BadgeDollarSign, Hash, CheckCircle, ShieldCheck, Gavel, Music2, Link2 } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { cn } from '@/utils/cn';

import { SocialLinkToolProps } from '@/components/types/social/types';
import { generateWhatsAppLink, generateTelegramLink, generatePayPalLink, generateInstagramHashtags, validateEmail } from '@/components/utils/social/socialProcessing';
import { PrivacyPolicyGenerator } from './PrivacyPolicyGenerator';
import { TermsConditionsGenerator } from './TermsConditionsGenerator';
import { TikTokHashtagGenerator } from './TikTokHashtagGenerator';
import { BioLinkGenerator } from './BioLinkGenerator';

export default function SocialLinkToolsIndex({ type }: SocialLinkToolProps) {
    const socialNavTools = [
        {
            category: 'Messaging',
            tools: [
                { id: 'whatsapp-link-generator', label: 'WhatsApp', icon: MessageSquare },
                { id: 'telegram-link-generator', label: 'Telegram', icon: Send },
            ]
        },
        {
            category: 'Business & Legal',
            tools: [
                { id: 'privacy-policy-generator', label: 'Privacy Policy', icon: ShieldCheck },
                { id: 'terms-conditions-generator', label: 'Terms & Conditions', icon: Gavel },
                { id: 'paypal-link-generator', label: 'PayPal', icon: BadgeDollarSign },
            ]
        },
        {
            category: 'Social',
            tools: [
                { id: 'instagram-hashtag-generator', label: 'Hashtags', icon: Hash },
                { id: 'tiktok-hashtag-generator', label: 'TikTok Tags', icon: Music2 },
                { id: 'bio-link-generator', label: 'Bio Link', icon: Link2 },
            ]
        },
        {
            category: 'Utility',
            tools: [
                { id: 'email-validator', label: 'Email Verify', icon: CheckCircle },
                { id: 'url-opener', label: 'URL Opener', icon: ExternalLink },
            ]
        }
    ];

    // Early returns for standalone tools
    if (type === 'tiktok-hashtag-generator') {
        const allCats = [...socialNavTools];
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <ScrollableNav items={allCats} activeToolId={type} />
                <div className="bg-card rounded-3xl border-2 border-border shadow-2xl p-8">
                    <TikTokHashtagGenerator />
                </div>
            </div>
        );
    }

    if (type === 'bio-link-generator') {
        const allCats = [...socialNavTools];
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <ScrollableNav items={allCats} activeToolId={type} />
                <div className="bg-card rounded-3xl border-2 border-border shadow-2xl p-8">
                    <BioLinkGenerator />
                </div>
            </div>
        );
    }

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // States
    const [whatsapp, setWhatsapp] = useState({ phone: '', message: '' });
    const [telegram, setTelegram] = useState({ username: '', message: '' });
    const [paypal, setPaypal] = useState({ email: '', item: '', amount: '', currency: 'USD' });

    const activeCategory = socialNavTools.find(cat => cat.tools.some(t => t.id === type));

    const [input, setInput] = useState('');
    const [urls, setUrls] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (type === 'url-opener' || type === 'instagram-hashtag-generator' || type === 'privacy-policy-generator' || type === 'terms-conditions-generator') return; // defined manually or via button

        const process = () => {
            let output = '';
            switch (type) {
                case 'whatsapp-link-generator':
                    if (!whatsapp.phone) { setResult(null); return; }
                    const cleanPhone = whatsapp.phone.replace(/[^\d]/g, '');
                    output = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsapp.message)}`;
                    setResult(output);
                    break;
                case 'telegram-link-generator':
                    if (!telegram.username) { setResult(null); return; }
                    let username = telegram.username.trim();
                    if (username.includes('t.me/')) {
                        username = username.split('t.me/').pop() || '';
                    }
                    username = username.replace('@', '').split('?')[0].split('/')[0].trim();
                    if (!username) { setResult(null); return; }
                    output = `https://t.me/${username}${telegram.message ? `?text=${encodeURIComponent(telegram.message)}` : ''}`;
                    setResult(output);
                    break;
                case 'paypal-link-generator':
                    if (!paypal.email) { setResult(null); return; }
                    output = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypal.email}&item_name=${encodeURIComponent(paypal.item)}&amount=${paypal.amount}&currency_code=${paypal.currency}`;
                    setResult(output);
                    break;
                // case 'instagram-hashtag-generator': moved to handleProcess
                //     break;
                case 'email-validator':
                    if (!email) { setResult(null); return; }
                    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    setResult(isValid ? 'Valid Email Address ✅' : 'Invalid Email Address ❌');
                    break;
            }
        };

        process();
    }, [type, whatsapp, telegram, paypal, hashtag, email]);

    const handleProcess = () => {
        if (type === 'url-opener') {
            const urlList = urls.split('\n').filter(u => u.trim()).map(u => {
                let url = u.trim();
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                return url;
            });

            if (urlList.length === 0) {
                setResult('Please enter at least one URL.');
                return;
            }

            let openedCount = 0;
            let blockedCount = 0;

            urlList.forEach((url, i) => {
                try {
                    const newWindow = window.open(url, '_blank');
                    if (newWindow) {
                        openedCount++;
                    } else {
                        blockedCount++;
                    }
                } catch (error) {
                    blockedCount++;
                }
            });

            if (blockedCount > 0) {
                setResult(`Opened ${openedCount} link(s). ${blockedCount} link(s) were blocked by popup blocker. Please allow popups for this site.`);
            } else {
                setResult(`Successfully opened ${openedCount} link(s) in new tabs.`);
            }
        } else if (type === 'instagram-hashtag-generator') {
            setLoading(true);
            setTimeout(() => {
                if (!hashtag) {
                    setResult('#trending #explore #viral #instagram #love #instagood #fashion #photography');
                } else {
                    const baseTags = hashtag.split(/[\s,]+/).filter(t => t.length > 1);
                    const mockTags = baseTags.map(t => {
                        const cleanT = t.replace(/[^a-zA-Z0-9]/g, '');
                        if (!cleanT) return [];
                        return [
                            `#${cleanT}`, `#${cleanT}life`, `#best${cleanT}`, `#${cleanT}gram`,
                            `#${cleanT}oftheday`, `#${cleanT}photography`, `#love${cleanT}`,
                            `#${cleanT}daily`, `#${cleanT}style`, `#${cleanT}lover`,
                            `#${cleanT}inspiration`, `#${cleanT}time`, `#${cleanT}community`,
                            `#${cleanT}blog`, `#${cleanT}blogger`, `#${cleanT}tips`,
                            `#${cleanT}ideas`, `#${cleanT}goals`, `#${cleanT}addict`,
                            `#${cleanT}vibes`, `#${cleanT}world`, `#${cleanT}art`,
                            `#${cleanT}design`, `#${cleanT}porn`, `#${cleanT}guide`,
                            `#${cleanT}feed`, `#${cleanT}style`, `#${cleanT}diaries`,
                            `#${cleanT}posts`, `#${cleanT}forever`, `#${cleanT}everyday`,
                            `#inst${cleanT}`, `#ig${cleanT}`, `#my${cleanT}`,
                            `#explore${cleanT}`, `#top${cleanT}`, `#hot${cleanT}`,
                            `#trending${cleanT}`, `#viral${cleanT}`, `#new${cleanT}`,
                            `#${cleanT}lifestyle`, `#${cleanT}moments`, `#${cleanT}club`,
                            `#${cleanT}society`, `#${cleanT}master`, `#${cleanT}expert`
                        ];
                    }).flat();
                    const uniqueTags = Array.from(new Set(mockTags));
                    const output = uniqueTags.length > 0 ? uniqueTags.join(' ') : '#trending #explore #viral #instagram #love #instagood #fashion #photography';
                    setResult(output);
                }
                setLoading(false);
            }, 600);
        }
    };

    const copyToClipboard = () => {
        if (typeof result === 'string') {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const renderForm = () => {
        switch (type) {
            case 'whatsapp-link-generator':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Phone Number (with Country Code)</label>
                            <input type="text" value={whatsapp.phone} onChange={e => setWhatsapp({ ...whatsapp, phone: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="e.g. 15551234567" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Pre-filled Message</label>
                            <textarea value={whatsapp.message} onChange={e => setWhatsapp({ ...whatsapp, message: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg h-40 text-foreground" placeholder="Hello, I'm interested..." />
                        </div>
                    </div>
                );
            case 'telegram-link-generator':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Telegram Username / Channel Link</label>
                            <input type="text" value={telegram.username} onChange={e => setTelegram({ ...telegram, username: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="username or t.me/username" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Pre-filled Message (Optional)</label>
                            <textarea value={telegram.message} onChange={e => setTelegram({ ...telegram, message: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg h-40 text-foreground" placeholder="Hi, I found you on Aynzo..." />
                        </div>
                    </div>
                );
            case 'paypal-link-generator':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">PayPal Email</label>
                            <input type="email" value={paypal.email} onChange={e => setPaypal({ ...paypal, email: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Item Name</label>
                            <input type="text" value={paypal.item} onChange={e => setPaypal({ ...paypal, item: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="Donation / Product" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
                                <input type="number" value={paypal.amount} onChange={e => setPaypal({ ...paypal, amount: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="10.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                                <select value={paypal.currency} onChange={e => setPaypal({ ...paypal, currency: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg text-foreground">
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                    <option value="AUD">AUD</option>
                                    <option value="JPY">JPY</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'instagram-hashtag-generator':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Enter Keyword or Topic</label>
                            <input type="text" value={hashtag} onChange={e => setHashtag(e.target.value)} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="e.g. travel, food, fitness" />
                        </div>
                        <button
                            onClick={handleProcess}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-black shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Hash className="w-5 h-5" />}
                            Generate Hashtags
                        </button>
                    </div>
                );
            case 'email-validator':
                return (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="check@email.com" />
                    </div>
                );
            case 'url-opener':
                return (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">URLs (One per line)</label>
                        <textarea value={urls} onChange={e => setUrls(e.target.value)} className="w-full p-3 border border-border bg-input rounded-lg h-48 text-foreground" placeholder={`https://google.com\nhttps://youtube.com`} />
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8">
                    {type === 'privacy-policy-generator' ? (
                        <PrivacyPolicyGenerator />
                    ) : type === 'terms-conditions-generator' ? (
                        <TermsConditionsGenerator />
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Settings size={14} /> Input Configuration
                                    </h3>
                                    {renderForm()}
                                </div>
                                {type === 'url-opener' && (
                                    <button
                                        onClick={handleProcess}
                                        disabled={loading}
                                        className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10"
                                    >
                                        {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                                        <span className="text-lg">
                                            Open All Links
                                        </span>
                                    </button>
                                )}
                            </div>

                        <div className="space-y-6 h-full flex flex-col">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Result</h3>
                            {result ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-500 flex-1">
                                    {type === 'email-validator' || type === 'url-opener' ? (
                                        <div className={cn(
                                            "p-8 rounded-2xl border-2 font-black text-center text-xl flex flex-col items-center justify-center gap-4 h-full min-h-[300px]",
                                            result.includes('Invalid') || result.includes('blocker')
                                                ? "bg-destructive/10 border-destructive/20 text-destructive"
                                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                        )}>
                                            <div className="p-4 bg-card rounded-full shadow-lg">
                                                {result.includes('Invalid') ? <X size={40} /> : <Check size={40} />}
                                            </div>
                                            {result}
                                        </div>
                                    ) : (
                                        <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border space-y-4 relative group flex flex-col h-full">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{type === 'instagram-hashtag-generator' ? 'Generated Hashtags' : 'Direct Link'}</span>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={`flex items-center gap-2 text-xs font-black transition-colors ${copied ? 'text-emerald-500' : 'text-primary hover:text-accent'}`}
                                                >
                                                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'COPIED' : 'COPY'}
                                                </button>
                                            </div>
                                            <div className="p-4 bg-card rounded-xl border-2 border-border font-mono text-sm break-all text-foreground min-h-[150px] max-h-[400px] overflow-y-auto shadow-inner custom-scrollbar">
                                                {result}
                                            </div>
                                            <a
                                                href={result}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`block w-full py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold text-center transition-all text-sm border border-border mt-auto ${type === 'instagram-hashtag-generator' ? 'hidden' : ''}`}
                                            >
                                                Open Link <ExternalLink className="inline-block ml-1 w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 min-h-[300px] bg-muted/10 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3 opacity-50">
                                    <Send size={48} />
                                    <p className="text-sm font-black uppercase tracking-widest">Awaiting Input</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
