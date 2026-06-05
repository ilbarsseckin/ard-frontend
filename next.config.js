/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  images: {
      unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'baskiurunleri.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.baskiurunleri.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/urun/kartvizit',
        destination: '/urun/standart-kartvizit',
        permanent: true,
      },
    ]
  },
}
module.exports = nextConfig