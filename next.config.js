const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: false,
  // Optimize build size
  compress: true,
  swcMinify: true,
  // Image optimization configuration
  images: {
    unoptimized: false,
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },


  // Permanent redirects for old/renamed tool slugs and protocol/domain fixes
  // These fix "Excluded by noindex", "Not Found (404)", and "Page with redirect" errors in GSC
  async redirects() {
    const slugRedirects = [
      // Old slug → New/correct slug (renamed tools)
      { source: 'text-replace', destination: 'find-replace' },
      { source: 'remove-duplicate-lines', destination: 'duplicate-line-remover' },
      { source: 'remove-extra-spaces', destination: 'whitespace-remover' },
    ];

    const locales = ['en', 'hi', 'pt', 'es', 'id', 'de', 'fr', 'ja', 'ru', 'tr', 'it', 'ko', 'zh', 'ar'];
    const allRedirects = [];

    // Redirects for renamed slugs (all locales)
    for (const { source, destination } of slugRedirects) {
      for (const locale of locales) {
        allRedirects.push({
          source: `/${locale}/tools/${source}`,
          destination: `/${locale}/tools/${destination}`,
          permanent: true,
        });
      }
      // Also redirect without locale prefix (catches non-locale hits)
      allRedirects.push({
        source: `/tools/${source}`,
        destination: `/tools/${destination}`,
        permanent: true,
      });
    }

    // Redirects for malformed URLs with spaces — crawled by Google from old broken seo.ts hrefs
    const spacedToolRedirects = [
      {
        source: '/en%20/%20tools%20/%20youtube%20-%20title%20-%20generator',
        destination: '/tools/youtube-title-generator',
      },
      {
        source: '/en%20/%20tools%20/%20youtube%20-%20thumbnail%20-%20downloader',
        destination: '/tools/youtube-thumbnail-downloader',
      },
      {
        source: '/en%20/%20tools%20/%20youtube%20-%20tag%20-%20generator',
        destination: '/tools/youtube-tag-generator',
      },
      {
        // Catch-all for $ URL (bot/GSC artifact)
        source: '/$',
        destination: '/',
      },
    ];

    allRedirects.push(...spacedToolRedirects.map(r => ({ ...r, permanent: true })));

    return allRedirects;
  },

  // Removed X-Robots-Tag noindex headers - using proper canonical URLs and meta robots instead

  // Exclude unnecessary packages from standalone build
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        'node_modules/canvas/**/*',
        // Exclude unused sharp platform binaries (keep only linux-x64)
        'node_modules/@img/sharp-libvips-darwin-*',
        'node_modules/@img/sharp-libvips-win32-*',
        'node_modules/@img/sharp-libvips-linuxmusl-*',
        'node_modules/@img/sharp-libvips-linux-arm64-*',
        'node_modules/@img/sharp-libvips-linux-armv7-*',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    // Configure fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        canvas: false, // Exclude canvas from client bundle
      };
    }

    // Ignore canvas import from pdfjs-dist (it's optional and not needed in browser)
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^canvas$/,
        contextRegExp: /pdfjs-dist/,
      })
    );

    // Also add alias as fallback
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
