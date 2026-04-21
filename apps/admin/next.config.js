/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/admin',
  images: {
    domains: ['localhost', 'api.ningclean.com'],
  },
  async rewrites() {
    // Proxy API requests to backend during development
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
