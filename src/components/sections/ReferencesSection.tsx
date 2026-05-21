'use client'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import api from '@/lib/api'

const CATEGORIES = ['Tümü', 'Zincir Market', 'İçecek & FMCG', 'Restoran', 'Otel & Turizm', 'Etkinlik & Fuar', 'Diğer']


export default function ReferencesSection() {
  const [references, setReferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('Tümü')

  useEffect(() => {
    api.get('/api/references')
      .then(r => {
        const data = r.data.data || []
        setReferences(data)
      })
      .catch(() => setReferences([]))
      .finally(() => setLoading(false))
  }, [])

  const featured = references.filter(r => r.featured)
  const filtered = active === 'Tümü' ? references : references.filter(r => r.category === active)

  const LogoAvatar = ({ item: r, size = 'md' }: { item: any, size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = { sm: 'w-9 h-9 text-[11px]', md: 'w-11 h-11 text-[13px]', lg: 'w-14 h-14 text-[16px]' }
    if (r.logoUrl) {
      return (
        <div className={`${sizes[size]} rounded-xl overflow-hidden flex-shrink-0`}
          style={{ background: 'var(--bg-secondary)', padding: '6px' }}>
          <img src={r.logoUrl} alt={r.name} className="w-full h-full object-contain" />
        </div>
      )
    }
    return (
      <div className={`${sizes[size]} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}
        style={{ background: r.color }}>
        {r.abbr || r.name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <section id="referanslar" className="py-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Başlık */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Referanslar</p>
            <h2 className="text-[32px] font-bold tracking-[-1px]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Türkiye'nin önde gelen<br />
              <span className="text-[#F4821F]">markalarıyla</span> çalışıyoruz
            </h2>
          </div>
          <p className="text-[13px] max-w-[200px] text-right" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia, serif' }}>
            {references.length}+ kurumsal müşteri,<br />binlerce başarılı proje
          </p>
        </div>

        {/* Öne çıkan referans yorumları */}
        {featured.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {featured.slice(0, 2).map((r: any) => (
              <div key={r.id} className="rounded-2xl p-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-[#F4821F]">★</span>)}
                </div>
                <p className="text-[14px] leading-[1.7] mb-5 italic"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'Georgia, serif' }}>
                  "{r.description || 'Kalite ve teslimat hızı konusunda hiç sorun yaşamadık. Kesinlikle tavsiye ederiz.'}"
                </p>
                <div className="flex items-center gap-3">
                  <LogoAvatar item={r} size="md" />
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Marka Yöneticisi</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kategori filtresi */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.filter(c => c === 'Tümü' || references.some(r => r.category === c)).map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="text-[12px] px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              style={active === cat
                ? { background: '#F4821F', color: 'white', border: '1px solid #F4821F' }
                : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid — sadece logo */}
        {loading ? (
          <div className="grid grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ background: 'var(--bg-card)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {filtered.map((ref: any) => (
              <div key={ref.id}
                className="group rounded-2xl p-4 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', height: '88px' }}
                title={ref.name}>
                {ref.logoUrl ? (
                  <img
                    src={ref.logoUrl}
                    alt={ref.name}
                    className="max-h-10 max-w-full object-contain transition-all duration-300"
                    style={{ filter: 'grayscale(100%)', opacity: 0.6 }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'; (e.target as HTMLImageElement).style.opacity = '1' }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.filter = 'grayscale(100%)'; (e.target as HTMLImageElement).style.opacity = '0.6' }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-[14px] font-bold transition-transform group-hover:scale-110"
                    style={{ background: ref.color }}>
                    {ref.abbr || ref.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Alt CTA */}
        <div className="mt-10 pt-8 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)', fontFamily: 'Georgia, serif' }}>
            Siz de bu markalar arasında yer alın
          </p>
          <a href="/siparis"
            className="flex items-center gap-2 text-[13px] font-bold text-[#F4821F] hover:gap-3 transition-all duration-200">
            Teklif al <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}