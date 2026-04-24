/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: '../../',
  },
}

module.exports = nextConfig