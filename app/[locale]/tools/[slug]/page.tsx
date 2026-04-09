import { api, tools } from '@/lib/tools';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { ToolPageHeader } from '@/components/common/components/ToolPageHeader';
import { ToolInfoSection } from '@/components/common/components/ToolInfoSection';
import { Link } from '@/navigation';
import { ArrowLeft } from 'lucide-react';
import { getToolSEO } from '@/lib/seo';
import { Breadcrumbs } from '@/components/common/components/Breadcrumbs';
import { RelatedTools } from '@/components/common/components/RelatedTools';
import { ShareButtons } from '@/components/common/components/ShareButtons';
import { EmbedWidget } from '@/components/common/components/EmbedWidget';
import Script from 'next/script';
import { generateProgrammaticMetadata } from '@/utils/seo-utils';
import { locales } from '@/i18n';
import { getToolOGImage } from '@/utils/og-image-utils';
import { getLocalePrefix, getLocalizedUrl, getAllHreflangUrls, getXDefaultUrl, PRIMARY_LOCALE, localizeHtmlLinks } from '@/utils/locale-utils';
import { SITE_URL } from '@/lib/constants';

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
const CryptoTools = dynamic(() => import('@/components/tools/crypto/Index'), { ssr: false });
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

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tools.map((tool) => ({
      locale,
      slug: tool.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const tTools = await getTranslations({ locale: params.locale, namespace: 'Tools' });
    const tApp = await getTranslations({ locale: params.locale, namespace: 'App' });
    const seo = getToolSEO(params.slug);
    const fallbackSeo = generateProgrammaticMetadata(params.slug, params.locale);
    
    // Get tool data for category-based OG image
    const toolRes = await api.getProduct(params.slug);
    const tool = toolRes.success ? toolRes.data : null;
    const toolCategory = tool?.category || 'utility';
    const toolName = tool?.name || params.slug;

    const name = tTools.has(`${params.slug}.name`) ? tTools(`${params.slug}.name`) : (seo?.h1 || params.slug);
    const siteName = tApp('name');

    const localizedTitle = tTools.has(`${params.slug}.seoTitle`)
      ? tTools(`${params.slug}.seoTitle`)
      : (seo?.title || fallbackSeo?.title);

    const localizedDesc = tTools.has(`${params.slug}.seoDescription`)
      ? tTools(`${params.slug}.seoDescription`)
      : (seo?.description || fallbackSeo?.description);

    const localizedKeywords = tTools.has(`${params.slug}.seoKeywords`)
      ? tTools(`${params.slug}.seoKeywords`)
      : (seo?.keywords || fallbackSeo?.keywords);

    const finalTitle = localizedTitle || `${name} | ${siteName}`;
    const finalDesc = localizedDesc || `Use our free online ${name} tool. Fast, secure, and easy to use.`;
    const finalKeywords = localizedKeywords || `${name.toLowerCase()}, online tools, free online ${name.toLowerCase()}`;
    
    // as-needed locale prefix logic
    const localePrefix = getLocalePrefix(params.locale);
    
    // Get category-specific OG image
    const ogImage = getToolOGImage(toolCategory, toolName);

    return {
      title: finalTitle,
      description: finalDesc,
      keywords: finalKeywords,
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        type: 'website',
        url: getLocalizedUrl('https://tools.aynzo.com', params.locale, `/tools/${params.slug}`),
        images: [
          {
            url: ogImage.url,
            width: ogImage.width,
            height: ogImage.height,
            alt: ogImage.alt,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
        images: [ogImage.url],
      },
      alternates: {
        canonical: getLocalizedUrl('https://tools.aynzo.com', params.locale, `/tools/${params.slug}`),
        languages: {
          'x-default': getXDefaultUrl('https://tools.aynzo.com', `/tools/${params.slug}`),
          ...getAllHreflangUrls('https://tools.aynzo.com', locales, `/tools/${params.slug}`)
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

  const tTools = await getTranslations({ locale: params.locale, namespace: 'Tools' });
  const t = tTools;
  const tCommon = await getTranslations({ locale: params.locale, namespace: 'Common' });

  const translatedName = tTools.has(`${params.slug}.name`) ? tTools(`${params.slug}.name`) : tool.name;
  const translatedDesc = tTools.has(`${params.slug}.seoDescription`) 
    ? tTools(`${params.slug}.seoDescription`) 
    : (tTools.has(`${params.slug}.description`) ? tTools(`${params.slug}.description`) : tool.description);

  const tCategories = await getTranslations({ locale: params.locale, namespace: 'Categories' });
  const translatedCategory = tCategories.has(tool.category) ? tCategories(tool.category) : tool.category;
  const tNav = await getTranslations({ locale: params.locale, namespace: 'Navigation' });

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
      case 'youtube-money-calculator':
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
      case 'privacy-policy-generator':
      case 'terms-conditions-generator':
      case 'tiktok-hashtag-generator':
      case 'bio-link-generator':
        return <SocialLinkTools type={params.slug as any} />;

      // Tech Utilities
      case 'user-agent-parser':
      case 'wordpress-password-hash':
      case 'html-to-jsx':
        return <TechTools type={params.slug as any} />;

      // Calculators
      case '401k-retirement-calculator':
      case 'dti-calculator':
      case 'car-loan-calculator':
      case 'credit-card-payoff-calculator':
      case 'savings-goal-calculator':
      case 'freelance-tax-calculator':
      case 'tdee-calculator':
      case 'pregnancy-due-date-calculator':
      case 'macro-calculator':
      case 'ideal-weight-calculator':
      case 'age-calculator':
      case 'bmi-calculator':
      case 'percentage-calculator':
      case 'gst-calculator':
      case 'emi-calculator':
      case 'discount-calculator':
      case 'compound-interest-calculator':
      case 'mortgage-calculator':
      case 'sip-calculator':
      case 'crypto-profit-calculator':
      case 'inflation-calculator':
      case 'roi-calculator':
      case 'cpm-calculator':
      case 'gpa-calculator':
      case 'salary-calculator':
      case 'tip-calculator':
      case 'sales-tax-calculator':
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

      // Utility Tools
      case 'chatgpt-prompt-generator':
      case 'ai-content-detector':
      case 'text-to-handwriting':
      case 'grammar-checker':
        return <UtilityTools type={params.slug as any} />;

      // Dev Tools
      case 'crontab-generator':
      case 'json-to-typescript':
        return <DevTools type={params.slug as any} />;

      default:
        return <div className="p-12 text-center text-gray-500">Tool implementation coming soon.</div>;
    }
  };

  // WebPage Schema for better indexing
  const lastUpdated = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: translatedName,
    description: translatedDesc,
    url: getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}`),
    inLanguage: params.locale,
    dateModified: lastUpdated,
    isPartOf: {
      '@type': 'WebSite',
      name: 'AYNZO TOOLS',
      url: 'https://tools.aynzo.com'
    }
  };

  // HowTo Schema for rich SERP results
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${translatedName}`,
    description: translatedDesc,
    totalTime: 'PT1M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Open the Tool',
        text: `Navigate to the ${translatedName} page on Aynzo Tools.`,
        url: getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}#tool`)
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Enter Your Input',
        text: `Paste or type your content into the ${translatedName} input area.`,
        url: getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}#tool`)
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Get Instant Results',
        text: 'Click the action button and get your results instantly. No signup or download required.',
        url: getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}#tool`)
      }
    ]
  };

  const localizedFaqs = tTools.has(`${params.slug}.faq`) ? (tTools.raw(`${params.slug}.faq`) as any[]) : (seo?.faq || []);
  const faqSchema = localizedFaqs && localizedFaqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': localizedFaqs.map((item: any) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  } : null;

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
              inLanguage: params.locale,
              url: getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}`)
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

      {/* SoftwareApplication Schema for SERP Stars */}
      <Script
        id="software-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: translatedName,
            description: translatedDesc,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            url: getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}`),
            softwareVersion: '2.0.1',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            }
          })
        }}
      />

      {/* HowTo Schema for Rich SERP Results */}
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema)
        }}
      />

      {/* FAQ Schema for Rich SERP Results */}
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}

      <div className="w-full max-w-7xl mx-auto py-4 px-4 md:px-6">
        {/* Breadcrumbs for SEO */}
        <Breadcrumbs
          items={[
            { label: tNav('tools'), href: '/tools' },
            { label: translatedName, href: `/tools/${params.slug}` }
          ]}
        />

        {/* 1. Tool Content (Pahle tools ho) */}
        <div className="mb-8 mt-4">
          {renderTool()}
        </div>

        {/* 2. Tool Header (Uske badd tittle) */}
        <ToolPageHeader
          name={translatedName}
          description={translatedDesc}
          category={translatedCategory}
          h1={seo?.h1}
        />

        {/* 3. FAQ Section (Uke badd faq) */}
        {(() => {
          const faqs = tTools.has(`${params.slug}.faq`) ? (tTools.raw(`${params.slug}.faq`) as any[]) : (seo?.faq || []);
          if (!faqs || faqs.length === 0) return null;
          return <FAQSection title={tCommon('faqTitle')} faqs={faqs} />;
        })()}

        {/* 4. Info Section (And fir conted) */}
        <ToolInfoSection
          name={translatedName}
          description={translatedDesc}
          content={(() => {
            // Priority 1: Localized JSON content from messages/
            const localizedContent = tTools.has(`${params.slug}.content`) ? (tTools.raw(`${params.slug}.content`) as string) : undefined;
            
            // Priority 2: Hardcoded rich content from lib/seo.ts (Fallback for all languages)
            const hardcodedContent = seo?.content;
            
            const finalRawContent = localizedContent || hardcodedContent;
            
            if (!finalRawContent) return undefined;
            
            return localizeHtmlLinks(finalRawContent, params.locale);
          })()}
        />

        <ShareButtons
          title={translatedName}
          url={getLocalizedUrl(SITE_URL, params.locale, `/tools/${params.slug}`)}
        />

        {/* Embed Widget - Backlink Generator */}
        <EmbedWidget
          slug={params.slug}
          toolName={translatedName}
          locale={params.locale}
        />

        {/* Last Updated - Freshness Signal for SEO */}
        <div className="flex items-center justify-end mt-3">
          <span className="text-xs text-muted-foreground/60 italic">
            Last updated: {new Date().toLocaleDateString(params.locale, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
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
