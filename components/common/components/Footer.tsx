"use client";
import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toolCategories } from '@/lib/tools';
import { Globe, Heart, Shield, FileText, Mail, Info } from 'lucide-react';

export default function Footer() {
    const tApp = useTranslations('App');
    const tNav = useTranslations('Navigation');
    const tCat = useTranslations('NavbarCategories');
    const tCategories = useTranslations('Categories');
    const tFooter = useTranslations('Footer');
    const tTools = useTranslations('Tools'); // Added this line
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="Aynzo Tools - Free Professional Online Tools"
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
                            <span className="text-foreground font-black text-xl tracking-tighter">
                                {tApp('name')}<span className="text-primary">{tApp('nameHighlight')}</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {tApp('description')}
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2 text-xs font-bold bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                                <Globe size={14} className="text-primary" /> Multi-language Support
                            </div>
                        </div>
                    </div>

                    {/* Tool Categories - SEO Links */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {Object.entries(toolCategories).slice(0, 3).map(([category, tools]) => (
                            <div key={category}>
                                <h4 className="text-foreground font-black text-[11px] uppercase tracking-widest mb-4 opacity-70">
                                    {tCat.has(category) ? tCat(category) : category}
                                </h4>
                                <ul className="space-y-2">
                                    {tools.slice(0, 15).map(tool => (
                                        <li key={tool.slug}>
                                            <Link
                                                href={`/tools/${tool.slug}`}
                                                className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium"
                                            >
                                                {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Resources & Support */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-foreground font-black text-[11px] uppercase tracking-widest mb-4 opacity-70">
                                {tFooter('resources')}
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/about" className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium flex items-center gap-2">
                                        <Info size={12} /> {tFooter('aboutUs')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium flex items-center gap-2">
                                        <Mail size={12} /> {tFooter('contact')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium flex items-center gap-2">
                                        <Shield size={12} /> Privacy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Support Project</p>
                            <a
                                href="https://www.buymeacoffee.com/aynzo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-[#FFDD00]/90 transition-colors w-full justify-center"
                            >
                                <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" className="w-3.5 h-3.5" />
                                <span>Buy me a coffee</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-xs font-medium">
                        &copy; {currentYear} {tApp('name')}. {tFooter('allRightsReserved')}
                    </p>
                    <div className="text-[10px] text-muted-foreground/30 font-black tracking-[0.2em] uppercase">V 1.2.0</div>
                </div>
            </div>
        </footer>
    );
}
