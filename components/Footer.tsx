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
                                    alt="Logo"
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

                    {/* Quick Categories */}
                    <div>
                        <h4 className="text-foreground font-black text-sm uppercase tracking-widest mb-6 border-l-4 border-primary pl-3">
                            {tFooter('topCategories')}
                        </h4>
                        <ul className="space-y-3">
                            {Object.keys(toolCategories).slice(0, 5).map(category => (
                                <li key={category}>
                                    <Link
                                        href={`/tools`}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        {tCat.has(category) ? tCat(category) : (tCategories.has(category) ? tCategories(category) : category)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & Help */}
                    <div>
                        <h4 className="text-foreground font-black text-sm uppercase tracking-widest mb-6 border-l-4 border-accent pl-3">
                            {tFooter('resources')}
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
                                    <Info size={14} /> {tFooter('aboutUs')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
                                    <Mail size={14} /> {tFooter('contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
                                    <Shield size={14} /> {tFooter('privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
                                    <FileText size={14} /> {tFooter('termsOfService')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Mission Section */}
                    <div className="bg-secondary/30 p-6 rounded-3xl border border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Heart size={80} className="fill-current text-primary" />
                        </div>
                        <h4 className="text-foreground font-black text-sm uppercase tracking-widest mb-4">{tFooter('ourMission')}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                            {tFooter('missionStatement')}
                        </p>
                        <div className="mt-6 pt-6 border-t border-border/50 flex flex-col gap-3">
                            <div className="text-[10px] font-black uppercase text-muted-foreground/40">{tFooter('securePrivate')}</div>
                            <a
                                href="https://www.buymeacoffee.com/aynzo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#FFDD00]/90 transition-colors"
                            >
                                <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" className="w-4 h-4" />
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
