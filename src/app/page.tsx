import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import ProductsSection from '@/components/sections/ProductsSection'
import ReferencesSection from '@/components/sections/ReferencesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import CtaSection from '@/components/sections/CtaSection'
import HesaplamaSection from '@/components/sections/HesaplamaSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
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