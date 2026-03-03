"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, Gavel, Download, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

export function TermsConditionsGenerator() {
    const [websiteName, setWebsiteName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [country, setCountry] = useState('United States');
    const [terms, setTerms] = useState('');
    const [copied, setCopied] = useState(false);

    const generate = () => {
        if (!websiteName || !websiteUrl) return;

        const date = new Date().toLocaleDateString();
        const generatedTerms = `
# Terms and Conditions for ${websiteName}

Last Updated: ${date}

Welcome to ${websiteName}! These terms and conditions outline the rules and regulations for the use of ${websiteName}'s Website, located at ${websiteUrl}.

By accessing this website, we assume you accept these terms and conditions. Do not continue to use ${websiteName} if you do not agree to take all of the terms and conditions stated on this page.

## 1. Intellectual Property Rights
Other than the content you own, under these Terms, ${websiteName} and/or its licensors own all the intellectual property rights and materials contained in this Website.

## 2. Restrictions
You are specifically restricted from all of the following:
- Publishing any Website material in any other media
- Selling, sublicensing, and/or otherwise commercializing any Website material
- Publicly performing and/or showing any Website material
- Using this Website in any way that is or may be damaging to this Website

## 3. Your Content
In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images, or other material you choose to display on this Website. By displaying Your Content, you grant ${websiteName} a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate, and distribute it in any and all media.

## 4. No Warranties
This Website is provided "as is," with all faults, and ${websiteName} expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website.

## 5. Limitation of Liability
In no event shall ${websiteName}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website.

## 6. Governing Law & Jurisdiction
These Terms will be governed by and interpreted in accordance with the laws of ${country}, and you submit to the non-exclusive jurisdiction of the state and federal courts located in ${country} for the resolution of any disputes.
        `;
        setTerms(generatedTerms.trim());
    };

    const copy = () => {
        navigator.clipboard.writeText(terms);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        const blob = new Blob([terms], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'terms-and-conditions.md';
        a.click();
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Business Details</h3>
                    <Gavel size={16} className="text-primary" />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Website Name</label>
                        <input type="text" value={websiteName} onChange={e => setWebsiteName(e.target.value)} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" placeholder="e.g. Aynzo Tools" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Website URL</label>
                        <input type="text" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" placeholder="https://example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Governing Country/State</label>
                        <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" placeholder="e.g. United States, California" />
                    </div>
                    
                    <button onClick={generate} disabled={!websiteName || !websiteUrl} className="w-full py-4 bg-primary text-white rounded-xl font-black shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                        Generate Terms & Conditions
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Document</h3>
                {terms ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-6 min-h-[400px] flex flex-col gap-4 shadow-sm relative">
                        <div className="flex justify-end gap-2 mb-2">
                            <button onClick={copy} className="p-2 bg-card rounded-lg border border-border hover:text-primary transition-all">
                                {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                            <button onClick={download} className="p-2 bg-card rounded-lg border border-border hover:text-primary transition-all">
                                <Download size={16} />
                            </button>
                        </div>
                        <pre className="text-xs font-mono bg-card p-4 rounded-xl border border-border overflow-y-auto max-h-[400px] whitespace-pre-wrap leading-relaxed">
                            {terms}
                        </pre>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <FileText size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Enter details to generate agreement</span>
                    </div>
                )}
            </div>
        </div>
    );
}
