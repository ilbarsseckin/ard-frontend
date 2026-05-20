import { Printer, Scissors, Layers, Package, Palette, Star } from 'lucide-react'

const gallery = [
  { icon: Printer, label: 'HP Latex 700W — baskı anı', title: 'Büyük format baskı hattı', desc: '3 makine · Günlük 500m² kapasite', bg: 'rgba(55,138,221,0.06)', color: 'rgba(24,95,165,0.35)', big: true },
  { icon: Scissors, label: 'Roland TrueVIS', title: 'Kesim hattı', desc: 'Contour kesim · Sticker', bg: 'rgba(29,158,117,0.06)', color: 'rgba(15,110,86,0.4)' },
  { icon: Package, label: 'Korumalı ambalaj', title: 'Paketleme', desc: 'Her sipariş özenle paketlenir', bg: 'rgba(186,117,23,0.06)', color: 'rgba(133,79,11,0.4)' },
  { icon: Palette, label: 'Her siparişte test', title: 'Renk kontrol', desc: 'Pantone uyumluluk', bg: 'rgba(83,74,183,0.06)', color: 'rgba(83,74,183,0.4)' },
  { icon: Layers, label: 'Konica Minolta', title: 'Dijital ofset', desc: '4800dpi · Kartvizit & broşür', bg: 'rgba(212,83,126,0.06)', color: 'rgba(153,53,86,0.4)' },
]

export default function FabrikaSection() {
  return (
    <section id="fabrika" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">
            Fabrikadan kareler
          </h2>
          <p className="text-[13px] text-gray-400 mt-1">1200 m² üretim alanı, 24 çalışan</p>
        </div>
        <span className="text-[12px] text-gray-400">Galeriyi gör →</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {gallery.map((g, i) => (
          <div key={i} className={`bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden ${g.big ? 'col-span-2' : ''}`}>
            <div className={`${g.big ? 'h-[140px]' : 'h-[90px]'} flex flex-col items-center justify-center gap-2`}
              style={{ background: g.bg }}>
              <g.icon size={g.big ? 48 : 36} style={{ color: g.color }} />
              <span className="text-[10px] text-gray-400">{g.label}</span>
            </div>
            <div className="p-3">
              <div className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{g.title}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{g.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
