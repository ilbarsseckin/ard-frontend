import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="px-6 pb-16 max-w-7xl mx-auto">
      <div className="bg-[#F4821F] rounded-2xl px-8 py-8 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-medium text-white tracking-[-0.3px] mb-1.5">
            Hemen sipariş vermek ister misiniz?
          </h2>
          <p className="text-[13px] text-white/70">
            Anlık fiyat hesapla · Güvenli ödeme · 48 saatte teslimat
          </p>
        </div>
        <Link href="/siparis"
          className="bg-white text-[#F4821F] text-[13px] font-medium px-6 py-3 rounded-[9px] hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0">
          Sipariş ver <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
