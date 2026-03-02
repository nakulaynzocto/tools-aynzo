'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="relative">
            <select
                value={locale}
                onChange={onSelectChange}
                disabled={isPending}
                className="bg-transparent text-foreground text-xs py-1 pr-2 pl-3 outline-none cursor-pointer appearance-none hover:text-primary transition-colors focus:ring-0 font-bold tracking-tight"
            >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिन्दी</option>
                <option value="pt">🇵🇹 Português</option>
                <option value="es">🇪🇸 Español</option>
                <option value="id">🇮🇩 Indonesia</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="ar">🇸🇦 العربية</option>
            </select>
        </div>
    );
}
