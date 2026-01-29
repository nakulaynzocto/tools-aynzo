"use client";
import { useState, useEffect } from 'react';
import { Send, ExternalLink, RefreshCw, Copy, Check, Settings, X, MessageSquare, BadgeDollarSign, Hash, CheckCircle } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';

interface SocialLinkToolProps {
    type:
    | 'whatsapp-link-generator'
    | 'telegram-link-generator'
    | 'paypal-link-generator'
    | 'instagram-hashtag-generator'
    | 'email-validator'
    | 'url-opener';
}

export default function SocialLinkTools({ type }: SocialLinkToolProps) {
    const socialNavTools = [
        {
            category: 'Messaging',
            tools: [
                { id: 'whatsapp-link-generator', label: 'WhatsApp', icon: MessageSquare },
                { id: 'telegram-link-generator', label: 'Telegram', icon: Send },
            ]
        },
        {
            category: 'Payment',
            tools: [
                { id: 'paypal-link-generator', label: 'PayPal', icon: BadgeDollarSign },
            ]
        },
        {
            category: 'Social',
            tools: [
                { id: 'instagram-hashtag-generator', label: 'Hashtags', icon: Hash },
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

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // States
    const [whatsapp, setWhatsapp] = useState({ phone: '', message: '' });
    const [telegram, setTelegram] = useState('');
    const [paypal, setPaypal] = useState({ email: '', item: '', amount: '', currency: 'USD' });
    const [email, setEmail] = useState('');
    const [urls, setUrls] = useState('');
    const [hashtag, setHashtag] = useState('');

    useEffect(() => {
        if (type === 'url-opener') return;

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
                    if (!telegram) { setResult(null); return; }
                    const username = telegram.replace('@', '').trim();
                    output = `https://t.me/${username}`;
                    setResult(output);
                    break;
                case 'paypal-link-generator':
                    if (!paypal.email) { setResult(null); return; }
                    output = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypal.email}&item_name=${encodeURIComponent(paypal.item)}&amount=${paypal.amount}&currency_code=${paypal.currency}`;
                    setResult(output);
                    break;
                case 'instagram-hashtag-generator':
                    if (!hashtag) { setResult(null); return; }
                    const baseTags = hashtag.split(' ').filter(t => t.length > 2);
                    const mockTags = baseTags.map(t => [
                        `#${t}`, `#${t}life`, `#best${t}`, `#${t}gram`, `#${t}oftheday`, `#${t}photography`, `#love${t}`
                    ]).flat();
                    output = mockTags.length > 0 ? mockTags.join(' ') : '#trending #explore #viral #instagram #love #instagood #fashion #photography';
                    setResult(output);
                    break;
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
            const urlList = urls.split('\n').filter(u => u.trim());
            if (urlList.length > 0) {
                const newWindow = window.open(urlList[0], '_blank');
                if (newWindow) {
                    urlList.forEach((url, i) => {
                        if (i > 0) window.open(url.trim(), '_blank');
                    });
                    setResult(`Attempted to open ${urlList.length} links.`);
                }
            }
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
                            <textarea value={whatsapp.message} onChange={e => setWhatsapp({ ...whatsapp, message: e.target.value })} className="w-full p-3 border border-border bg-input rounded-lg h-24 text-foreground" placeholder="Hello, I'm interested..." />
                        </div>
                    </div>
                );
            case 'telegram-link-generator':
                return (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Telegram Username</label>
                        <input type="text" value={telegram} onChange={e => setTelegram(e.target.value)} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="username" />
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
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Enter Keyword or Topic</label>
                        <input type="text" value={hashtag} onChange={e => setHashtag(e.target.value)} className="w-full p-3 border border-border bg-input rounded-lg text-foreground" placeholder="e.g. travel, food, fitness" />
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
            {/* Social Navigation */}
            <ScrollableNav items={socialNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Input Form */}
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

                        {/* Result Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Result</h3>
                            {result ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-500">
                                    {type === 'email-validator' || type === 'url-opener' ? (
                                        <div className={cn(
                                            "p-8 rounded-2xl border-2 font-black text-center text-xl flex flex-col items-center justify-center gap-4 min-h-[200px]",
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
                                        <div className="bg-muted/30 p-6 rounded-2xl border-2 border-border space-y-4 relative overflow-hidden group">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Direct Link</span>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={`flex items-center gap-2 text-xs font-black transition-colors ${copied ? 'text-emerald-500' : 'text-primary hover:text-accent'}`}
                                                >
                                                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'COPIED' : 'COPY'}
                                                </button>
                                            </div>
                                            <div className="p-4 bg-card rounded-xl border-2 border-border font-mono text-sm break-all text-foreground min-h-[100px] shadow-inner">
                                                {result}
                                            </div>
                                            <a
                                                href={result}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold text-center transition-all text-sm border border-border"
                                            >
                                                Test Link <ExternalLink className="inline-block ml-1 w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-[200px] lg:h-full min-h-[250px] bg-muted/10 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3 opacity-50">
                                    <Send size={48} />
                                    <p className="text-sm font-black uppercase tracking-widest">Awaiting Input</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
