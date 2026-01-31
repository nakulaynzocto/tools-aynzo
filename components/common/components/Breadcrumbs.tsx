"use client";
import { Link } from '@/navigation';
import { ChevronRight, Home } from 'lucide-react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
    }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const t = useTranslations('Navigation');
    const baseUrl = 'https://tools.aynzo.com';

    // Breadcrumb Schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: t('home'),
                item: baseUrl,
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.label,
                item: item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`,
            })),
        ],
    };

    return (
        <nav className="flex mb-6 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar" aria-label="Breadcrumb">
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
                        <Home className="w-4 h-4" />
                        <span>{t('home')}</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
                        {index === items.length - 1 ? (
                            <span className="font-semibold text-foreground truncate max-w-[200px] md:max-w-none" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} className="hover:text-primary transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
