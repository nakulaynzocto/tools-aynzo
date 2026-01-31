import { Mail } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Footer' });
    return {
        title: t('contact'),
        description: "Contact AYNZO TOOLS support team for any questions or feedback.",
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/contact`
        }
    };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Footer' }); // Reusing footer translations for now or we might need a Contact namespace

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold mb-8 text-center">{t('contact')}</h1>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
                <div className="space-y-6">
                    <p className="text-lg text-muted-foreground">
                        We'd love to hear from you! Whether you have a question about our tools, features, or anything else, our team is ready to answer all your questions.
                    </p>

                    <div className="space-y-4 mt-8">
                        <div className="flex items-center gap-4 text-foreground/80">
                            <Mail className="w-6 h-6 text-primary" />
                            <span>support@aynzo.com</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-4">Send us a message</h3>
                    <p className="text-muted-foreground mb-6">This is a placeholder for a contact form.</p>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium w-full">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}
