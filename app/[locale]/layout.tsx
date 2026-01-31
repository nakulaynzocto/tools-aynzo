import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/common/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL('https://tools.aynzo.com'),
    title: {
      template: '%s | AYNZO TOOLS',
      default: 'AYNZO TOOLS - Free Text, Image, Dev & Security Tools',
    },
    description: "Professional online tools for developers and content creators. Free text tools, image compressor, JSON formatter, password generator, and more. Fast, secure, and easy to use.",
    keywords: "aynzo tools, online tools, text tools, image compressor, JSON formatter, password generator, URL encoder, word counter, character counter, developer tools, free tools",
    authors: [{ name: "AYNZO TOOLS" }],
    creator: "AYNZO TOOLS",
    publisher: "AYNZO TOOLS",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: locale,
      url: `https://tools.aynzo.com/${locale}`,
      siteName: "AYNZO TOOLS",
      title: "AYNZO TOOLS - Free Professional Tools",
      description: "Professional online tools for developers and content creators. Free text tools, image compressor, JSON formatter, and more.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "AYNZO TOOLS"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "AYNZO TOOLS - Free Professional Tools",
      description: "Professional online tools for developers and content creators.",
      images: ["/og-image.png"]
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    },
    alternates: {
      canonical: `https://tools.aynzo.com/${locale}`,
      languages: {
        'en': 'https://tools.aynzo.com/en',
        'hi': 'https://tools.aynzo.com/hi',
        'pt': 'https://tools.aynzo.com/pt',
        'es': 'https://tools.aynzo.com/es',
        'id': 'https://tools.aynzo.com/id',
        'de': 'https://tools.aynzo.com/de',
        'fr': 'https://tools.aynzo.com/fr',
        'ja': 'https://tools.aynzo.com/ja',
        'ru': 'https://tools.aynzo.com/ru',
        'tr': 'https://tools.aynzo.com/tr',
        'it': 'https://tools.aynzo.com/it',
        'ko': 'https://tools.aynzo.com/ko',
        'zh': 'https://tools.aynzo.com/zh',
        'ar': 'https://tools.aynzo.com/ar',
      }
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/logo.png', sizes: '32x32', type: "image/png" },
        { url: '/logo.png', sizes: '16x16', type: "image/png" },
      ],
      shortcut: '/favicon.ico',
      apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
    }
  };
}

import Footer from "@/components/common/components/Footer";

import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
                "target": "https://tools.aynzo.com/en?q={search_term_string}",
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
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
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