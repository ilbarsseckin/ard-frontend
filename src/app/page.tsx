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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <HeroCarousel />
        </div>
        <BaskiCozumleri /> 
        <KampanyaSerit />      {/* Aktif kampanya yoksa otomatik gizlenir */}
        <Favorilerim />        {/* Favori yoksa otomatik gizlenir */}
        <UrunlerSection />     {/* Öne çıkan */}
        <YeniGelenler />       {/* Yeni eklenen */}
        <EnCokSatan />         {/* En çok satan ← BACKEND ÇALIŞIYOR */}
        <SonBaktiklarin />     {/* Son baktıkların */}

        <Sektorler />
        <HesaplamaSection />
        <NedenBiz />

        <ReferencesSection />
        <ReviewsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}