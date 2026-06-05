import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-[#F4821F] px-6 py-10 md:px-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }} />
        <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-white/30" />

        <div className="relative">
          <h2 className="text-[24px] md:text-[28px] font-bold text-white tracking-[-0.5px] mb-2"
            style={{ fontFamily: 'Georgia, serif' }}>
            Projenizi hayata geçirelim
          </h2>
          <p className="text-[13px] md:text-[14px] text-white/70">
            Anlık fiyat · Güvenli ödeme · 48 saatte teslimat · 81 ilde kargo
          </p>
        </div>
        <div className="relative flex items-center gap-3 w-full md:w-auto flex-shrink-0">
          <Link href="tel:02120000000"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 text-white text-[13px] font-semibold px-4 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
            <Phone size={14} />
            <span className="hidden sm:inline">0212 000 00 00</span>
            <span className="sm:hidden">Ara</span>
          </Link>
          <Link href="/urunler"
            className="flex-1 md:flex-none group flex items-center justify-center gap-2 bg-white text-[#F4821F] text-[13px] font-bold px-5 py-3 rounded-xl hover:opacity-95 transition-opacity">
            Sipariş ver
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
