'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function ContactForm() {
    const t = useTranslations('Contact');
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus('success');
                setForm({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30">
                    <CheckCircle size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-primary font-bold text-sm hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
                <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Your Name</label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Nakul Singh"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Subject</label>
                <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="How can we help?"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your question or feedback..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
            </div>
            {status === 'error' && (
                <p className="text-red-500 text-sm font-medium">Something went wrong. Please try again or email us directly.</p>
            )}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <><Send size={16} /> Send Message</>
                )}
            </button>
        </form>
    );
}
