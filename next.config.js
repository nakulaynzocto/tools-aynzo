const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Optimize build size
  compress: true,
  swcMinify: true,
  // Image optimization configuration
  images: {
    unoptimized: false,
    remotePatterns: [],
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
        destination: `/en/tools/${destination}`,
        permanent: true,
      });
    }

    // Redirects for malformed URLs with spaces — crawled by Google from old broken seo.ts hrefs
    const spacedToolRedirects = [
      {
        source: '/en%20/%20tools%20/%20youtube%20-%20title%20-%20generator',
        destination: '/en/tools/youtube-title-generator',
      },
      {
        source: '/en%20/%20tools%20/%20youtube%20-%20thumbnail%20-%20downloader',
        destination: '/en/tools/youtube-thumbnail-downloader',
      },
      {
        source: '/en%20/%20tools%20/%20youtube%20-%20tag%20-%20generator',
        destination: '/en/tools/youtube-tag-generator',
      },
      {
        // Catch-all for $ URL (bot/GSC artifact)
        source: '/$',
        destination: '/en',
      },
    ];

    allRedirects.push(...spacedToolRedirects.map(r => ({ ...r, permanent: true })));

    return allRedirects;
  },

  // Add X-Robots-Tag: noindex to non-locale paths that next-intl 307-redirects to locale versions.
  // This prevents Google from treating the redirect source (e.g. /tools/lorem-ipsum) as
  // a competing canonical against the user-declared canonical (/en/tools/lorem-ipsum).
  async headers() {
    return [
      {
        // The root / path (redirects to /en via next-intl middleware)
        source: '/',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        // /tools and all /tools/* paths (redirect to /en/tools/...)
        source: '/tools/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },

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
