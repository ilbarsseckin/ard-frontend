import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="px-6 pb-20 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-[#F4821F] px-10 py-12 flex items-center justify-between">
        {/* Dekoratif nokta deseni */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }} />
        {/* Sol çizgi */}
        <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-white/30" />

        <div className="relative">
          <h2 className="text-[28px] font-bold text-white tracking-[-0.5px] mb-2"
            style={{ fontFamily: 'Georgia, serif' }}>
            Projenizi hayata geçirelim
          </h2>
          <p className="text-[14px] text-white/70">
            Anlık fiyat · Güvenli ödeme · 48 saatte teslimat · 81 ilde kargo
          </p>
        </div>
        <div className="relative flex items-center gap-3 flex-shrink-0">
          <Link href="tel:02120000000"
            className="flex items-center gap-2 bg-white/10 text-white text-[13px] font-semibold px-5 py-3.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm">
            <Phone size={14} />
            0212 000 00 00
          </Link>
          <Link href="/siparis"
            className="group flex items-center gap-2 bg-white text-[#F4821F] text-[13px] font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-opacity">
            Sipariş ver
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
