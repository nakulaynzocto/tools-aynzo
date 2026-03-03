"use client";
import { useState } from 'react';
import { Copy, CheckCircle2, ShieldCheck, Download, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

export function PrivacyPolicyGenerator() {
    const [websiteName, setWebsiteName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [email, setEmail] = useState('');
    const [policy, setPolicy] = useState('');
    const [copied, setCopied] = useState(false);

    const generate = () => {
        if (!websiteName || !websiteUrl || !email) return;

        const date = new Date().toLocaleDateString();
        const generatedPolicy = `
# Privacy Policy for ${websiteName}

Last Updated: ${date}

At ${websiteName}, accessible from ${websiteUrl}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${websiteName} and how we use it.

## 1. Information We Collect
The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

## 2. How We Use Your Information
We use the information we collect in various ways, including to:
- Provide, operate, and maintain our website
- Improve, personalize, and expand our website
- Understand and analyze how you use our website
- Develop new products, services, features, and functionality
- Communicate with you, either directly or through one of our partners

## 3. Cookies and Web Beacons
Like any other website, ${websiteName} uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

## 4. Third Party Privacy Policies
${websiteName}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.

## 5. GDPR Data Protection Rights
We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
- The right to access
- The right to rectification
- The right to erasure
- The right to restrict processing

## 6. Contact Us
If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${email}.
        `;
        setPolicy(generatedPolicy.trim());
    };

    const copy = () => {
        navigator.clipboard.writeText(policy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        const blob = new Blob([policy], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'privacy-policy.md';
        a.click();
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">General Info</h3>
                    <ShieldCheck size={16} className="text-primary" />
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
                        <label className="text-sm font-bold text-foreground">Contact Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-input border-2 border-border rounded-xl font-medium outline-none focus:border-accent" placeholder="support@example.com" />
                    </div>
                    
                    <button onClick={generate} disabled={!websiteName || !websiteUrl || !email} className="w-full py-4 bg-primary text-white rounded-xl font-black shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                        Generate Privacy Policy
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Document</h3>
                {policy ? (
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
                            {policy}
                        </pre>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                        <FileText size={48} className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest text-center">Fill details to generate policy</span>
                    </div>
                )}
            </div>
        </div>
    );
}
