import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function HakkimizdaPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Hakkımızda</p>
        <h1 className="text-[40px] font-bold tracking-[-1px] mb-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
          Biz kimiz?
        </h1>
        <div className="text-[15px] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>
          <p className="mb-4">baskıurunleri.com, 2010 yılından bu yana Türkiye'nin önde gelen dijital baskı firmalarından biri olarak hizmet vermektedir. İstanbul İkitelli'deki 1200 m² fabrikamızda, büyük format baskıdan kartvizite, sticker'dan tabela üretimine kadar geniş bir yelpazede hizmet sunuyoruz.</p>
          <p className="mb-4">Migros, Efes Pilsen, Burger King gibi Türkiye'nin en büyük markalarıyla çalışan deneyimli ekibimiz, her siparişe aynı özenle yaklaşmaktadır.</p>
          <p>Teknoloji, kalite ve hız odaklı yaklaşımımızla müşterilerimizin baskı ihtiyaçlarını en kısa sürede karşılamayı hedefliyoruz.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}