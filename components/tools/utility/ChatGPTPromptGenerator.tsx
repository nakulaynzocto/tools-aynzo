"use client";
import { useState } from 'react';
import { Bot, Copy, Check, Wand2, Sparkles, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const promptTemplates = [
    { cat: 'Writing', name: 'Blog Post', template: 'Write a detailed, SEO-friendly blog post about [TOPIC]. Include an engaging introduction, 5 main sections with h2 headings, practical tips, and a conclusion. Target audience: [AUDIENCE]. Tone: [professional/casual].' },
    { cat: 'Writing', name: 'Email Draft', template: 'Write a professional email to [RECIPIENT] about [SUBJECT]. The email should be [formal/friendly], and should [persuade/inform/request]. Include a clear subject line and a strong CTA.' },
    { cat: 'Writing', name: 'Social Post', template: 'Create 5 engaging [Instagram/Twitter/LinkedIn] posts about [TOPIC]. Each should include relevant hashtags, an emoji, and a call-to-action. Brand voice: [professional/fun].' },
    { cat: 'Coding', name: 'Code Review', template: 'Review this [LANGUAGE] code for: bugs, performance issues, security vulnerabilities, and best practices. Provide specific suggestions with corrected code examples.\n\nCode:\n```\n[PASTE CODE HERE]\n```' },
    { cat: 'Coding', name: 'Debug Helper', template: 'I am getting this error in [LANGUAGE]: [ERROR MESSAGE]\n\nCode:\n```\n[PASTE CODE]\n```\n\nPlease: 1) Explain the error, 2) Find the root cause, 3) Provide a fix with explanation.' },
    { cat: 'Coding', name: 'API Design', template: 'Design a RESTful API for a [SYSTEM TYPE] application. Include: endpoints with HTTP methods, request/response JSON examples, authentication approach, and error handling format.' },
    { cat: 'Marketing', name: 'Ad Copy', template: 'Write 3 ad variations for [PRODUCT] targeting [AUDIENCE]. Each: lead with main benefit, address pain point [PAIN POINT], include CTA. Format: Headline (6 words), Body (25 words), CTA.' },
    { cat: 'Marketing', name: 'Sales Script', template: 'Create a sales pitch script for [PRODUCT] priced at [PRICE]. Include: warm opener, discovery questions about [PAIN POINT], pitch, 3 objection responses (price/time/think), and closing.' },
    { cat: 'Learning', name: 'Study Guide', template: 'Create a comprehensive study guide for [TOPIC]. Include: key concepts/definitions, common misconceptions, 5 practice questions with answers, memory tips, and further reading suggestions.' },
    { cat: 'Learning', name: 'Comparison', template: 'Compare [OPTION A] vs [OPTION B] for [USE CASE]. Cover: similarities, major differences, pros/cons of each, and a clear recommendation for [MY SITUATION].' },
];

const categoryColors: Record<string, string> = {
    Writing: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    Coding: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    Marketing: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    Learning: 'bg-green-500/10 text-green-500 border-green-500/30',
};

export function ChatGPTPromptGenerator() {
    const [category, setCategory] = useState('All');
    const [customized, setCustomized] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [copied, setCopied] = useState(false);

    const cats = ['All', 'Writing', 'Coding', 'Marketing', 'Learning'];
    const filtered = category === 'All' ? promptTemplates : promptTemplates.filter(p => p.cat === category);

    const handleSelect = (name: string, template: string) => {
        setSelectedName(name);
        setCustomized(template);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(customized);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = customized.split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl"><Bot className="w-8 h-8 text-primary" /></div>
                        CHATGPT PROMPT GENERATOR
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">Create powerful AI prompts for writing, coding, marketing and more.</p>
                </div>
                <button onClick={handleCopy} disabled={!customized} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base disabled:opacity-50">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-primary" />}
                    {copied ? 'COPIED!' : 'COPY PROMPT'}
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
                {cats.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all',
                        category === cat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'
                    )}>
                        <Sparkles className="w-3.5 h-3.5" /> {cat}
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {filtered.map(({ name, template, cat }) => (
                    <button key={name} onClick={() => handleSelect(name, template)} className={cn(
                        'px-4 py-4 rounded-2xl border-2 text-left transition-all group hover:shadow-lg',
                        selectedName === name
                            ? 'bg-primary/10 border-primary text-primary shadow-lg'
                            : 'border-border hover:border-primary/40 hover:bg-muted/20'
                    )}>
                        <div className={cn('p-1.5 rounded-lg w-fit mb-3 border', categoryColors[cat] || '')}>
                            <Wand2 className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-sm leading-tight">{name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{cat}</div>
                    </button>
                ))}
            </div>

            {/* Editor */}
            {customized ? (
                <div className="space-y-4 bg-muted/10 p-8 rounded-[2rem] border-2 border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">Customize Your Prompt</label>
                            <p className="text-xs text-muted-foreground mt-1">Replace <strong>[PLACEHOLDERS]</strong> with your specifics</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground">{wordCount} words</span>
                            <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm transition-all">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Prompt'}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={customized}
                        onChange={e => setCustomized(e.target.value)}
                        rows={10}
                        className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-sm resize-none"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        Works with ChatGPT, Claude, Gemini, and other AI models.
                    </div>
                </div>
            ) : (
                <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl p-14 text-center">
                    <Wand2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground font-bold text-lg">Select a template above to get started</p>
                    <p className="text-muted-foreground/60 font-medium text-sm mt-1">Then customize and copy into your favourite AI</p>
                </div>
            )}

            <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Prompt Engineering Tip</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">The more <strong>specific and contextual</strong> your prompt, the better the AI output. Always specify tone, audience, length, and format for best results. Iterate and refine!</p>
                </div>
            </div>
        </div>
    );
}
