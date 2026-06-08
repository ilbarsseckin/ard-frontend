import type { Metadata } from 'next'
import HeroCarousel from '@/components/sections/HeroCarousel'
import UrunlerSection from '@/components/sections/UrunlerSection'
import YeniGelenler from '@/components/sections/YeniGelenler'
import EnCokSatan from '@/components/sections/EnCokSatan'
import Favorilerim from '@/components/sections/Favorilerim'
import SonBaktiklarin from '@/components/sections/SonBaktiklarin'
import NedenBiz from '@/components/sections/NedenBiz'
import Sektorler from '@/components/sections/Sektorler'
import HesaplamaSection from '@/components/sections/HesaplamaSection'
import ReferencesSection from '@/components/sections/ReferencesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import CtaSection from '@/components/sections/CtaSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BaskiCozumleri from '@/components/sections/BaskiCozumleri'
import KampanyaSerit from '@/components/sections/KampanyaSerit'
import Yelenbayrak from '@/components/sections/YelkenBayrak'
import GuvenRozetleri from '@/components/sections/GuvenRozetleri'
import FloatingCardsSection from '@/components/sections/FloatingCardsSection'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baskiurunleri.com'

export const metadata: Metadata = {
  title: 'baskıurunleri.com — Türkiye\'nin En Hızlı Online Matbaası',
  description: 'Büyük format, kartvizit, sticker, tabela. Tasarımını yükle, anlık fiyatı gör, 48 saatte kapında. Profesyonel baskı, hızlı teslimat, uygun fiyat.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'baskıurunleri.com — Türkiye\'nin En Hızlı Online Matbaası',
    description: 'Büyük format, kartvizit, sticker, tabela. Tasarımını yükle, anlık fiyatı gör, 48 saatte kapında.',
    url: SITE_URL,
    siteName: 'baskıurunleri.com',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'baskıurunleri.com — Türkiye\'nin En Hızlı Online Matbaası',
    description: 'Büyük format, kartvizit, sticker, tabela. 48 saatte kapında.',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'baskıurunleri.com',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Turkish',
  },
  sameAs: [],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6">
          <HeroCarousel />
        </div>
        <ReferencesSection />
        <BaskiCozumleri />
        <GuvenRozetleri />
        <KampanyaSerit />
        <FloatingCardsSection />
        <Favorilerim />
        <UrunlerSection />
        <YeniGelenler />
        <Yelenbayrak />
        <EnCokSatan />
        <SonBaktiklarin />
        <Sektorler />
        <HesaplamaSection />
        <NedenBiz />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  )
}