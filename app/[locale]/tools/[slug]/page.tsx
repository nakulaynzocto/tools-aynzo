import { api } from '@/lib/tools';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { ToolPageHeader } from '@/components/common/components/ToolPageHeader';
import { ToolInfoSection } from '@/components/common/components/ToolInfoSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getToolSEO } from '@/lib/seo';
import { Breadcrumbs } from '@/components/common/components/Breadcrumbs';
import { RelatedTools } from '@/components/common/components/RelatedTools';
import { ShareButtons } from '@/components/common/components/ShareButtons';
import Script from 'next/script';
import { generateProgrammaticMetadata } from '@/utils/seo-utils';

const ImageTools = dynamic(() => import('@/components/tools/image/Index'));
const PdfTools = dynamic(() => import('@/components/tools/pdf/Index'));
const TextTools = dynamic(() => import('@/components/tools/text/Index'));
const AdvancedTextTools = dynamic(() => import('@/components/tools/advancedtext/Index'));
const FormatterTools = dynamic(() => import('@/components/tools/formatter/Index'));
const ConverterTools = dynamic(() => import('@/components/tools/converter/Index'));
const GeneratorTools = dynamic(() => import('@/components/tools/generator/Index'));
const DevTools = dynamic(() => import('@/components/tools/dev/Index'));
const SecurityTools = dynamic(() => import('@/components/tools/security/Index'));
const FAQSection = dynamic(() => import('@/components/common/components/FAQSection'));
const UtilityTools = dynamic(() => import('@/components/tools/utility/Index'));
const CryptoTools = dynamic(() => import('@/components/tools/crypto/Index'));
const RegexDiffTools = dynamic(() => import('@/components/tools/regex/Index'));
const YouTubeTools = dynamic(() => import('@/components/tools/youtube/Index'));
const SeoTools = dynamic(() => import('@/components/tools/seo/Index'));
const KeywordTools = dynamic(() => import('@/components/tools/keyword/Index'));
const WebTools = dynamic(() => import('@/components/tools/web/Index'));
const SocialLinkTools = dynamic(() => import('@/components/tools/social/Index'));
const TechTools = dynamic(() => import('@/components/tools/tech/Index'));
const CalculatorTools = dynamic(() => import('@/components/tools/calculator/Index'));

interface Props {
  params: { slug: string; locale: string };
}
import { tools } from '@/lib/tools';
import { AdUnit } from '@/components/common/components/AdUnit';

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const tTools = await getTranslations('Tools');
    const seo = getToolSEO(params.slug);
    const fallbackSeo = generateProgrammaticMetadata(params.slug, params.locale);

    // 1. Priority: Localized strings from en.json (Tools.[slug])
    // 2. Secondary: Hardcoded data from lib/seo.ts
    // 3. Tertiary: Programmatic generated metadata (New)
    // 4. Final: Basic fallback

    const name = tTools.has(`${params.slug}.name`) ? tTools(`${params.slug}.name`) : (seo?.h1 || params.slug);

    const localizedTitle = tTools.has(`${params.slug}.seoTitle`)
      ? tTools(`${params.slug}.seoTitle`)
      : (params.locale === 'en' ? (seo?.title || fallbackSeo?.title) : (fallbackSeo?.title || seo?.title));

    const localizedDesc = tTools.has(`${params.slug}.seoDescription`)
      ? tTools(`${params.slug}.seoDescription`)
      : (params.locale === 'en' ? (seo?.description || fallbackSeo?.description) : (fallbackSeo?.description || seo?.description));

    const localizedKeywords = tTools.has(`${params.slug}.seoKeywords`)
      ? tTools(`${params.slug}.seoKeywords`)
      : (params.locale === 'en' ? (seo?.keywords || fallbackSeo?.keywords) : (fallbackSeo?.keywords || seo?.keywords));

    // Final fallback if nothing exists (should be covered by fallbackSeo now)
    const finalTitle = localizedTitle || `Free Online ${name} | AYNZO TOOLS`;
    const finalDesc = localizedDesc || `Use our free online ${name} tool. Fast, secure, and easy to use.`;
    const finalKeywords = localizedKeywords || `${name.toLowerCase()}, online tools, free online ${name.toLowerCase()}`;

    return {
      title: finalTitle,
      description: finalDesc,
      keywords: finalKeywords,
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        type: 'website',
        url: `https://tools.aynzo.com/${params.locale}/tools/${params.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
      },
      alternates: {
        canonical: `https://tools.aynzo.com/${params.locale}/tools/${params.slug}`,
        languages: {
          'en': `https://tools.aynzo.com/en/tools/${params.slug}`,
          'hi': `https://tools.aynzo.com/hi/tools/${params.slug}`,
          'pt': `https://tools.aynzo.com/pt/tools/${params.slug}`,
          'es': `https://tools.aynzo.com/es/tools/${params.slug}`,
          'id': `https://tools.aynzo.com/id/tools/${params.slug}`,
          'de': `https://tools.aynzo.com/de/tools/${params.slug}`,
          'fr': `https://tools.aynzo.com/fr/tools/${params.slug}`,
          'ja': `https://tools.aynzo.com/ja/tools/${params.slug}`,
          'ru': `https://tools.aynzo.com/ru/tools/${params.slug}`,
          'tr': `https://tools.aynzo.com/tr/tools/${params.slug}`,
          'it': `https://tools.aynzo.com/it/tools/${params.slug}`,
          'ko': `https://tools.aynzo.com/ko/tools/${params.slug}`,
          'zh': `https://tools.aynzo.com/zh/tools/${params.slug}`,
          'ar': `https://tools.aynzo.com/ar/tools/${params.slug}`,
        }
      },
    };
  } catch (error) {
    return { title: 'Error Loading Tool' };
  }
}

