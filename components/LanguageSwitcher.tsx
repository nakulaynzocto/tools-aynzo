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
        <div className="relative ml-4">
            <select
                value={locale}
                onChange={onSelectChange}
                disabled={isPending}
                className="bg-background text-foreground text-sm py-1.5 px-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="pt">🇵🇹 Portuguese</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="id">🇮🇩 Indonesian</option>
                <option value="de">🇩🇪 German</option>
                <option value="fr">🇫🇷 French</option>
                <option value="ja">🇯🇵 Japanese</option>
                <option value="ru">🇷🇺 Russian</option>
                <option value="tr">🇹🇷 Turkish</option>
                <option value="it">🇮🇹 Italian</option>
                <option value="ko">🇰🇷 Korean</option>
                <option value="zh">🇨🇳 Chinese</option>
                <option value="ar">🇸🇦 Arabic</option>
            </select>
        </div>
    );
}
