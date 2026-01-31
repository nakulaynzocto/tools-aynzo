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
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        canvas: false, // Exclude canvas from client bundle
      };
    } else {
      // Server-side: exclude canvas if not needed
      config.externals = config.externals || [];
      // Only include canvas if actually used (check your usage)
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
