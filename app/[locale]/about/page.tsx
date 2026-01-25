import InfoPageLayout from '@/components/InfoPageLayout';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Footer' });
    return {
        title: t('aboutUs'),
        description: "Learn more about AYNZO TOOLS, our mission, and our values.",
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/about`
        }
    };
}

export default function AboutPage() {
    return (
        <InfoPageLayout title="About Us">
            <p>
                Welcome to <strong>AYNZO TOOLS</strong>, your one-stop destination for professional-grade digital utilities.
                Our mission is to provide developers, content creators, and everyday users with high-quality, free, and secure tools
                that make their digital lives easier.
            </p>

            <h2>Why Choose Us?</h2>
            <ul>
                <li><strong>Privacy First:</strong> Most of our tools process data entirely in your browser. Your data never leaves your computer.</li>
                <li><strong>No Registration:</strong> No accounts, no signups, no paywalls. Just use what you need, when you need it.</li>
                <li><strong>Blazing Fast:</strong> Built with modern technology for maximum performance and a smooth user experience.</li>
                <li><strong>100% Free:</strong> Our tools are and will remain free to use forever.</li>
            </ul>

            <h2>Our Story</h2>
            <p>
                AYNZO TOOLS started as a small project to solve common development frustrations—like messy JSON or unformatted HTML.
                Today, it has grown into a comprehensive suite of tools ranging from advanced image processing to SEO generators and calculators.
            </p>

            <blockquote>
                "We believe that powerful tools should be simple to use and accessible to everyone."
            </blockquote>
        </InfoPageLayout>
    );
}
