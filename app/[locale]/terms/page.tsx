import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Footer' });
    return {
        title: t('termsOfService'),
        description: "Read our Terms of Service.",
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/terms`
        }
    };
}

export default function TermsPage() {
    const t = useTranslations('Footer');

    return (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-8">
            <h1 className="text-4xl font-bold mb-8">{t('termsOfService')}</h1>

            <div className="prose prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground">
                    Please read these terms and conditions carefully before using our service.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
                <p className="text-muted-foreground">
                    Permission is granted to use our online tools for personal and commercial purposes. All processing happens in your browser for most tools, ensuring privacy.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Disclaimer</h2>
                <p className="text-muted-foreground">
                    The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
            </div>
        </div>
    );
}
