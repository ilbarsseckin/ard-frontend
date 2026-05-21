import { Printer, Scissors, Layers, Package, Palette } from 'lucide-react'

const gallery = [
  { icon: Printer, title: 'Büyük format baskı hattı', desc: '3 makine · Günlük 500m² kapasite', big: true, color: '#378ADD', img: '/images/printer-colors.jpg' },
  { icon: Scissors, title: 'Kesim hattı', desc: 'Contour kesim · Sticker', color: '#1D9E75' },
  { icon: Package, title: 'Paketleme', desc: 'Her sipariş özenle paketlenir', color: '#BA7517' },
  { icon: Palette, title: 'Renk kontrol', desc: 'Pantone uyumluluk', color: '#534AB7' },
  { icon: Layers, title: 'Dijital ofset', desc: '4800dpi · Kartvizit & broşür', color: '#D4537E', img: '/images/printer-large.jpg' },
]

export default function FabrikaSection() {
  return (
    <section id="fabrika" className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Fabrika</p>
            <h2 className="text-[32px] font-bold tracking-[-1px]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Fabrikadan kareler
            </h2>
            <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              1200 m² üretim alanı, 24 çalışan
            </p>
          </div>
          <span className="text-[12px] font-semibold text-[#F4821F] cursor-pointer hover:underline">
            Galeriyi gör →
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {gallery.map((g, i) => (
            <div key={i}
              className={`rounded-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300 ${g.big ? 'col-span-2' : ''}`}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className={`${g.big ? 'h-[180px]' : 'h-[110px]'} relative overflow-hidden`}>
                {g.img ? (
                  <>
                    <img src={g.img} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ opacity: 0.65 }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <g.icon size={g.big ? 40 : 28} style={{ color: 'white', opacity: 0.8 }} />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                    style={{ background: `${g.color}0A` }}>
                    <g.icon size={g.big ? 40 : 28} style={{ color: g.color, opacity: 0.5 }} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>{g.title}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
