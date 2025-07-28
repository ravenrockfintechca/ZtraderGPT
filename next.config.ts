import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Keep your existing fix
  },
  eslint: {
    ignoreDuringBuilds: true, // Keep your existing fix
  },
  experimental: {
    // Fix for client reference manifest issues
    serverComponentsExternalPackages: ['ai'],
  },
  // Ensure proper handling of client/server boundaries
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side webpack config
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
