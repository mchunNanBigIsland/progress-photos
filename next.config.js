/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  // Vercel-specific configuration
  output: 'standalone',
}

module.exports = nextConfig