export default async function ToolPage({ params }: Props) {
  const seo = getToolSEO(params.slug);
  let tool;
  try {
    const res = await api.getProduct(params.slug);
    if (!res.success) return notFound();
    tool = res.data!;
  } catch (error) {
    return notFound();
  }

  const tTools = await getTranslations('Tools');
  const t = await getTranslations('Common');

  const translatedName = tTools.has(`${params.slug}.name`) ? tTools(`${params.slug}.name`) : tool.name;
  const translatedDesc = tTools.has(`${params.slug}.description`) ? tTools(`${params.slug}.description`) : tool.description;

  const tCategories = await getTranslations('Categories');
  const translatedCategory = tCategories.has(tool.category) ? tCategories(tool.category) : tool.category;
  const tNav = await getTranslations('Navigation');

  const renderTool = () => {
    switch (params.slug) {
      // Image Tools
      case 'image-compressor':
      case 'image-resizer':
      case 'jpg-to-png':
      case 'png-to-jpg':
      case 'webp-converter':
      case 'image-format-converter':
      case 'image-to-base64':
      case 'base64-to-image':
      case 'image-cropper':
      case 'flip-image':
      case 'rotate-image':
      case 'image-enlarger':
      case 'image-brightness':
      case 'image-contrast':
      case 'grayscale-image':
      case 'blur-image':
      case 'sepia-converter':
      case 'invert-image':
      case 'saturate-image':
      case 'hue-rotate-image':
      case 'image-opacity':
      case 'round-corners-image':
      case 'image-border':
      case 'image-shadow':
      case 'pixelate-image':
      case 'svg-to-png':
      case 'png-to-svg':
      case 'webp-to-jpg':
      case 'webp-to-png':
      case 'jpg-to-webp':
      case 'png-to-webp':
        return <ImageTools type={params.slug as any} />;

      // PDF Tools
      case 'pdf-to-word':
      case 'word-to-pdf':
      case 'merge-pdf':
      case 'split-pdf':
        return <PdfTools type={params.slug as any} />;

      // Basic Text Tools
      case 'word-counter':
      case 'character-counter':
      case 'text-case-converter':
      case 'remove-line-breaks':
      case 'reverse-text':
        return <TextTools type={params.slug as any} />;

      // Advanced Text Tools
      case 'italic-text':
      case 'strikethrough-text':
      case 'underline-text':
      case 'small-text':
      case 'upside-down-text':
      case 'mirror-text':
      case 'duplicate-line-remover':
      case 'sort-alphabetically':
      case 'whitespace-remover':
      case 'word-frequency':
      case 'find-replace':
      case 'bold-text':
      case 'cursive-text':
      case 'double-underline-text':
        return <AdvancedTextTools type={params.slug} />;

      // Developer Tools
      case 'json-formatter':
      case 'url-encoder-decoder':
        return <DevTools type={params.slug as any} />;

      // Formatter Tools
      case 'html-formatter':
      case 'css-formatter':
      case 'javascript-formatter':
      case 'xml-formatter':
      case 'sql-formatter':
      case 'markdown-to-html':
      case 'html-to-markdown':
      case 'csv-to-json':
      case 'json-to-csv':
      case 'code-minifier':
        return <FormatterTools type={params.slug} />;

      // Converter Tools
      case 'unit-converter':
      case 'currency-converter':
      case 'color-converter':
      case 'binary-to-text':
      case 'hex-to-decimal':
      case 'roman-numeral':
        return <ConverterTools type={params.slug} />;

      // Generator Tools
      case 'random-number':
      case 'random-string':
      case 'random-color':
      case 'random-date':
      case 'random-ip':
        return <GeneratorTools type={params.slug} />;

      // Security Tools
      case 'password-generator':
        return <SecurityTools type={params.slug as 'password-generator'} />;

      // Utility Tools
      case 'lorem-ipsum':
        return <UtilityTools type={params.slug as any} />;


      // === NEW TOOLS (SEO & Traffic Phase) ===

      // YouTube Tools
      case 'youtube-thumbnail-downloader':
      case 'youtube-tag-generator':
      case 'youtube-title-generator':
      case 'youtube-embed-code-generator':
      case 'youtube-timestamp-link-generator':
        return <YouTubeTools type={params.slug as any} />;

      // SEO Generators
      case 'meta-tag-generator':
      case 'open-graph-generator':
      case 'twitter-card-generator':
      case 'robots-txt-generator':
      case 'xml-sitemap-generator':
        return <SeoTools type={params.slug as any} />;

      // Keyword & Content
      case 'keyword-density-checker':
      case 'keyword-cleaner':
      case 'long-tail-keyword-generator':
      case 'slug-generator':
        return <KeywordTools type={params.slug as any} />;

      // Webmaster Tools
      case 'google-serp-simulator':
      case 'htaccess-redirect-generator':
      case 'my-ip-address':
      case 'browser-info':
      case 'screen-resolution-simulator':
      case 'responsive-checker':
        return <WebTools type={params.slug as any} />;

      // Social & Links
      case 'whatsapp-link-generator':
      case 'telegram-link-generator':
      case 'paypal-link-generator':
      case 'instagram-hashtag-generator':
      case 'email-validator':
      case 'url-opener':
        return <SocialLinkTools type={params.slug as any} />;

      // Tech Utilities
      case 'user-agent-parser':
      case 'wordpress-password-hash':
      case 'html-to-jsx':
        return <TechTools type={params.slug as any} />;

      // Calculators
      case 'age-calculator':
      case 'bmi-calculator':
      case 'percentage-calculator':
      case 'gst-calculator':
      case 'emi-calculator':
      case 'discount-calculator':
        return <CalculatorTools type={params.slug as any} />;

      // Crypto Tools
      case 'base64-encoder':
      case 'md5-hash':
      case 'sha256-hash':
      case 'sha512-hash':
      case 'bcrypt-generator':
      case 'uuid-generator':
      case 'qr-code-generator':
        return <CryptoTools type={params.slug as any} />;

      // Regex & Diff Tools
      case 'regex-tester':
      case 'diff-checker':
        return <RegexDiffTools type={params.slug as any} />;

      default:
        return <div className="p-12 text-center text-gray-500">Tool implementation coming soon.</div>;
    }
  };

  // WebPage Schema for better indexing
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: translatedName,
    description: translatedDesc,
    url: `https://tools.aynzo.com/${params.locale}/tools/${params.slug}`,
    inLanguage: params.locale,
    isPartOf: {
      '@type': 'WebSite',
      name: 'AYNZO TOOLS',
      url: 'https://tools.aynzo.com'
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://tools.aynzo.com/${params.locale}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `https://tools.aynzo.com/${params.locale}/tools`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: translatedName,
          item: `https://tools.aynzo.com/${params.locale}/tools/${params.slug}`
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Schema Markup for SEO */}
      {seo?.schema && (
        <Script
          id="tool-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...seo.schema,
              name: translatedName,
              description: translatedDesc,
              inLanguage: params.locale
            })
          }}
        />
      )}

      {/* WebPage Schema for better indexing */}
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema)
        }}
      />

      <div className="w-full max-w-7xl mx-auto py-4 px-4 md:px-6">
        {/* Breadcrumbs for SEO */}
        <Breadcrumbs
          items={[
            { label: tNav('tools'), href: '/tools' },
            { label: translatedName, href: `/tools/${params.slug}` }
          ]}
        />

        <ToolPageHeader
          name={translatedName}
          description={translatedDesc}
          category={translatedCategory}
          h1={tTools.has(`${params.slug}.seoH1`) ? tTools(`${params.slug}.seoH1`) : (seo?.h1 || translatedName)}
        />



        {/* Tool Content */}
        <div className="mb-6">
          {renderTool()}
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ShareButtons
              title={translatedName}
              url={`https://tools.aynzo.com/${params.locale}/tools/${params.slug}`}
            />

            {/* FAQ Section with Schema - Only for English for now to avoid language mismatch */}
            {params.locale === 'en' && seo?.faq && <FAQSection faqs={seo.faq} />}

            {/* Info Section */}
            {/* 
                CRITICAL: Only show hardcoded 'content' and 'faq' if the locale is 'en'.
                For other languages, we rely on the dynamic fallback in ToolInfoSection 
                which uses the translated description and generic text.
                This ensures the user doesn't see English blocks on a Translated page.
            */}
            <ToolInfoSection
              name={translatedName}
              description={translatedDesc}
              content={tTools.has(`${params.slug}.content`) ? tTools.raw(`${params.slug}.content`) : (params.locale === 'en' ? seo?.content : undefined)}
            />
          </div>

          <div className="space-y-8">


            {/* Sidebar or extra info could go here */}
            <div className="bg-muted p-6 rounded-xl border border-border">
              <h3 className="font-bold text-lg mb-4">{t('whyUse')}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground transition-all">
                <li className="flex items-center gap-2">✅ {t('fastSecure')}</li>
                <li className="flex items-center gap-2">✅ {t('browserProcessing')}</li>
                <li className="flex items-center gap-2">✅ {t('noStorage')}</li>
                <li className="flex items-center gap-2">✅ {t('mobileFriendly')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Tools for Internal Linking */}
        <RelatedTools
          currentSlug={params.slug}
          category={tool.category}
        />

        {/* Back navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-2xl transition-all font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('backToTools')}
          </Link>
        </div>
      </div>
    </div>
  );
}
