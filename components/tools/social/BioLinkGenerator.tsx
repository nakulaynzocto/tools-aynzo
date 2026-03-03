"use client";
import { useState } from 'react';
import { Link2, Plus, Trash2, Copy, Check, ExternalLink, User, Info } from 'lucide-react';

interface LinkItem { label: string; url: string; icon: string; }

const iconOptions = ['🔗', '🌐', '📸', '🎵', '💼', '🛒', '📧', '📞', '🎮', '💰', '📺', '🐦'];

export function BioLinkGenerator() {
    const [name, setName] = useState('Your Name');
    const [bio, setBio] = useState('Creator | Entrepreneur | Making cool stuff 🚀');
    const [links, setLinks] = useState<LinkItem[]>([
        { label: 'My Website', url: 'https://example.com', icon: '🌐' },
        { label: 'Instagram', url: 'https://instagram.com', icon: '📸' },
        { label: 'YouTube', url: 'https://youtube.com', icon: '📺' },
    ]);
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(false);

    const addLink = () => setLinks(prev => [...prev, { label: 'New Link', url: '', icon: '🔗' }]);
    const removeLink = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i));
    const updateLink = (i: number, field: keyof LinkItem, val: string) =>
        setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));

    const generateHTML = () => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} - Bio Link</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.card{background:white;border-radius:24px;padding:40px;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2)}.avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px}.name{font-size:24px;font-weight:800;color:#1a1a2e;margin-bottom:8px}.bio{color:#666;margin-bottom:32px;line-height:1.5;font-size:14px}.link{display:flex;align-items:center;gap:12px;background:#f8f9ff;border:2px solid #e8e8ff;border-radius:16px;padding:14px 20px;margin-bottom:12px;text-decoration:none;color:#1a1a2e;font-weight:600;font-size:15px;transition:all .2s}.link:hover{background:#667eea;color:white;border-color:#667eea;transform:translateY(-2px)}.link-icon{font-size:20px}</style></head>
<body><div class="card"><div class="avatar">👤</div><div class="name">${name}</div><div class="bio">${bio}</div>
${links.filter(l => l.url).map(l => `<a class="link" href="${l.url}" target="_blank"><span class="link-icon">${l.icon}</span>${l.label}</a>`).join('\n')}
</div></body></html>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(generateHTML());
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div />
                <div className="flex gap-2">
                    <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-5 py-3 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 rounded-2xl transition-all border-2 border-violet-500/20 font-bold text-sm">
                        <ExternalLink className="w-4 h-4" /> {preview ? 'Editor' : 'Preview'}
                    </button>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                        {copied ? 'COPIED!' : 'COPY HTML'}
                    </button>
                </div>
            </div>

            {!preview ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-5 bg-muted/10 p-7 rounded-[2rem] border-2 border-border/50">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4" /> Profile</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-bold" />
                            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Your bio..." rows={2} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-violet-500 transition-all font-medium resize-none" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Link2 className="w-4 h-4" /> Links</label>
                                <button onClick={addLink} className="flex items-center gap-1.5 text-violet-500 font-bold text-sm hover:underline"><Plus className="w-4 h-4" /> Add</button>
                            </div>
                            {links.map((l, i) => (
                                <div key={i} className="space-y-2 bg-background border-2 border-border rounded-2xl p-4">
                                    <div className="flex gap-2">
                                        <select value={l.icon} onChange={e => updateLink(i, 'icon', e.target.value)} className="px-2 py-2 bg-background border-2 border-border rounded-xl font-bold text-lg">
                                            {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                                        </select>
                                        <input value={l.label} onChange={e => updateLink(i, 'label', e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 bg-muted/30 border-2 border-border rounded-xl focus:outline-none focus:border-violet-500 transition-all font-bold text-sm" />
                                        <button onClick={() => removeLink(i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    <input value={l.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://" className="w-full px-3 py-2 bg-muted/30 border-2 border-border rounded-xl focus:outline-none focus:border-violet-500 transition-all text-sm font-medium" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Mini Preview */}
                    <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-[2rem] p-8 flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">👤</div>
                        <h3 className="text-white font-black text-xl">{name}</h3>
                        <p className="text-white/70 text-sm text-center font-medium">{bio}</p>
                        <div className="w-full space-y-2">
                            {links.filter(l => l.label).slice(0, 4).map((l, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white font-bold text-sm">
                                    <span>{l.icon}</span> {l.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-card border-2 border-border rounded-3xl p-6">
                    <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-96 whitespace-pre-wrap">{generateHTML()}</pre>
                </div>
            )}

            <div className="bg-violet-500/5 border-2 border-violet-500/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-violet-500 shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">How to Use</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Click <strong>"Copy HTML"</strong> and paste into a free hosting service like <strong>GitHub Pages, Netlify, or Vercel</strong>. Or add to your website as a standalone page. Works as a free Linktree alternative!</p>
                </div>
            </div>
        </div>
    );
}
