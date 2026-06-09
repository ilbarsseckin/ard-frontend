'use client'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import api from '@/lib/api'

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
    return (
      <img src={r.logoUrl} alt={r.name}
        className="object-contain"
        style={mode === 'horizontal'
          ? { height: size, maxWidth: size * 3, width: 'auto' }
          : { maxWidth: size, maxHeight: size }}
        onError={() => setImgError(true)} />
    )
  }

  return (
    <div className="rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0"
      style={{ width: size, height: size, background: r.color || '#F4821F', fontSize: size * 0.32 }}>
      {r.abbr || r.name.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function ReferencesSection() {
  const [references, setReferences] = useState<Reference[]>([])

  useEffect(() => {
    api.get('/api/references')
      .then(r => setReferences(r.data.data || []))
      .catch(() => {})
  }, [])

  const active = references.filter(r => r.active)
  const featured = active.filter(r => r.featured)
  const marqueeSource = featured.length > 0 ? featured : active

  const repeats = marqueeSource.length === 0 ? 0 : Math.max(3, Math.ceil(15 / marqueeSource.length))
  const marqueeList: Reference[] = marqueeSource.length === 0
    ? []
    : Array.from({ length: repeats }, () => marqueeSource).flat()

  if (marqueeList.length === 0) return null

  return (
    <section id="referanslar" className="py-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <p className="text-[13px] max-w-[220px] text-right"
            style={{ color: 'var(--text-muted)', fontFamily: 'Georgia, serif' }}>
            {active.length}+ kurumsal müşteri,<br />binlerce başarılı proje
          </p>
        </div>

        {/* Kayan şerit */}
        <div className="relative rounded-2xl overflow-hidden"
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
              <div key={`${r.id}-${i}`} className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center justify-center" style={{ minWidth: 56, height: 56 }}>
                  <LogoOrAvatar item={r} size={56} mode="horizontal" />
                </div>
                {r.showText !== false && (
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                      {r.name}
                    </p>
                    <p className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {r.sector}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alt link */}
        <div className="mt-8 flex justify-end">
          <a href="/iletisim"
            className="flex items-center gap-2 text-[13px] font-bold text-[#F4821F] hover:gap-3 transition-all duration-200">
            Siz de referanslarımız arasına katılın <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}