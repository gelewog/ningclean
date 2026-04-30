/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.ningclean.com'],
  },
  // Reduce memory usage during build
  swcMinify: true,
  experimental: {
    // Disable some features to save memory
    optimizeCss: false,
  },
  // Use webpack with less workers
  webpack: (config, { isServer }) => {
    config.parallelism = 1;
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
