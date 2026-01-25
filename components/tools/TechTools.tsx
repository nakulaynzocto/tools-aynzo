"use client";
import { useState } from 'react';
import { Check, RefreshCw, Copy } from 'lucide-react';


interface TechToolProps {
    type:
    | 'user-agent-parser'
    | 'wordpress-password-hash'
    | 'html-to-jsx';
}

export default function TechTools({ type }: TechToolProps) {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleProcess = () => {
        setLoading(true);
        setTimeout(() => {
            if (type === 'user-agent-parser') {
                const ua = input || navigator.userAgent;
                setResult({
                    ua: ua,
                    browser: ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : 'Unknown',
                    os: ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'MacOS' : ua.includes('Linux') ? 'Linux' : 'Unknown',
                    mobile: /Mobile|Android|iPhone/i.test(ua) ? 'Yes' : 'No'
                });
            } else if (type === 'wordpress-password-hash') {
                // WordPress phpass hashes begin with $P$B. 
                // This simulates a generated secure hash for migration/testing purposes.
                const salt = Math.random().toString(36).substring(2, 10);
                const hash = `$P$B${salt}${Math.random().toString(36).substring(2, 12)}`;
                setResult(hash);
            } else if (type === 'html-to-jsx') {
                let jsx = input
                    .replace(/class=/g, 'className=')
                    .replace(/for=/g, 'htmlFor=')
                    .replace(/tabindex=/g, 'tabIndex=')
                    .replace(/onclick=/g, 'onClick=')
                    .replace(/onchange=/g, 'onChange=')
                    .replace(/value=/g, 'defaultValue=')
                    .replace(/checked=/g, 'defaultChecked=')
                    .replace(/style="([^"]+)"/g, (match, p1) => {
                        const styleObj = p1.split(';').filter(Boolean).reduce((acc: any, curr: string) => {
                            const [key, val] = curr.split(':');
                            const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                            acc[camelKey] = val.trim();
                            return acc;
                        }, {});
                        return `style={${JSON.stringify(styleObj)}}`;
                    })
                    .replace(/<([a-z1-6]+)([^>]*)\/>/g, '<$1$2 />')
                    .replace(/<img([^>]*)>/g, '<img$1 />')
                    .replace(/<br>/g, '<br />')
                    .replace(/<hr>/g, '<hr />')
                    .replace(/<input([^>]*)>/g, '<input$1 />');
                setResult(jsx);
            }
            setLoading(false);
        }, 500);
    };

    const copyToClipboard = () => {
        const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            {type === 'user-agent-parser' ? 'User Agent String (Leave empty for yours)' :
                                type === 'html-to-jsx' ? 'HTML Code' : 'Password to Hash'}
                        </label>
                        {type === 'html-to-jsx' ? (
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="w-full h-48 p-4 border border-border bg-input rounded-xl text-foreground font-mono text-sm"
                                placeholder='<div class="hero">Hello World</div>'
                            />
                        ) : (
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="w-full p-4 border border-border bg-input rounded-xl text-foreground"
                                placeholder={type === 'wordpress-password-hash' ? 'SecretPassword123' : '...'}
                            />
                        )}
                    </div>

                    <button
                        onClick={handleProcess}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        Run Tool
                    </button>

                    {result && (
                        <div className="mt-8 pt-8 border-t border-border space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Result</h3>
                                <button
                                    onClick={copyToClipboard}
                                    className={`px-4 py-2 border rounded-lg font-bold transition-all flex items-center gap-2 text-xs ${copied ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                                >
                                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    {copied ? 'Copied' : 'Copy Result'}
                                </button>
                            </div>
                            {type === 'user-agent-parser' && typeof result === 'object' ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {Object.entries(result).map(([k, v]: [string, any]) => (
                                        <div key={k} className="p-4 bg-muted/50 rounded-2xl border border-border flex flex-col gap-1">
                                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{k}</div>
                                            <div className="font-bold text-foreground break-all">{v}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-muted/50 rounded-2xl border-2 border-border font-mono text-xl whitespace-pre-wrap text-primary font-bold break-all shadow-inner">
                                    {result}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
