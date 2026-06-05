import type { Metadata } from 'next'
import UrunlerClient from './UrunlerClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baskiurunleri.com'

export const metadata: Metadata = {
  title: 'Tüm Ürünler — Katalog | baskıurunleri.com',
  description: 'Büyük format, kartvizit, sticker, tabela, broşür ve daha fazlası. Türkiye\'nin hızlı online matbaasında tüm baskı ürünlerini keşfedin.',
  alternates: { canonical: `${SITE_URL}/urunler` },
  openGraph: {
    title: 'Tüm Ürünler — Katalog | baskıurunleri.com',
    description: 'Büyük format, kartvizit, sticker, tabela, broşür ve daha fazlası.',
    url: `${SITE_URL}/urunler`,
    siteName: 'baskıurunleri.com',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function UrunlerPage() {
  return <UrunlerClient />
}
