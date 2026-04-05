import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/common/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import Script from 'next/script';
import Footer from "@/components/common/components/Footer";
import { locales } from '@/i18n';
import NextTopLoader from '@/components/common/components/NextTopLoader';
import CommandPalette from '@/components/common/components/CommandPalette';

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'App' });
  
  const siteTitle = t('name') || "AYNZO TOOLS";
  const siteDesc = t('description') || "Professional online tools for developers and content creators.";
  const siteKeywords = t('keywords') || "online tools, free utilities";

  return {
    metadataBase: new URL('https://tools.aynzo.com'),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`
    },
    description: siteDesc,
    keywords: siteKeywords,
    authors: [{ name: "AYNZO TOOLS" }],
    creator: "AYNZO TOOLS",
    publisher: "AYNZO TOOLS",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: locale,
      url: `https://tools.aynzo.com/${locale}`,
      siteName: "Aynzo Tools",
      title: `${siteTitle} | 100+ Free Online Tools`,
      description: siteDesc,
      images: [
        {
          url: "https://tools.aynzo.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "Aynzo Tools - 100+ Free Professional Online Tools"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteTitle} | 100+ Free Online Tools`,
      description: siteDesc,
      images: ["https://tools.aynzo.com/og-image.png"],
      site: "@aynzoworld",
      creator: "@aynzoworld"
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    },
    alternates: {
      canonical: `https://tools.aynzo.com/${locale}`,
      languages: {
        'x-default': 'https://tools.aynzo.com/en',
        ...Object.fromEntries(
          locales.map((l) => [l, `https://tools.aynzo.com/${l}`])
        )
      }
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-192.png', sizes: '192x192', type: "image/png" },
        { url: '/icon-512.png', sizes: '512x512', type: "image/png" },
        { url: '/logo.png', sizes: '32x32', type: "image/png" },
      ],
      shortcut: '/favicon.ico',
      apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.webmanifest',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

import PromotionalBanner from '@/components/common/components/PromotionalBanner';

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aynzo",
              "url": "https://tools.aynzo.com",
              "logo": "https://tools.aynzo.com/logo.png",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61579388700386",
                "https://www.instagram.com/aynzo.world",
                "https://x.com/aynzoworld",
                "https://www.linkedin.com/company/aynzo/",
                "https://www.youtube.com/channel/UC7lY7bl4eALJv4oUwXpfGMg"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-86999-66076",
                "contactType": "customer service",
                "email": "support@aynzo.com"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aynzo Tools",
              "url": "https://tools.aynzo.com",
              "publisher": {
                "@type": "Organization",
                "name": "Aynzo",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://tools.aynzo.com/logo.png",
                  "width": 1200,
                  "height": 630,
                },
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": `https://tools.aynzo.com/${locale}?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={outfit.className}>
        <NextTopLoader />
        <NextIntlClientProvider messages={messages}>
          <CommandPalette />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <PromotionalBanner />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}