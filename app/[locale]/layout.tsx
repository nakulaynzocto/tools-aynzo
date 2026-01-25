import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/Providers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
      google: "your-google-verification-code",
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
      icon: '/favicon.ico',
      shortcut: '/logo.png',
      apple: '/logo.png',
    }
  };
}

import Footer from "@/components/Footer";

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
        {/* 
          GOOGLE ADSENSE PLACEHOLDER 
          When you get your AdSense Client ID (e.g., ca-pub-xxxxxxxxxxx), 
          uncomment the lines below and replace 'YOUR_CLIENT_ID'
        */}
        {/* <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_CLIENT_ID"
            crossOrigin="anonymous"
        /> */}
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
            <Providers>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="top-center" richColors />
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}