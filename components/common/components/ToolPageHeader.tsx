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
        <div className="mb-6 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                    {(h1 && h1.length > 50) ? name : (h1 || name)}
                </h1>

                <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                    {description}
                </p>
            </div>
        </div>
    );
}
