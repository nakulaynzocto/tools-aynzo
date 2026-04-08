import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AYNZO TOOLS - Professional Online Tools",
  description: "Fast, secure, and free online tools for developers and creators.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const baseUrl = 'https://tools.aynzo.com';
  const canonicalUrl = `${baseUrl}${pathname}`;

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
