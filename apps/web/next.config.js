/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ningclean/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig