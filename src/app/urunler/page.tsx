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
}

const cats = ['Tümü', 'Büyük format', 'Kartvizit', 'Sticker', 'Tabela', 'Broşür', 'Promosyon']

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cat, setCat] = useState('Tümü')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productApi.list().then(r => setProducts(r.data.data || [])).finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    (cat === 'Tümü' || p.name.toLowerCase().includes(cat.toLowerCase())) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-[28px] font-medium tracking-[-0.6px] text-gray-900 dark:text-gray-100 mb-2">Ürün kataloğu</h1>
            <p className="text-[14px] text-gray-400">Ürünü seç, anlık fiyat hesapla, sipariş ver</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-[320px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Ürün ara..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#141414] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${cat === c ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent' : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5 h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map(p => (
                <Link key={p.id} href={`/siparis?urun=${p.slug}`}
                  className="card-hover bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5 block">
                  <div className="mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/10 text-[#F4821F]">
                      {p.unit === 'm2' ? 'm² bazlı' : p.unit === 'paket' ? 'Paket fiyatı' : 'Adet bazlı'}
                    </span>
                  </div>
                  <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-1.5">{p.name}</div>
                  <div className="text-[12px] text-gray-400 leading-relaxed mb-4">{p.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Min. {p.minOrder} {p.unit}</span>
                    <ArrowRight size={13} className="text-[#F4821F]" />
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400 text-[14px]">Ürün bulunamadı</div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
