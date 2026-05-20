'use client'

import {
  Printer,
  Scissors,
  Layers,
  ArrowRight,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'

const machines = [
  {
    name: 'HP Latex 700W',
    desc: 'Büyük format · 2.64m · 1200dpi',
    pct: 72,
    color: '#F4821F',
    icon: Printer,
    active: true,
  },
  {
    name: 'Roland TrueVIS VG3',
    desc: 'Sticker + Kesim · 1440dpi',
    pct: 55,
    color: '#0F6E56',
    icon: Scissors,
    active: true,
  },
  {
    name: 'Konica AccurioPress',
    desc: 'Dijital Ofset · 4800dpi',
    pct: 88,
    color: '#854F0B',
    icon: Layers,
    active: false,
  },
]

const ticker = [
  'İstanbul — Vinil Baskı — 2dk önce',
  'Ankara — Kartvizit — 5dk önce',
  'İzmir — Katalog Baskı — 8dk önce',
  'Bursa — Sticker Kesim — 12dk önce',
]

export default function PrintVisionCorporate() {
  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#111827] overflow-hidden">

      {/* PAINT SPLASH EFFECTS */}
      <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full mix-blend-multiply" />
      <div className="absolute top-[120px] right-[200px] w-[300px] h-[300px] bg-blue-500/20 blur-3xl rounded-full mix-blend-multiply" />
      <div className="absolute top-[300px] left-[-120px] w-[400px] h-[400px] bg-emerald-400/10 blur-3xl rounded-full mix-blend-multiply" />
      <div className="absolute bottom-[-150px] left-[200px] w-[500px] h-[500px] bg-pink-500/10 blur-3xl rounded-full mix-blend-multiply" />

      <section className="relative overflow-hidden border-b border-black/5 bg-white">

        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_30%,#F4821F,transparent_40%),radial-gradient(circle_at_80%_70%,#3b82f6,transparent_45%)]" />

        <div className="max-w-7xl mx-auto px-6 pt-10 pb-16 relative z-10">

          <header className="flex items-center justify-between mb-16">
            <div>
              <h1 className="text-3xl font-black tracking-[-1px]">
                PRINTORA
              </h1>
              <p className="text-[11px] tracking-[4px] text-gray-400 uppercase mt-1">
                Premium Print Factory
              </p>
            </div>

            <button className="bg-[#111827] text-white px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-xl">
              <ShoppingCart size={16} />
              Sepetim
            </button>
          </header>

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-semibold mb-7">
                <Sparkles size={14} />
                Türkiye'nin Yeni Nesil Baskı Merkezi
              </div>

              <h2 className="text-[68px] leading-[0.95] tracking-[-3px] font-black">
                Baskının
                <span className="block text-[#F4821F]">premium</span>
                hali.
              </h2>

              <p className="mt-8 text-[17px] text-gray-500 leading-relaxed max-w-[520px]">
                Kartvizit, katalog, kutu, sticker ve büyük format baskıları online sipariş ver.
                Fabrika kalitesinde üretim, gerçek zamanlı takip.
              </p>

              <div className="flex gap-4 mt-10">
                <a
                  href="/siparis"
                  className="bg-[#F4821F] text-white px-7 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-2xl shadow-orange-500/20 hover:scale-[1.02] transition"
                >
                  Hemen Sipariş Ver
                  <ArrowRight size={16} />
                </a>

                <a
                  href="/urunler"
                  className="bg-white border border-black/10 px-7 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Ürünleri İncele
                </a>
              </div>
            </div>

            <div className="relative">

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-[40px]" />

              <img
                src="https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1400&auto=format&fit=crop"
                alt="Baskı fabrikası"
                className="rounded-[40px] h-[720px] w-full object-cover shadow-2xl"
              />

              <div className="absolute top-6 right-6 flex flex-col gap-3 w-[280px]">
                {machines.map((m, i) => (
                  <div
                    key={i}
                    className="bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${m.color}20` }}
                      >
                        <m.icon size={18} style={{ color: m.color }} />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-sm font-bold">
                          {m.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {m.desc}
                        </p>
                      </div>

                      <span className={`w-2.5 h-2.5 rounded-full ${m.active ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.pct}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 bg-[#fafafa] overflow-hidden py-4">
          <div className="flex gap-8 whitespace-nowrap animate-[scroll_25s_linear_infinite] px-8">
            {[...ticker, ...ticker].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-\[scroll_25s_linear_infinite\] {
            animation: scroll 25s linear infinite;
            width: max-content;
          }
        `}</style>
      </section>
    </div>
  )
}
