"use client";
import { Link } from '@/navigation';
import { ChevronLeft } from 'lucide-react';

interface InfoPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function InfoPageLayout({ title, children }: InfoPageLayoutProps) {
    return (
        <div className="min-h-screen bg-background py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-12 group">
                    <div className="p-2 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="font-bold text-sm">Back to Tools</span>
                </Link>

                <div className="bg-card rounded-[3rem] border-2 border-border shadow-2xl p-10 lg:p-16">
                    <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-12 tracking-tighter border-b-8 border-primary/20 pb-4 inline-block">
                        {title}
                    </h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-foreground prose-a:text-accent opacity-90">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
