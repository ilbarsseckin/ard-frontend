'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { productApi } from '@/lib/api'

interface Product {
  id: string; name: string; slug: string; pricingModel: string
  unit: string; hasFile: boolean; minOrder: number; description: string
  imageUrl?: string
}

const SLUG_KATEGORI: Record<string, string> = {
  'buyuk-format': 'Büyük Format',
  'kartvizit': 'Kartvizit',
  'sticker': 'Sticker',
  'tabela': 'Tabela',
  'brosur': 'Broşür',
  'promosyon': 'Promosyon',
}

function kategoriFromSlug(slug: string): string {
  for (const [prefix, label] of Object.entries(SLUG_KATEGORI)) {
    if (slug.startsWith(prefix)) return label
  }
  return 'Diğer'
}

function birimEtiket(unit: string, pricingModel: string) {
  if (unit === 'm2') return 'm² bazlı'
  if (pricingModel === 'PACKAGE') return 'Paket fiyatı'
  if (pricingModel === 'TIERED_QUANTITY') return 'Adet kademeli'
  return 'Adet bazlı'
}

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [aktifKat, setAktifKat] = useState('Tümü')

  useEffect(() => {
    productApi.list()
      .then(r => setProducts(r.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const kategoriler = ['Tümü', ...Array.from(
    new Set(products.map(p => kategoriFromSlug(p.slug)))
  ).sort()]

  const filtered = products.filter(p => {
    const katMatch = aktifKat === 'Tümü' || kategoriFromSlug(p.slug) === aktifKat
    const searchMatch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    return katMatch && searchMatch
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="mb-8">
            <h1 className="text-[28px] font-medium tracking-[-0.6px] text-gray-900 dark:text-gray-100 mb-1">
              Ürün kataloğu
            </h1>
            <p className="text-[14px] text-gray-400">
              Ürünü seç, anlık fiyat hesapla, sipariş ver
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#141414] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors w-[220px]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {kategoriler.map(k => (
                <button
                  key={k}
                  onClick={() => setAktifKat(k)}
                  className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
                    aktifKat === k
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent'
                      : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-[14px]">
              {search ? `"${search}" için ürün bulunamadı` : 'Bu kategoride ürün yok'}
            </div>
          ) : aktifKat === 'Tümü' ? (
            Object.entries(SLUG_KATEGORI).map(([prefix, label]) => {
              const grup = filtered.filter(p => kategoriFromSlug(p.slug) === label)
              if (grup.length === 0) return null
              return (
                <div key={prefix} className="mb-10">
                  <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-[1.5px] mb-3">
                    {label}
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {grup.map(p => <UrunKart key={p.id} p={p} />)}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map(p => <UrunKart key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function UrunKart({ p }: { p: Product }) {
  return (
    <Link
      href={`/siparis?urun=${p.slug}`}
      className="group bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden block hover:border-[#F4821F]/40 hover:shadow-sm transition-all"
    >
      <div className="h-36 overflow-hidden bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center">
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => (e.currentTarget.style.display = 'none')} />
          : <span className="text-[48px]">
              {kategoriFromSlug(p.slug) === 'Büyük Format' ? '🖼️'
               : kategoriFromSlug(p.slug) === 'Kartvizit' ? '🪪'
               : kategoriFromSlug(p.slug) === 'Sticker' ? '🏷️'
               : kategoriFromSlug(p.slug) === 'Tabela' ? '🪧'
               : kategoriFromSlug(p.slug) === 'Broşür' ? '📄'
               : '🎁'}
            </span>
        }
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-[#F4821F]">
            {birimEtiket(p.unit, p.pricingModel)}
          </span>
        </div>
        <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-1.5">
          {p.name}
        </div>
        <div className="text-[12px] text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {p.description}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Min. {p.minOrder} {p.unit}
          </span>
          <ArrowRight size={13} className="text-gray-300 group-hover:text-[#F4821F] transition-colors" />
        </div>
      </div>
    </Link>
  )
}