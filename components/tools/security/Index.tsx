"use client";
import { useState } from 'react';
import { KeyRound, Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { SecurityToolProps } from '@/components/types/security/types';
import { generatePassword } from '@/components/utils/crypto/cryptoProcessing';
import { cn } from '@/utils/cn';

export default function SecurityToolsIndex({ type }: SecurityToolProps) {
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    const securityNavTools = [
        {
            category: 'SECURITY & CRYPTO',
            tools: [
                { id: 'password-generator', label: 'Password Generator', icon: KeyRound },
            ]
        }
    ];

    const handleGenerate = () => {
        const newPassword = generatePassword({
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols,
        });
        setPassword(newPassword);
    };

    const handleCopy = async () => {
        if (password) {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (type === 'password-generator') {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <ScrollableNav items={securityNavTools} activeToolId={type} />
                <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-foreground block mb-2">Password Length</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="8"
                                            max="64"
                                            value={length}
                                            onChange={(e) => setLength(Number(e.target.value))}
                                            className="flex-1 accent-primary"
                                        />
                                        <span className="text-sm font-bold w-12 text-right">{length}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-foreground block">Include Characters</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={includeUppercase}
                                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                                className="w-4 h-4 rounded border-border"
                                            />
                                            <span className="text-sm font-medium">Uppercase (A-Z)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={includeLowercase}
                                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                                className="w-4 h-4 rounded border-border"
                                            />
                                            <span className="text-sm font-medium">Lowercase (a-z)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={includeNumbers}
                                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                                className="w-4 h-4 rounded border-border"
                                            />
                                            <span className="text-sm font-medium">Numbers (0-9)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={includeSymbols}
                                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                                className="w-4 h-4 rounded border-border"
                                            />
                                            <span className="text-sm font-medium">Symbols (!@#$%...)</span>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Generate Password
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold">Generated Password</label>
                                    <button
                                        onClick={handleCopy}
                                        className={cn(
                                            "p-2 rounded-lg transition-all",
                                            copied ? "bg-emerald-500 text-white" : "bg-muted hover:bg-primary hover:text-primary-foreground"
                                        )}
                                    >
                                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className="p-6 bg-muted/30 border-2 border-border rounded-xl">
                                    <p className="text-2xl font-mono font-bold text-foreground break-all text-center">
                                        {password || 'Click "Generate Password" to create a secure password'}
                                    </p>
                                </div>
                                {password && (
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-xs text-blue-500 font-medium">
                                            💡 <strong>Security Tip:</strong> Use a password manager to store this password securely. Never share your passwords with anyone.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 text-center">
                    <p className="text-lg font-bold text-foreground mb-2">Tool Implementation Coming Soon</p>
                    <p className="text-sm text-muted-foreground">The {type} tool is currently under development.</p>
                </div>
            </div>
        </div>
    );
}
