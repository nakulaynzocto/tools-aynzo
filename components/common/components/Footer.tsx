"use client";
import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { toolCategories } from '@/lib/tools';
import { Globe, Shield, Mail, Info, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const tApp = useTranslations('App');
    const tNav = useTranslations('Navigation');
    const tCat = useTranslations('NavbarCategories');
    const tCategories = useTranslations('Categories');
    const tFooter = useTranslations('Footer');
    const tTools = useTranslations('Tools');
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();

    if (pathname.includes('/admin')) return null;

    return (
        <footer className="bg-card border-t border-border mt-20">

            {/* ── SITEMAP STRIP ── Pill badge style, each tool clearly distinct */}
            <div className="border-b border-border/40 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-6">
                        All Tools Directory
                    </p>
                    <div className="flex flex-col gap-5">
                        {Object.entries(toolCategories).map(([category, tools]) => (
                            <div key={category} className="flex flex-wrap items-center gap-2">
                                {/* Category label — colored badge */}
                                <Link
                                    href={`/tools#${category.replace(/\s+/g, '-').toLowerCase()}`}
                                    className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all px-2.5 py-1 rounded-lg border border-primary/20 shrink-0"
                                >
                                    {tCat.has(category) ? tCat(category) : (tCategories.has(category) ? tCategories(category) : category)}
                                </Link>
                                {/* Each tool as a separate pill */}
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.slug}
                                        href={`/tools/${tool.slug}`}
                                        className="text-[11px] font-medium text-muted-foreground/60 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all px-2.5 py-1 rounded-lg border border-border/50 bg-background/60 whitespace-nowrap"
                                        title={tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                    >
                                        {tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN FOOTER ── Brand + Resources, clean & slim */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="Aynzo Tools - Free Professional Online Tools"
                                    fill
                                    className="object-contain"
                                    sizes="36px"
                                />
                            </div>
                            <span className="text-foreground font-black text-lg tracking-tighter">
                                {tApp('name')}<span className="text-primary">{tApp('nameHighlight')}</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {tApp('description')}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold bg-muted/50 px-3 py-1.5 rounded-full border border-border w-fit">
                            <Globe size={13} className="text-primary" /> {tFooter('multiLanguage')}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-foreground font-black text-[11px] uppercase tracking-widest mb-4 opacity-60">
                            {tFooter('resources')}
                        </h4>
                        <ul className="space-y-2.5">
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
                                <Link href="/blog" className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium flex items-center gap-2">
                                    <ChevronRight size={12} /> {tNav('blog')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium flex items-center gap-2">
                                    <Shield size={12} /> {tFooter('privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground/60 hover:text-primary transition-colors text-[13px] font-medium flex items-center gap-2">
                                    <Shield size={12} /> {tFooter('termsOfService')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-black text-[11px] uppercase tracking-widest mb-4 opacity-60">
                            {tFooter('supportProject')}
                        </h4>
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                                Enjoying free tools? Help keep them running!
                            </p>
                            <a
                                href="https://www.buymeacoffee.com/aynzo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-3 py-2 rounded-xl font-bold text-[11px] hover:bg-[#FFDD00]/90 transition-colors w-full justify-center"
                            >
                                <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" className="w-3.5 h-3.5" />
                                <span>{tFooter('buyMeACoffee')}</span>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-muted-foreground text-xs font-medium">
                        &copy; {currentYear} {tApp('name')}. {tFooter('allRightsReserved')}
                    </p>
                    <div className="text-[10px] text-muted-foreground/30 font-black tracking-[0.2em] uppercase">V 1.2.0</div>
                </div>
            </div>

        </footer>
    );
}
