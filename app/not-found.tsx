'use client';

import Link from 'next/link';
import { Home, Search, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { getLocalePrefix } from '@/utils/locale-utils';

const SUPPORTED_LOCALES = ['en','hi','pt','es','id','de','fr','ja','ru','tr','it','ko','zh','ar'];

function detectLocale(pathname: string): string {
    const segment = pathname?.split('/')[1];
    return SUPPORTED_LOCALES.includes(segment) ? segment : 'en';
}

const POPULAR_TOOLS = [
    { name: 'Word Counter', slug: 'word-counter' },
    { name: 'Image Compressor', slug: 'image-compressor' },
    { name: 'PDF to Word', slug: 'pdf-to-word' },
    { name: 'QR Code Generator', slug: 'qr-code-generator' },
    { name: 'Password Generator', slug: 'password-generator' },
    { name: 'JSON Formatter', slug: 'json-formatter' },
];

export default function NotFound() {
    const pathname = usePathname();
    const locale = detectLocale(pathname || '');
    const prefix = getLocalePrefix(locale);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Visual */}
                <div className="relative mb-8">
                    <div className="text-[10rem] font-black text-primary/10 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-6">
                            <Search className="h-14 w-14 text-primary/60 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Page Not Found
                </h1>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link
                        href={prefix || '/'}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30"
                    >
                        <Home className="h-5 w-5" />
                        Go Home
                    </Link>
                    <Link
                        href={`${prefix}/tools`}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all"
                    >
                        <Wrench className="h-5 w-5" />
                        Browse All Tools
                    </Link>
                </div>

                {/* Popular Tools Quick Links */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Popular Tools
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {POPULAR_TOOLS.map(tool => (
                            <Link
                                key={tool.slug}
                                href={`${prefix}/tools/${tool.slug}`}
                                className="px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary border border-border rounded-lg text-sm font-medium transition-all"
                            >
                                {tool.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
