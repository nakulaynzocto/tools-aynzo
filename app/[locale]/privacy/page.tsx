import InfoPageLayout from '@/components/common/components/InfoPageLayout';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Footer' });
    return {
        title: t('privacyPolicy'),
        description: "Read our Privacy Policy to understand how we handle your data.",
        alternates: {
            canonical: `https://tools.aynzo.com/${locale}/privacy`
        }
    };
}

export default function PrivacyPage() {
    return (
        <InfoPageLayout title="Privacy Policy">
            <p className="lead">Your privacy is our top priority. This policy outlines how we handle your data.</p>

            <h2>1. Local Processing</h2>
            <p>
                The vast majority of our tools (Image Compressor, Text Tools, Code Formatters, etc.) process your data
                <strong> locally in your browser</strong> using JavaScript. This means your files, text, and data are
                never uploaded to our servers.
            </p>

            <h2>2. No Data Collection</h2>
            <p>
                We do not collect or store any personal information. We do not require you to create an account,
                and we do not track your individual tool usage.
            </p>

            <h2>3. Analytics</h2>
            <p>
                We use basic, privacy-friendly analytics to understand aggregate traffic patterns (e.g., which tools are most popular)
                to help us improve the platform. This data is anonymous and does not include personally identifiable information.
            </p>

            <h2>4. Third-Party Links</h2>
            <p>
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content
                of those sites.
            </p>

            <h2>5. Changes to This Policy</h2>
            <p>
                We may update this policy from time to time. Any changes will be posted on this page with an updated modification date.
            </p>
            <p className="mt-8 text-sm text-muted-foreground">Last updated: January 25, 2026</p>
        </InfoPageLayout>
    );
}
