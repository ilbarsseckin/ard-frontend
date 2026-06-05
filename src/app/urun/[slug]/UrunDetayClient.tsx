'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/cart'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  ChevronLeft, Package, Loader2, Check, ShoppingCart,
  Phone, ChevronDown, Star, Truck, Shield, Lock, Info,
} from 'lucide-react'
import FavoriteButton from '@/components/ui/FavoriteButton'
import MobileBottomBar from '@/components/ui/MobileBottomBar'
import ImageLightbox from '@/components/ui/ImageLightbox'
import ProductReviews from '@/components/ui/ProductReviews'
import TaksitTablosu from '@/components/ui/TaksitTablosu'
import ProductImageGallery from '@/components/ui/ProductImageGallery'
import DesignUploader, { DesignSelection } from '@/components/ui/DesignUploader'
import UrunHakkinda from '@/components/product/UrunHakkinda'
import { useRecentView } from '@/hooks/useRecentView'

interface AttrOption {
  id: string; value: string; colorHex?: string; priceModifier?: number
}
interface AttributeBlock {
  attributeId: string; attrKey: string; label: string
  inputType: string; required: boolean; sortOrder: number
  selectedOptions: AttrOption[]
}
interface Tier { id: string; qty: number; priceUsd: number; sortOrder: number }
interface ProductImage { id: string; url: string; altText?: string; sortOrder: number }
interface Product {
  id: string; slug: string; name: string; shortDesc?: string; longDesc?: string
  categoryId: string; categorySlug: string; categoryName: string
  brandId?: string; brandName?: string; brandLogoUrl?: string
  attributes: AttributeBlock[]; tiers: Tier[]; images: ProductImage[]
  featured?: boolean; badge?: string; originalPrice?: number
}
interface Settings { usd_kur?: string; contact_phone?: string; contact_whatsapp?: string }

const KDV_RATE = 1.20  // ✅ Sabit, her zaman dahil

function calculateDeliveryDate(): string {
  const date = new Date()
  let businessDays = 0
  while (businessDays < 3) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) businessDays++
  }
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
}

