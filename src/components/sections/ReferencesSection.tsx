'use client'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import api from '@/lib/api'

const CATEGORIES = ['Tümü', 'Zincir Market', 'İçecek & FMCG', 'Restoran', 'Otel & Turizm', 'Etkinlik & Fuar', 'Diğer']

interface Reference {
  id: string; name: string; sector: string; category: string
  description?: string; logoUrl?: string; color: string
  abbr?: string; featured: boolean; active: boolean
  showText?: boolean
}

function LogoOrAvatar({ item: r, size, mode = 'square' }: {
  item: Reference; size: number; mode?: 'square' | 'horizontal'
}) {
  const [imgError, setImgError] = useState(false)

  if (r.logoUrl && !imgError) {
    if (mode === 'horizontal') {
      // Kayan şerit — yükseklik sabit, genişlik logonun oranına göre
      return (
        <img src={r.logoUrl} alt={r.name}
          className="object-contain"
          style={{ height: size, maxWidth: size * 3, width: 'auto' }}
          onError={() => setImgError(true)} />
      )
    }
    // Kare grid hücresi
    return (
      <img src={r.logoUrl} alt={r.name}
        className="object-contain"
        style={{ maxWidth: size, maxHeight: size }}
        onError={() => setImgError(true)} />
    )
  }

  // Logo yok / yüklenemedi → renkli avatar
  return (
    <div className="rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0"
      style={{
        width: size, height: size,
        background: r.color || '#F4821F',
        fontSize: size * 0.32,
      }}>
      {r.abbr || r.name.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function ReferencesSection() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('Tümü')

  useEffect(() => {
    api.get('/api/references')
      .then(r => setReferences(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featured = references.filter(r => r.featured && r.active)
  const filtered = (active === 'Tümü' ? references : references.filter(r => r.category === active))
    .filter(r => r.active)

  // Az sayıda featured varsa daha çok tekrarla — sürekli akış için
  const repeats = featured.length === 0 ? 0 : Math.max(2, Math.ceil(10 / featured.length))
  const marqueeList: Reference[] = featured.length === 0
    ? []
    : Array.from({ length: repeats }, () => featured).flat()

  return (
    <section id="referanslar" className="py-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <div>
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Referanslar</p>
            <h2 className="text-[32px] font-bold tracking-[-1px]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Türkiye'nin önde gelen<br />
              <span className="text-[#F4821F]">markalarıyla</span> çalışıyoruz
            </h2>
          </div>
          <p className="text-[13px] max-w-[220px] text-right"
            style={{ color: 'var(--text-muted)', fontFamily: 'Georgia, serif' }}>
            {references.length}+ kurumsal müşteri,<br />binlerce başarılı proje
          </p>
        </div>

        {/* ÜST — Kayan öne çıkan şerit */}
        {marqueeList.length > 0 && (
          <div className="relative mb-14 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, var(--bg-card) 0%, var(--bg-secondary) 50%, var(--bg-card) 100%)',
              border: '1px solid var(--border)',
            }}>
            <div className="absolute top-0 left-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, var(--bg-card), transparent)' }} />
            <div className="absolute top-0 right-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, var(--bg-card), transparent)' }} />

            <div className="marquee-track flex items-center gap-12 py-6 px-8">
              {marqueeList.map((r, i) => (
                <div key={`${r.id}-${i}`} className="flex items-center gap-5 flex-shrink-0">
                  <div className="flex items-center justify-center"
                    style={{ minWidth: 140, height: 64 }}>
                    <LogoOrAvatar item={r} size={64} mode="horizontal" />
                  </div>
                  {r.showText !== false && (
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold whitespace-nowrap"
                        style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                      <p className="text-[11px] whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}>{r.sector}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kategori filtresi */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.filter(c => c === 'Tümü' || references.some(r => r.category === c && r.active)).map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="text-[12px] px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              style={active === cat
                ? { background: '#F4821F', color: 'white', border: '1px solid #F4821F' }
                : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* ALT — Kurumsal grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl h-40 animate-pulse" style={{ background: 'var(--bg-card)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filtered.map(r => (
              <div key={r.id}
                className="group rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  minHeight: '180px',
                }}
                title={r.name}>

                <div className="mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{ height: 110 }}>
                  <LogoOrAvatar item={r} size={110} />
                </div>

                {r.showText !== false && (
                  <>
                    <p className="text-[14px] font-bold mb-1"
                      style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                      {r.name}
                    </p>
                    <p className="text-[11px] uppercase tracking-[1px] font-bold"
                      style={{ color: 'var(--text-muted)' }}>
                      {r.sector}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            Bu kategoride referans bulunamadı
          </div>
        )}

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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