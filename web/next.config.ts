import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'localhost'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
  // Disable webpack cache to avoid chunk issues
  webpack: (config, { isServer }) => {
    // Fix PostCSS resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'postcss/lib/postcss': require.resolve('postcss/lib/postcss'),
    };
    
    // Disable persistent caching for development
    if (!isServer) {
      config.cache = false;
    }
    
    return config;
  },
};

export default nextConfig;
