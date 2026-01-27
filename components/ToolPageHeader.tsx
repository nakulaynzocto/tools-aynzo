import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';

interface ToolPageHeaderProps {
    name: string;
    description: string;
    category: string;
    h1?: string;
}

import { useTranslations } from 'next-intl';

export function ToolPageHeader({ name, description, category, h1 }: ToolPageHeaderProps) {
    const t = useTranslations('Common');
    return (
        <div className="bg-card rounded-xl border-2 border-border p-5 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium group"
                >
                    <div className="p-1.5 bg-card rounded-lg border-2 border-border group-hover:border-accent transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{t('backToTools')}</span>
                </Link>
                <div className="inline-block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-secondary px-2.5 py-1 rounded-lg">
                        {category}
                    </span>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg shadow-md">
                    <div className="h-8 w-8 text-white flex items-center justify-center text-xl font-bold">
                        {name.charAt(0)}
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 tracking-tight">
                        {/* 
                            Logic: If 'h1' (SEO Title) is very long (>50 chars), it ruins the UI. 
                            In that case, prefer the clean 'name'. 
                            If 'h1' is short/custom, use it.
                        */}
                        {(h1 && h1.length > 50) ? name : (h1 || name)}
                    </h1>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
