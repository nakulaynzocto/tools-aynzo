"use client";
import { useState } from 'react';
import { Code2, Copy, Check, RefreshCw } from 'lucide-react';

function jsonToTs(json: unknown, name = 'Root', indent = 0): string {
    const pad = '  '.repeat(indent);
    const childPad = '  '.repeat(indent + 1);

    if (json === null) return 'null';
    if (Array.isArray(json)) {
        if (json.length === 0) return 'unknown[]';
        const itemType = jsonToTs(json[0], name, indent);
        return `${itemType}[]`;
    }
    if (typeof json === 'object') {
        const entries = Object.entries(json as Record<string, unknown>).map(([k, v]) => {
            const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
            const optional = v === null || v === undefined ? '?' : '';
            return `${childPad}${key}${optional}: ${jsonToTs(v, k, indent + 1)};`;
        });
        return `{\n${entries.join('\n')}\n${pad}}`;
    }
    if (typeof json === 'string') return 'string';
    if (typeof json === 'number') return 'number';
    if (typeof json === 'boolean') return 'boolean';
    return 'unknown';
}

const SAMPLE = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "tags": ["admin", "user"],
    "address": null
  }
}`;

export function JsonToTypeScriptConverter() {
    const [input, setInput] = useState(SAMPLE);
    const [interfaceName, setInterfaceName] = useState('RootInterface');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const output = (() => {
        try {
            setError('');
            const parsed = JSON.parse(input);
            const type = jsonToTs(parsed, interfaceName, 0);
            return `export interface ${interfaceName} ${type}`;
        } catch (e) {
            setError((e as Error).message);
            return '';
        }
    })();

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Code2 className="w-7 h-7 text-primary" /></div>
                        JSON TO TYPESCRIPT
                    </h2>
                    <p className="text-muted-foreground font-medium mt-1">Convert any JSON object to TypeScript interfaces instantly.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Interface Name</label>
                    <input value={interfaceName} onChange={e => setInterfaceName(e.target.value)} className="w-full px-4 py-3 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-bold font-mono" />
                </div>
                <button onClick={() => setInput(SAMPLE)} className="mt-6 flex items-center gap-2 px-4 py-3 bg-muted/30 hover:bg-muted/50 rounded-2xl border-2 border-border font-bold text-sm transition-all">
                    <RefreshCw className="w-4 h-4" /> Sample
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">JSON Input</label>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        rows={18}
                        className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-mono text-sm resize-none"
                        placeholder='{ "key": "value" }'
                    />
                    {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">TypeScript Output</label>
                        <button onClick={handleCopy} disabled={!output} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy TS'}
                        </button>
                    </div>
                    <div className="w-full px-5 py-4 bg-muted/20 border-2 border-border rounded-2xl font-mono text-sm min-h-[378px] whitespace-pre-wrap text-foreground/90">
                        {output || <span className="text-muted-foreground">TypeScript interface will appear here...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
