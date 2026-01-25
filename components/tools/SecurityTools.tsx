"use client";
import { useState, useEffect } from 'react';
import { Copy, RefreshCw, CheckCircle2, Shield, Lock, Download, Repeat, Settings, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function SecurityTools({ type }: { type: 'password-generator' }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false, // New option
  });

  const generateSinglePassword = (customLength?: number) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Ambiguous characters that look similar
    const ambiguous = '0O1lI';

    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;

    // Remove ambiguous characters if option is enabled
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (chars === '') {
      return '';
    }

    let pass = '';
    const passLength = customLength || length;
    for (let i = 0; i < passLength; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const generatePassword = () => {
    const newPassword = generateSinglePassword();
    setPassword(newPassword);
  };

  const generateBulkPasswords = () => {
    const passwords: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      passwords.push(generateSinglePassword());
    }
    setBulkPasswords(passwords);
  };

  const handleCopy = async () => {
    if (!password) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
    }
  };

  const copyAllPasswords = async () => {
    const allPasswords = bulkPasswords.join('\n');
    try {
      await navigator.clipboard.writeText(allPasswords);
    } catch (err) {
    }
  };

  const downloadBulkPasswords = () => {
    const blob = new Blob([bulkPasswords.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `passwords-${bulkCount}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return { text: 'Not generated', color: 'text-[#6b7280]', width: '0%' };

    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (password.length >= 16) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

    if (strength < 40) return { text: 'Weak', color: 'text-red-500', width: '33%', bg: 'bg-red-500' };
    if (strength < 70) return { text: 'Medium', color: 'text-yellow-500', width: '66%', bg: 'bg-yellow-500' };
    return { text: 'Strong', color: 'text-green-500', width: '100%', bg: 'bg-green-500' };
  };

  const strength = getPasswordStrength();

  // Auto-generate on mount
  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              {/* Mode Selector */}
              <div className="bg-muted p-1 rounded-2xl border-2 border-border shadow-inner flex gap-1">
                <button
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all text-sm ${!bulkMode
                    ? 'bg-card text-primary shadow-lg border border-border'
                    : 'text-muted-foreground hover:text-primary'
                    }`}
                  onClick={() => setBulkMode(false)}
                >
                  Single Mode
                </button>
                <button
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${bulkMode
                    ? 'bg-card text-primary shadow-lg border border-border'
                    : 'text-muted-foreground hover:text-primary'
                    }`}
                  onClick={() => setBulkMode(true)}
                >
                  <Repeat className="h-4 w-4" />
                  Bulk Mode
                </button>
              </div>

              {/* Input Configuration */}
              <div className="bg-card p-8 rounded-[2rem] border-2 border-border shadow-xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <Shield size={120} />
                </div>

                <h3 className="text-xl font-black flex items-center gap-3 text-foreground">
                  <Shield className="text-accent" /> Configuration
                </h3>

                <div className="space-y-8 relative z-10">
                  {/* Length Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password Length</label>
                      <span className="text-2xl font-black text-accent">{length}</span>
                    </div>
                    <input
                      type="range" min="8" max="64" value={length}
                      onChange={e => {
                        setLength(parseInt(e.target.value));
                        if (password && !bulkMode) setTimeout(generatePassword, 50);
                      }}
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {bulkMode && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-end">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bulk Count</label>
                        <span className="text-2xl font-black text-accent">{bulkCount}</span>
                      </div>
                      <input
                        type="range" min="5" max="100" step="5" value={bulkCount}
                        onChange={e => setBulkCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  )}

                  {/* Character Options */}
                  <div className="space-y-4 border-t border-border pt-6">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">Character Sets</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(options).filter(([key]) => key !== 'excludeAmbiguous').map(([key, value]) => (
                        <label
                          key={key}
                          className={cn(
                            "flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all font-black text-xs uppercase tracking-widest",
                            value ? "bg-primary/5 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:border-border/80"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={e => setOptions({ ...options, [key]: e.target.checked })}
                            className="hidden"
                          />
                          <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all", value ? "bg-primary border-primary" : "border-border bg-muted")}>
                            {value && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          {key}
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border-2 border-border cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={e => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                      className="w-5 h-5 accent-primary rounded-lg"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-foreground">Exclude Ambiguous</span>
                      <span className="text-[10px] font-medium text-muted-foreground italic">Avoid: 0, O, 1, l, I</span>
                    </div>
                  </label>

                  {/* Action Button */}
                  <button
                    onClick={bulkMode ? generateBulkPasswords : generatePassword}
                    className="w-full py-5 bg-gradient-to-r from-primary to-accent text-white rounded-[1.25rem] font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-white/10 text-lg"
                  >
                    <RefreshCw className="h-6 w-6" />
                    {bulkMode ? 'Generate Collection' : 'Generate Secure Password'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Output</h3>

              {!bulkMode ? (
                <div className="bg-card rounded-[2rem] border-2 border-border shadow-2xl overflow-hidden animate-in slide-in-from-right-5 duration-500">
                  <div className="p-8 space-y-8">
                    <div className="p-8 bg-muted/50 rounded-2xl border-2 border-border shadow-inner relative group">
                      <input
                        readOnly
                        value={password}
                        className="w-full bg-transparent text-center text-2xl md:text-3xl font-mono font-black text-primary focus:outline-none select-all"
                      />
                      <button
                        onClick={handleCopy}
                        className="mt-6 w-full py-3 bg-card border-2 border-border rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all text-foreground"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied to Clipboard' : 'Copy Password'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Security Rating</span>
                        <span className={cn("text-xs font-black uppercase", strength.color)}>{strength.text}</span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden border border-border/50 p-1">
                        <div
                          className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-lg", strength.bg)}
                          style={{ width: strength.width }}
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 rounded-2xl border-2 border-blue-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Shield size={16} />
                        <span className="text-xs font-black uppercase">Standard Guidance</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                        Use passwords with at least 16 characters and a mix of all character types for enterprise-grade security.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-[2rem] border-2 border-border shadow-2xl overflow-hidden animate-in slide-in-from-right-5 duration-500">
                  <div className="p-6 flex items-center justify-between border-b border-border bg-muted/30">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{bulkPasswords.length} Items</span>
                    <div className="flex gap-2">
                      <button onClick={copyAllPasswords} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Copy size={18} /></button>
                      <button onClick={downloadBulkPasswords} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Download size={18} /></button>
                    </div>
                  </div>
                  <div className="p-6 h-[500px] overflow-y-auto space-y-2 bg-muted/10 custom-scrollbar">
                    {bulkPasswords.map((pwd, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border group hover:border-primary/30 transition-all">
                        <span className="text-[10px] font-black text-muted-foreground w-6">{i + 1}</span>
                        <code className="flex-1 font-mono text-sm font-bold text-foreground truncate">{pwd}</code>
                        {/* Inline copy for bulk not strictly requested but good to have, skipping for now to match request focus */}
                      </div>
                    ))}
                    {bulkPasswords.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <Repeat size={64} />
                        <p className="font-black text-xs uppercase tracking-widest">Awaiting Generation</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
