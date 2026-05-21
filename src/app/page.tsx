import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BannerSlider from '@/components/sections/BannerSlider'
import OncCikanUrunler from '@/components/sections/OncCikanUrunler'
import Sektorler from '@/components/sections/Sektorler'
import ProductsSection from '@/components/sections/ProductsSection'
import HesaplamaSection from '@/components/sections/HesaplamaSection'
import ReferencesSection from '@/components/sections/ReferencesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import CtaSection from '@/components/sections/CtaSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <OncCikanUrunler />
        <Sektorler />
                <BannerSlider />

        <ProductsSection />
        <HesaplamaSection />
        <ReferencesSection />
        <ReviewsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}