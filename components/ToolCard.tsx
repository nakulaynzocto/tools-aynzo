import { Link } from '@/navigation';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ToolCardProps {
    _id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: LucideIcon;
}

export function ToolCard({ _id, slug, name, description, category, icon: IconComponent }: ToolCardProps) {
    const t = useTranslations('Tools');
    return (
        <Link
            href={`/tools/${slug}`}
            className="group block bg-card rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-accent hover:-translate-y-2"
        >
            {/* Icon */}
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary border border-border group-hover:bg-muted transition-colors duration-300">
                <IconComponent className="h-6 w-6 text-foreground" />
            </div>

            {/* Category Badge */}
            <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {category}
                </span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold mb-2 text-foreground group-hover:text-accent transition-colors">
                {name}
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
            </p>

            {/* Hover Indicator */}
            <div className="mt-4 flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">{t('tryNow')}</span>
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}
