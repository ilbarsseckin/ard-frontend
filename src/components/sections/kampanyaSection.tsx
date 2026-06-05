import Link from 'next/link'

export default function KampanyaSection() {
  return (
    <section className="px-4 md:px-6 py-10 md:py-12 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl md:rounded-[32px] bg-gradient-to-r from-[#111111] via-[#1f1f1f] to-[#F4821F] p-6 sm:p-8 md:p-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-[#F4821F]/40 blur-xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex mb-4 rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-sm font-semibold text-white">
            🔥 Haftanın Kampanyası
          </span>

          <h2 className="text-[26px] sm:text-3xl md:text-5xl font-extrabold text-white leading-tight mb-3 md:mb-4">
            Baskı Ürünlerinde %20&apos;ye Varan İndirim
          </h2>

          <p className="text-white/80 text-[14px] sm:text-base md:text-lg mb-6 md:mb-7">
            Kartvizit, broşür, sticker, tabela ve daha birçok üründe markanıza özel avantajlı baskı çözümleri.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/urunler"
              className="inline-flex justify-center rounded-full bg-[#F4821F] px-6 sm:px-7 py-3 text-[13px] sm:text-sm font-bold text-white hover:bg-[#e87512] transition"
            >
              Kampanyalı Ürünleri İncele
            </Link>

            <Link
              href="/iletisim"
              className="inline-flex justify-center rounded-full bg-white px-6 sm:px-7 py-3 text-[13px] sm:text-sm font-bold text-gray-900 hover:bg-gray-100 transition"
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}