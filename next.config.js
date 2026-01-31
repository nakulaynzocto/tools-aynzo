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
