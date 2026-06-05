'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api, { productApi } from '@/lib/api'
import { Calculator, ChevronDown, ArrowRight, Loader2 } from 'lucide-react'

interface AreaProduct {
  id: string
  name: string
  slug: string
  pricingModel: string
  unit: string
  basePrice?: number       // USD
}

export default function HesaplamaSection() {
  const router = useRouter()
  const [kur, setKur] = useState(45)
  const [products, setProducts] = useState<AreaProduct[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState('')
  const [yukseklik, setYukseklik] = useState('')
  const [genislik, setGenislik] = useState('')
  const [adet, setAdet] = useState('1')
  const [ekUcret, setEkUcret] = useState('0')
  const [calcLoading, setCalcLoading] = useState(false)
  const [sonuc, setSonuc] = useState<{ m2: number; usd: number; tl: number; breakdown: string } | null>(null)

  // Kuru ve AREA_BASED ürünleri yükle
  useEffect(() => {
    api.get('/api/settings/public')
      .then(r => setKur(parseFloat(r.data.data?.usd_kur || '45')))
      .catch(() => {})

    productApi.list()
      .then(r => {
        const all: AreaProduct[] = r.data.data || []
        // Hesaplama bölümü m² bazlı ürünler için anlamlı
        const areaProducts = all.filter(p => p.pricingModel === 'AREA_BASED')
        setProducts(areaProducts)
        if (areaProducts.length > 0) setSelectedSlug(areaProducts[0].slug)
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false))
  }, [])

  const selectedProduct = products.find(p => p.slug === selectedSlug)

  const hesapla = async () => {
    const h = parseFloat(yukseklik)
    const w = parseFloat(genislik)
    const a = parseInt(adet) || 1
    const ek = parseFloat(ekUcret) || 0
    if (!h || !w || !selectedSlug) return

    setCalcLoading(true)
    try {
      const res = await productApi.calculatePrice({
        productSlug: selectedSlug,
        widthCm: Math.round(w * 100),
        heightCm: Math.round(h * 100),
        quantity: a,
      })
      const data = res.data.data
      const tlBase = Number(data.totalPrice)
      const tlFinal = tlBase + ek
      const usd = tlBase / (kur || 1)
      const m2 = Number(data.areaMq ?? (h * w * a))

      setSonuc({
        m2: Math.round(m2 * 100) / 100,
        usd: Math.round(usd * 100) / 100,
        tl: Math.round(tlFinal),
        breakdown: data.priceBreakdown || '',
      })
    } catch {
      setSonuc(null)
    } finally {
      setCalcLoading(false)
    }
  }

  const siparisVer = () => {
    if (!selectedSlug) return
    const params = new URLSearchParams()
    params.set('urun', selectedSlug)
    if (yukseklik) params.set('boy', String(Math.round(parseFloat(yukseklik) * 100)))
    if (genislik)  params.set('en',  String(Math.round(parseFloat(genislik)  * 100)))
    if (adet)      params.set('adet', adet)
    router.push(`/siparis?${params.toString()}`)
  }

  // Hiç AREA_BASED ürün yoksa bölümü gösterme
  if (!productsLoading && products.length === 0) {
    return null
  }

  return (
    <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Fiyat Hesaplama</p>
            <h2 className="text-[32px] font-bold tracking-[-1px]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Anlık fiyat hesaplayın
            </h2>
            <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              Ürününüzü ve ölçülerinizi girin, anlık fiyatı görün
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-[11px] font-bold uppercase tracking-[1px]"
              style={{ color: 'var(--text-muted)' }}>USD Kur</span>
            <span className="text-[14px] font-bold text-[#F4821F]">{kur.toFixed(2)} ₺</span>
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Ürün seçimi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Baskı Tipi</label>
              <div className="relative">
                <select value={selectedSlug}
                  onChange={e => { setSelectedSlug(e.target.value); setSonuc(null) }}
                  disabled={productsLoading}
                  className="w-full px-4 py-3 rounded-xl text-[13px] font-semibold outline-none appearance-none cursor-pointer disabled:opacity-50"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  {productsLoading
                    ? <option>Yükleniyor...</option>
                    : products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div className="flex items-end">
              <div className="px-4 py-3 rounded-xl w-full"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span className="text-[10px] uppercase tracking-[1px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  Birim Fiyat
                </span>
                <p className="text-[16px] font-bold text-[#F4821F] mt-0.5">
                  {selectedProduct?.basePrice
                    ? `$${Number(selectedProduct.basePrice).toFixed(2)} / m²`
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Ölçüler */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Yükseklik (m)', val: yukseklik, set: setYukseklik, placeholder: '2.00' },
              { label: 'Genişlik (m)',  val: genislik,  set: setGenislik,  placeholder: '3.00' },
              { label: 'Adet',          val: adet,      set: setAdet,      placeholder: '1'    },
              { label: 'Ek Ücret (₺)', val: ekUcret,   set: setEkUcret,   placeholder: '0'    },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                  style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                <input type="number" value={f.val} onChange={e => { f.set(e.target.value); setSonuc(null) }}
                  placeholder={f.placeholder} min="0" step="0.01"
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Toplam (m²)</label>
              <div className="px-4 py-3 rounded-xl text-[13px] font-semibold"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {sonuc ? sonuc.m2 : '—'}
              </div>
            </div>
          </div>

          {/* Hesapla + Sonuç */}
          <div className="flex items-center gap-6 flex-wrap">
            <button onClick={hesapla} disabled={calcLoading || !selectedSlug}
              className="flex items-center gap-2 bg-[#F4821F] text-white text-[14px] font-bold px-10 py-4 rounded-xl hover:bg-[#e07010] transition-colors shadow-sm disabled:opacity-50">
              {calcLoading ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
              {calcLoading ? 'HESAPLANIYOR...' : 'HESAPLA'}
            </button>

            {sonuc && (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="px-5 py-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold" style={{ color: 'var(--text-muted)' }}>Toplam m²</p>
                  <p className="text-[22px] font-bold mt-1" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                    {sonuc.m2} m²
                  </p>
                </div>
                <div className="px-5 py-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold" style={{ color: 'var(--text-muted)' }}>Toplam (USD)</p>
                  <p className="text-[22px] font-bold mt-1" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                    ${sonuc.usd}
                  </p>
                </div>
                <div className="px-5 py-4 rounded-xl border-2 border-[#F4821F]/40"
                  style={{ background: 'rgba(244,130,31,0.06)' }}>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold text-[#F4821F]">Toplam (₺)</p>
                  <p className="text-[28px] font-bold mt-1 text-[#F4821F]" style={{ fontFamily: 'Georgia, serif' }}>
                    ₺{sonuc.tl.toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {sonuc?.breakdown && (
            <p className="text-[11px] mt-3" style={{ color: 'var(--text-muted)' }}>
              {sonuc.breakdown}
            </p>
          )}

          {/* Sipariş ver butonu */}
          {sonuc && (
            <div className="mt-5 flex items-center gap-4 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex-1">
                <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  Bu fiyatla sipariş vermek ister misiniz?
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Seçtiğiniz ürün ve ölçüler otomatik aktarılır.
                </p>
              </div>
              <button onClick={siparisVer}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[13px] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Sipariş ver
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
            * Fiyatlar KDV hariçtir. Kesin fiyat teklifi için sipariş oluşturun.
          </p>
        </div>
      </div>
    </section>
  )
}