export function UrunDetayClient() {
  const addCatalogItem = useCartStore(s => s.addCatalogItem)
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useRecentView(product?.id)

  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({})
  // ❌ KDV toggle kaldırıldı
  const [activeTab, setActiveTab] = useState<'about' | 'notes' | 'returns' | 'reviews'>('about')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [design, setDesign] = useState<DesignSelection>({
    mode: null, files: [], supportNotes: '',
  })

  useEffect(() => {
    Promise.all([
      api.get(`/api/catalog/products/${slug}`),
      api.get('/api/settings/public'),
    ]).then(([prodRes, settRes]) => {
      const p: Product = prodRes.data.data
      setProduct(p)
      setSettings(settRes.data.data || {})
      if (p.tiers && p.tiers.length > 0) setSelectedTierId(p.tiers[0].id)
      const initialAttrs: Record<string, string> = {}
      for (const attr of (p.attributes || [])) {
        if (attr.selectedOptions?.length === 1) {
          initialAttrs[attr.attributeId] = attr.selectedOptions[0].id
        }
      }
      setSelectedAttrs(initialAttrs)
    }).catch(err => {
      if (err.response?.status === 404) setNotFound(true)
      else toast.error('Ürün yüklenemedi')
    }).finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={32} className="animate-spin text-[#F4821F]" />
        </main>
      </>
    )
  }

  if (notFound || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-secondary)' }}>
          <div className="text-center">
            <Package size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <h1 className="text-[24px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Ürün bulunamadı</h1>
            <Link href="/urunler"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors">
              <ChevronLeft size={14} /> Ürünlere dön
            </Link>
          </div>
        </main>
      </>
    )
  }

  const kur = parseFloat(settings.usd_kur || '45')
  const selectedTier = product.tiers.find(t => t.id === selectedTierId)

  const modifierProduct = Object.entries(selectedAttrs).reduce((acc, [attrId, optId]) => {
    const attr = product.attributes.find(a => a.attributeId === attrId)
    const opt = attr?.selectedOptions.find(o => o.id === optId)
    return acc * Number(opt?.priceModifier ?? 1.0)
  }, 1)

  // ✅ FROZEN PRICE HESAPLAMA — her zaman KDV dahil
  const baseUsd = selectedTier ? Number(selectedTier.priceUsd) * modifierProduct : 0
  const baseTl = baseUsd * kur
  const totalTl = baseTl * KDV_RATE  // ← KDV dahil tek değer

  const hasOriginal = product.originalPrice && (selectedTier?.priceUsd || 0) > 0
    && Number(product.originalPrice) > Number(selectedTier?.priceUsd)
  const originalTl = product.originalPrice
    ? Number(product.originalPrice) * kur * KDV_RATE
    : 0
  const deliveryStr = calculateDeliveryDate()

  const requiredAttrs = product.attributes.filter(a =>
    a.required && a.inputType !== 'text' && (a.selectedOptions?.length || 0) > 0)
  const missingRequired = requiredAttrs.filter(a => !selectedAttrs[a.attributeId])

  const designValid =
    design.mode === 'upload' ? design.files.length > 0 :
    design.mode === 'support' ? design.supportNotes.trim().length > 0 :
    false

  const canOrder = !!selectedTier && missingRequired.length === 0 && designValid

  const handleOrder = () => {
    if (!product || !selectedTier) {
      toast.error('Lütfen adet seçin')
      return
    }
    if (missingRequired.length > 0) {
      toast.error(`Lütfen seçin: ${missingRequired.map(a => a.label).join(', ')}`)
      return
    }
    if (!design.mode) {
      toast.error('Tasarım seçeneği belirleyin')
      return
    }
    if (design.mode === 'upload' && design.files.length === 0) {
      toast.error('En az bir tasarım dosyası yükleyin')
      return
    }
    if (design.mode === 'support' && !design.supportNotes.trim()) {
      toast.error('Tasarım notlarınızı yazın')
      return
    }

    const attributes = Object.entries(selectedAttrs).map(([attrId, optId]) => {
      const attr = product.attributes.find(a => a.attributeId === attrId)
      const opt = attr?.selectedOptions.find(o => o.id === optId)
      return {
        attributeId: attrId, attrKey: attr?.attrKey || '', label: attr?.label || '',
        optionId: optId, optionValue: opt?.value || '',
      }
    })

    // ✅ FROZEN PRICE — sepete eklendiği anda final fiyat sabitleniyor
    addCatalogItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      mainImageUrl: product.images?.[0]?.url,
      categoryName: product.categoryName,
      categorySlug: product.categorySlug,
      tierId: selectedTier.id,
      tierQty: selectedTier.qty,
      priceUsd: baseUsd,      // referans
      priceTl: totalTl,       // ✅ DONMUŞ final fiyat (KDV dahil)
      kurAtAdd: kur,          // transparency
      attributes,
      designFileIds: design.mode === 'upload' ? design.files.map(f => f.id) : [],
      designSupport: design.mode === 'support'
        ? { requested: true, notes: design.supportNotes }
        : undefined,
    })
    toast.success(`Sepete eklendi: ${product.name}`)
    setTimeout(() => router.push('/sepet'), 700)
  }

  // Diğer adet kartları için fiyat (her zaman KDV dahil)
  const calcTierPrice = (tier: Tier) =>
    Number(tier.priceUsd) * modifierProduct * kur * KDV_RATE

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-12" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="text-[12px] mb-5 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline">Ana Sayfa</Link>
            <span>›</span>
            <Link href={`/katalog/${product.categorySlug}`} className="hover:underline">{product.categoryName}</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-5">
              <ProductImageGallery
                images={product.images.map(i => i.url)}
                productName={product.name}
                onZoomClick={() => product.images.length > 0 && setLightboxOpen(true)}
                onIndexChange={setSelectedImageIdx}
                overlays={
                  <>
                    {product.badge && (
                      <span data-overlay-no-drag className="absolute top-4 left-4 text-[11px] font-black px-2.5 py-1.5 rounded text-white"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #ec4899)', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
                        ⚡ {product.badge}
                      </span>
                    )}
                    {product.featured && !product.badge && (
                      <span data-overlay-no-drag className="absolute top-4 left-4 w-9 h-9 rounded-full bg-[#F4821F] flex items-center justify-center shadow-md">
                        <Star size={14} className="text-white fill-white" />
                      </span>
                    )}
                    <div data-overlay-no-drag className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                      <FavoriteButton productId={product.id} productName={product.name} size="lg" />
                    </div>
                  </>
                }
              />
            </div>

            <div className="lg:col-span-4">
              {product.brandName && (
                <div className="flex items-center gap-2 mb-3">
                  {product.brandLogoUrl && (
                    <img src={product.brandLogoUrl} alt={product.brandName}
                      className="w-7 h-7 object-contain rounded-lg"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                      onError={e => (e.currentTarget.style.display = 'none')} />
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-[2px]"
                    style={{ color: 'var(--text-muted)' }}>{product.brandName}</span>
                </div>
              )}

              <h1 className="text-[22px] md:text-[26px] font-black tracking-[-0.5px] mb-2 leading-tight"
                style={{ color: 'var(--text-primary)' }}>
                {product.name}
              </h1>

              {product.shortDesc && (
                <p className="text-[13px] mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {product.shortDesc}
                </p>
              )}

              <div className="space-y-3">
                {product.attributes
                  .filter(attr => attr.inputType !== 'text' && (attr.selectedOptions?.length || 0) > 0)
                  .map(attr => {
                    const isSelected = !!selectedAttrs[attr.attributeId]
                    return (
                    <div key={attr.attributeId}>
                      <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1.5"
                        style={{ color: 'var(--text-secondary)' }}>
                        {attr.label}
                        {attr.required && <span style={{ color: '#EF4444' }}>*</span>}
                        <Info size={11} className="opacity-50 cursor-help"
                          title={`${attr.label} seçiminiz fiyatı etkileyebilir`} />
                      </label>
                      <div className="relative">
                        <select value={selectedAttrs[attr.attributeId] || ''}
                          onChange={e => setSelectedAttrs(prev => ({ ...prev, [attr.attributeId]: e.target.value }))}
                          className="w-full pl-3.5 pr-10 py-3 text-[14px] rounded-lg outline-none appearance-none cursor-pointer transition-all font-medium"
                          style={{
                            background: 'var(--bg-card)',
                            border: isSelected ? '1.5px solid #F4821F' : '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            boxShadow: isSelected ? '0 1px 3px rgba(244,130,31,0.1)' : 'none',
                          }}>
                          <option value="">{attr.label} seçiniz</option>
                          {attr.selectedOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.value}</option>
                          ))}
                        </select>
                        {isSelected ? (
                          <Lock size={13}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: '#F4821F' }} />
                        ) : (
                          <ChevronDown size={15}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                    </div>
                  )})}

                {product.tiers.length > 0 && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1.5"
                      style={{ color: 'var(--text-secondary)' }}>
                      Adet <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div className="relative">
                      <select value={selectedTierId || ''}
                        onChange={e => setSelectedTierId(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-3 text-[14px] rounded-lg outline-none appearance-none cursor-pointer transition-all font-medium"
                        style={{
                          background: 'var(--bg-card)',
                          border: selectedTierId ? '1.5px solid #F4821F' : '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          boxShadow: selectedTierId ? '0 1px 3px rgba(244,130,31,0.1)' : 'none',
                        }}>
                        {product.tiers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.qty.toLocaleString('tr-TR')} adet
                          </option>
                        ))}
                      </select>
                      {selectedTierId ? (
                        <Lock size={13}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: '#F4821F' }} />
                      ) : (
                        <ChevronDown size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Seçili adet kutusu — sadece KDV dahil */}
              {selectedTier && (
                <div className="mt-5 p-4 rounded-xl flex items-center justify-between"
                  style={{
                    background: 'linear-gradient(135deg, rgba(244,130,31,0.08), rgba(244,130,31,0.15))',
                    border: '1px solid rgba(244,130,31,0.2)'
                  }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[1px]" style={{ color: '#F4821F' }}>
                      Adet Seçimi
                    </p>
                    <p className="text-[20px] font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {selectedTier.qty.toLocaleString('tr-TR')}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Adet</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[20px] font-black tracking-[-0.5px] text-[#F4821F]">
                      ₺{totalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      KDV Dahil
                    </p>
                  </div>
                </div>
              )}

              {/* ✅ KDV toggle KALDIRILDI */}

              <div className="mt-5">
                <DesignUploader value={design} onChange={setDesign} />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-3">

                <div className="rounded-2xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] mb-1"
                    style={{ color: 'var(--text-muted)' }}>
                    Toplam Fiyat
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    KDV Dahil
                  </p>

                  <div className="my-3">
                    {hasOriginal && (
                      <p className="text-[14px] line-through" style={{ color: 'var(--text-muted)' }}>
                        ₺{originalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                      </p>
                    )}
                    <p className={`text-[28px] font-black tracking-[-1px] leading-tight ${hasOriginal ? 'text-red-500' : ''}`}
                      style={!hasOriginal ? { color: '#F4821F' } : {}}>
                      ₺{totalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <button onClick={handleOrder} disabled={!canOrder}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-bold text-white rounded-xl transition-all disabled:opacity-50"
                    style={{
                      background: canOrder ? 'linear-gradient(135deg, #F4821F, #e07010)' : '#9CA3AF',
                      boxShadow: canOrder ? '0 6px 14px rgba(244,130,31,0.3)' : 'none',
                    }}>
                    <ShoppingCart size={14} />
                    Hemen Al
                  </button>

                  {!canOrder && (
                    <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
                      {!selectedTier ? 'Adet seçin' :
                       missingRequired.length > 0 ? 'Tüm seçenekleri belirleyin' :
                       !design.mode ? 'Tasarım seçeneği belirleyin' :
                       design.mode === 'upload' && design.files.length === 0 ? 'Tasarım dosyası yükleyin' :
                       design.mode === 'support' && !design.supportNotes.trim() ? 'Tasarım notları yazın' :
                       ''}
                    </p>
                  )}

                  <div className="mt-3 p-3 rounded-lg flex items-start gap-2"
                    style={{ background: 'rgba(244,130,31,0.08)' }}>
                    <Truck size={14} className="flex-shrink-0 mt-0.5 text-[#F4821F]" />
                    <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      Şimdi sipariş verirsen,<br />
                      <strong style={{ color: 'var(--text-primary)' }}>{deliveryStr}</strong> kargoda.
                    </p>
                  </div>
                </div>

                {settings.contact_phone && (
                  <a href={`tel:${settings.contact_phone}`}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] font-bold rounded-xl transition-colors"
                    style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    <Phone size={13} />
                    {settings.contact_phone}
                  </a>
                )}

                <div className="rounded-xl p-3 space-y-2"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <Shield size={12} className="text-green-600 flex-shrink-0" />
                    <span>256-bit SSL şifrelemeli güvenli ödeme</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <Truck size={12} className="text-green-600 flex-shrink-0" />
                    <span>Türkiye'nin her yerine hızlı teslimat</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={12} className="text-green-600 flex-shrink-0" />
                    <span>Memnuniyet garantisi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.tiers.length > 1 && (
            <section className="mt-10">
              <h2 className="text-[16px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Ürünün Diğer Adetleri
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {product.tiers.map(t => {
                  const isSelected = selectedTierId === t.id
                  const price = calcTierPrice(t)
                  return (
                    <button key={t.id} onClick={() => setSelectedTierId(t.id)}
                      className="text-left rounded-xl overflow-hidden transition-all hover:shadow-md"
                      style={{
                        background: 'var(--bg-card)',
                        border: isSelected ? '2px solid #F4821F' : '1px solid var(--border)',
                      }}>
                      <div className="aspect-square overflow-hidden relative"
                        style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
                        {product.images[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name}
                            className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package size={32} className="opacity-30" />
                          </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                          style={{ background: '#F4821F' }}>
                          {t.qty} ADET
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {product.name}
                        </p>
                        <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>
                          {t.qty.toLocaleString('tr-TR')} Adet
                        </p>
                        <p className="text-[14px] font-black text-[#F4821F]">
                          ₺{price.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                          <span className="text-[9px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>KDV Dahil</span>
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section className="mt-10">
            <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
              {[
                { id: 'about' as const,   label: 'Ürün Hakkında' },
                { id: 'notes' as const,   label: 'Sipariş Notları' },
                { id: 'returns' as const, label: 'Görseller ve İade' },
                { id: 'reviews' as const, label: 'Yorumlar' },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="px-5 py-3 text-[13px] font-bold transition-colors -mb-px"
                  style={{
                    color: activeTab === t.id ? '#F4821F' : 'var(--text-muted)',
                    borderBottom: activeTab === t.id ? '2px solid #F4821F' : '2px solid transparent',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="py-6 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'about' && <UrunHakkinda product={product} />}
              {activeTab === 'notes' && (
                <div className="space-y-2">
                  <p>• Tasarımınızı bu sayfadan yükleyin veya tasarım desteği isteyin.</p>
                  <p>• Tasarım onay sürecimiz ortalama 1 iş günüdür.</p>
                  <p>• Onaylı tasarımlar 2-3 iş günü içerisinde üretilir.</p>
                  <p>• Üretim sonrası hızlı kargo ile teslimat yapılır.</p>
                </div>
              )}
              {activeTab === 'returns' && (
                <div className="space-y-2">
                  <p>• Kişiye özel üretilen ürünlerde iade kabul edilmemektedir.</p>
                  <p>• Üretim hatası durumunda yenisi ile değiştirilir.</p>
                  <p>• Kargo hasarı durumunda tutanak tutulmalıdır.</p>
                  <p>• Müşteri memnuniyeti garantisi vardır.</p>
                </div>
              )}
              {activeTab === 'reviews' && <ProductReviews productSlug={product.slug} />}
            </div>
          </section>

          {/* Taksit tablosu — en düşük tier fiyatı ya da seçili fiyat */}
          {(() => {
            const minTierTl = product.tiers.length > 0
              ? Math.round(Math.min(...product.tiers.map(t => Number(t.priceUsd))) * kur * KDV_RATE)
              : 0
            const taksitFiyat = totalTl > 0 ? Math.round(totalTl) : minTierTl
            return taksitFiyat > 0 ? (
              <section className="mt-8">
                <TaksitTablosu fiyat={taksitFiyat} />
              </section>
            ) : null
          })()}

        </div>
      </main>
      <Footer />

      <MobileBottomBar
        price={totalTl}
        kdvDahil={true}
        canOrder={canOrder}
        onOrder={handleOrder}
      />

      {lightboxOpen && product.images.length > 0 && (
        <ImageLightbox
          images={product.images}
          startIdx={selectedImageIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}