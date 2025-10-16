import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint and TypeScript checking during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: true,
  },
  // Webpack config to exclude problematic imports
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Vercel handles output automatically - no need to specify 'standalone'
};

export default nextConfig;
