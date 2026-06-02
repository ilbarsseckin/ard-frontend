/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  async redirects() {
    return [
      // Eski statik sistemden kalan kartvizit URL'si → yeni katalog ürününe kalıcı yönlendir
      {
        source: '/urun/kartvizit',
        destination: '/urun/standart-kartvizit',
        permanent: true, // 301 — tarayıcı + Google cache'ler, SEO aktarılır
      },
    ]
  },
}

module.exports = nextConfig