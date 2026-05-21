'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { productApi } from '@/lib/api'

// Her ürün tipi için sabit bilgiler
const URUN_META: Record<string, {
  fiyat: string; adet: string; puan: number; yorumSayisi: number; gorsel: string
}> = {
  'kartvizit': {
    fiyat: '180,00 TL', adet: '250 adet', puan: 4.8, yorumSayisi: 1321,
    gorsel: '🪪',
  },
  'buyuk-format': {
    fiyat: '185,00 TL', adet: 'm² bazlı', puan: 4.9, yorumSayisi: 843,
    gorsel: '🖼️',
  },
  'sticker': {
    fiyat: '8,00 TL', adet: '10 adetten', puan: 4.7, yorumSayisi: 512,
    gorsel: '🏷️',
  },
  'tabela': {
    fiyat: '120,00 TL', adet: 'm² bazlı', puan: 4.6, yorumSayisi: 234,
    gorsel: '🪧',
  },
  'brosur': {
    fiyat: '95,00 TL', adet: '100 adetten', puan: 4.7, yorumSayisi: 389,
    gorsel: '📄',
  },
  'promosyon': {
    fiyat: '35,00 TL', adet: 'Adet bazlı', puan: 4.5, yorumSayisi: 178,
    gorsel: '🎁',
  },
}

function kategoriSlugundan(slug: string) {
  for (const key of Object.keys(URUN_META)) {
    if (slug.startsWith(key)) return key
  }
  return null
}

function YildizPuan({ puan }: { puan: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.floor(puan) ? 'text-yellow-400 fill-yellow-400' : i - 0.5 <= puan ? 'text-yellow-400 fill-yellow-200' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

export default function OncCikanUrunler() {
  const [products, setProducts] = useState<any[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    productApi.list().then(r => {
      const all = r.data.data || []
      // Her kategoriden ilk ürünü al
      const seen = new Set<string>()
      const oneCikan = all.filter((p: any) => {
        const kat = kategoriSlugundan(p.slug)
        if (!kat || seen.has(kat)) return false
        seen.add(kat)
        return true
      })
      setProducts(oneCikan)
    }).catch(() => {})
  }, [])

  const visible = 4
  const canPrev = offset > 0
  const canNext = offset + visible < products.length

  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
          Öne Çıkan Ürünler
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/urunler" className="text-[12px] text-[#F4821F] font-medium flex items-center gap-1 hover:underline">
            Tümünü Gör <ArrowRight size={13} />
          </Link>
          <div className="flex gap-1">
            <button
              onClick={() => setOffset(o => Math.max(0, o - 1))}
              disabled={!canPrev}
              className="w-7 h-7 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setOffset(o => canNext ? o + 1 : o)}
              disabled={!canNext}
              className="w-7 h-7 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {products.slice(offset, offset + visible).map(p => {
          const kat = kategoriSlugundan(p.slug)
          const meta = kat ? URUN_META[kat] : null
          return (
            <Link
              key={p.id}
              href={`/siparis?urun=${p.slug}`}
              className="group bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden hover:shadow-md hover:border-[#F4821F]/30 transition-all"
            >
              {/* Ürün görseli alanı */}
              <div className="h-44 flex items-center justify-center bg-gray-50 dark:bg-white/[0.03] text-[64px] group-hover:scale-105 transition-transform duration-300">
                {meta?.gorsel || '📦'}
              </div>

              {/* Bilgiler */}
              <div className="p-4">
                <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-0.5 line-clamp-1">
                  {p.name}
                </p>
                <p className="text-[12px] text-gray-400 mb-2">
                  {meta?.adet || `Min. ${p.minOrder} ${p.unit}`}
                </p>

                {meta && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <YildizPuan puan={meta.puan} />
                    <span className="text-[11px] text-gray-400">({meta.yorumSayisi.toLocaleString('tr-TR')})</span>
                  </div>
                )}

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
                      {meta?.fiyat || '—'}
                    </p>
                    <p className="text-[10px] text-gray-400">+KDV</p>
                  </div>
                  <span className="text-[11px] text-[#F4821F] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    İncele →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}

        {/* Skeleton yüklenirken */}
        {products.length === 0 && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden animate-pulse">
            <div className="h-44 bg-gray-100 dark:bg-white/[0.05]" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 dark:bg-white/[0.05] rounded w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-white/[0.05] rounded w-1/2" />
              <div className="h-4 bg-gray-100 dark:bg-white/[0.05] rounded w-1/3 mt-3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}