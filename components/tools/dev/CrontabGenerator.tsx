"use client";
import { useState } from 'react';
import { Clock, Copy, Check, RefreshCw, Info } from 'lucide-react';

interface CronRow { minute: string; hour: string; day: string; month: string; weekday: string; }

const presets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Daily at midnight', value: '0 0 * * *' },
    { label: 'Daily at noon', value: '0 12 * * *' },
    { label: 'Every Monday 9am', value: '0 9 * * 1' },
    { label: 'Every weekday 9am', value: '0 9 * * 1-5' },
    { label: 'First of month', value: '0 0 1 * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' },
    { label: 'Twice a day', value: '0 8,20 * * *' },
];

function parseCron(expr: string): string {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return 'Invalid cron expression';
    const [min, hour, day, month, weekday] = parts;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    try {
        let desc = 'Runs ';
        if (min === '*') desc += 'every minute';
        else if (min.startsWith('*/')) desc += `every ${min.slice(2)} minutes`;
        else if (min.includes(',')) desc += `at minutes ${min}`;
        else desc += `at minute ${min}`;

        if (hour !== '*') {
            if (hour.startsWith('*/')) desc += ` of every ${hour.slice(2)} hours`;
            else if (hour.includes(',')) desc += ` of hours ${hour}`;
            else desc += ` past hour ${hour}`;
        }

        if (day !== '*') desc += ` on day ${day} of the month`;
        if (month !== '*') desc += ` in ${months[parseInt(month)] || month}`;
        if (weekday !== '*') {
            if (weekday.includes('-')) {
                const [s, e] = weekday.split('-');
                desc += ` on ${days[parseInt(s)]} through ${days[parseInt(e)]}`;
            } else desc += ` on ${days[parseInt(weekday)] || weekday}`;
        }
        return desc;
    } catch { return 'Enter a valid cron expression'; }
}

export function CrontabGenerator() {
    const [expression, setExpression] = useState('0 0 * * *');
    const [copied, setCopied] = useState(false);

    const description = parseCron(expression);

    const handleCopy = () => {
        navigator.clipboard.writeText(expression);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div />
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY EXPRESSION'}
                </button>
            </div>

            <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 space-y-4">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">Cron Expression</label>
                <input
                    type="text"
                    value={expression}
                    onChange={e => setExpression(e.target.value)}
                    className="w-full px-6 py-5 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-mono font-black text-2xl tracking-wider"
                    placeholder="* * * * *"
                />
                <div className="flex gap-4 text-sm text-muted-foreground font-mono">
                    {['Minute', 'Hour', 'Day', 'Month', 'Weekday'].map(f => (
                        <span key={f} className="flex-1 text-center text-xs font-black uppercase text-muted-foreground">{f}</span>
                    ))}
                </div>
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 text-center">
                    <p className="text-primary font-bold text-lg">{description}</p>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Common Presets</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {presets.map(p => (
                        <button key={p.value} onClick={() => setExpression(p.value)} className={`px-4 py-3 rounded-2xl border-2 text-left transition-all hover:border-primary/50 ${expression === p.value ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-muted/30'}`}>
                            <p className="font-black text-xs font-mono mb-1">{p.value}</p>
                            <p className="text-xs text-muted-foreground font-medium leading-tight">{p.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-muted/10 border-2 border-border/50 rounded-2xl p-5">
                <p className="text-sm font-black text-foreground mb-2">Cron Format Reference</p>
                <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                    {[
                        { field: 'Minute', range: '0-59' },
                        { field: 'Hour', range: '0-23' },
                        { field: 'Day', range: '1-31' },
                        { field: 'Month', range: '1-12' },
                        { field: 'Weekday', range: '0-7 (0,7=Sun)' },
                    ].map(({ field, range }) => (
                        <div key={field} className="text-center">
                            <p className="font-black text-primary">{field}</p>
                            <p className="text-muted-foreground">{range}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-medium"><code className="text-primary font-bold">*</code> = any, <code className="text-primary font-bold">*/n</code> = every n, <code className="text-primary font-bold">a,b</code> = multiple, <code className="text-primary font-bold">a-b</code> = range</p>
            </div>

            <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Testing Your Cron Job</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Always test your cron expression with <strong>crontab -e</strong> on Linux/Mac. For debugging, redirect output to a log file: <code className="bg-muted px-1 py-0.5 rounded text-xs">* * * * * /path/to/script.sh &gt;&gt; /var/log/cron.log 2&gt;&amp;1</code></p>
                </div>
            </div>
        </div>
    );
}
