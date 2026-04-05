/** @type {import('next').NextConfig} */
const path = require('path');
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
    root: path.resolve(__dirname, '../../'),
  },
}

module.exports = nextConfig