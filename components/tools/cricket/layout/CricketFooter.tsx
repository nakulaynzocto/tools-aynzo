"use client";
import { Link } from '@/navigation';
import { Trophy, Mail, Shield, AlertTriangle, Facebook, Twitter, Instagram, Youtube, Zap } from 'lucide-react';

export default function CricketFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 text-slate-500 border-t border-slate-200 py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                    <Link href="/tools/cricket" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Zap className="text-[#D11414] w-7 h-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-black text-2xl tracking-tighter italic uppercase leading-none">
                                CRICKET <span className="text-[#D11414]">AI</span>
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Match Predictor</span>
                        </div>
                    </Link>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-sm italic">
                            India's most trusted AI-powered fantasy cricket companion. We use deep neural networks to predict IPL match outcomes and player performance.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-[#D11414] hover:text-white hover:border-[#D11414] transition-all shadow-sm">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-slate-800 font-black uppercase tracking-[0.2em] text-[10px] italic border-b-2 border-[#D11414] pb-2 w-fit">Quick Access</h4>
                        <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
                            <li><Link href="/tools/cricket/schedule" className="hover:text-[#D11414] transition-colors flex items-center gap-2">IPL Schedule 2026</Link></li>
                            <li><Link href="/tools/cricket/ai-predictor" className="hover:text-[#D11414] transition-colors flex items-center gap-2">AI Predictor Hub</Link></li>
                            <li><Link href="/tools/cricket/points-table" className="hover:text-[#D11414] transition-colors flex items-center gap-2">Points Table</Link></li>
                            <li><Link href="/tools/cricket" className="hover:text-[#D11414] transition-colors flex items-center gap-2 text-slate-300 pointer-events-none italic">Team Analysis (Soon)</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h4 className="text-slate-800 font-black uppercase tracking-[0.2em] text-[10px] italic border-b-2 border-[#D11414] pb-2 w-fit">Support</h4>
                        <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-[#D11414]" />
                                <span>support@aynzo.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Shield size={16} className="text-[#D11414]" />
                                <Link href="/privacy-policy" className="hover:text-[#D11414]">Data Safety</Link>
                            </li>
                            <li className="flex items-center gap-3">
                                <Zap size={16} className="text-[#D11414]" />
                                <Link href="/" className="hover:text-[#D11414]">Aynzo Platform</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Responsible Gaming Disclaimer */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 mb-12 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                            <AlertTriangle className="text-amber-600 w-7 h-7" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h5 className="text-slate-800 font-black text-xs uppercase italic tracking-widest">Responsible Gaming Disclaimer</h5>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Players must be 18+ to play fantasy cricket. This game involves an element of financial risk and may be addictive. Please play responsibly. Our AI predictions are for analytical purposes only and do not guarantee winnings.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-200 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <p>© {currentYear} CRICKET AI PREDICTOR - BY AYNZO TOOLS</p>
                    <div className="flex gap-8">
                        <Link href="/" className="hover:text-[#D11414] transition-colors">Aynzo Hub</Link>
                        <span className="text-[#D11414] italic">#1 Cricket AI Analysis</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
