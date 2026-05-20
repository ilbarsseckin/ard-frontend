import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ProductsSection from '@/components/sections/ProductsSection'
import FabrikaSection from '@/components/sections/FabrikaSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import CtaSection from '@/components/sections/CtaSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <FabrikaSection />
        <ReviewsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
