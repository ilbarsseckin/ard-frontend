'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/cart'
import api, { addressApi, orderApi } from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Trash2, ShoppingCart, MapPin, Plus, AlertTriangle, Loader2, RefreshCw,
  Package, X, Send, Check, Palette, Mail, KeyRound, UserCircle, Edit3, Save,
} from 'lucide-react'

interface Address {
  id: string; title: string; fullName: string
  addressLine: string; district: string; city: string; isDefault: boolean
}
interface AuthUser {
  id: string; email: string; name: string; phone?: string; role: string
}

const EMPTY_FORM = {
  customerName: '', customerPhone: '', customerEmail: '',
  customerAddress: '', city: '', district: '', notes: '',
}

function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('baski-auth')
    if (!raw) return null
    const { state } = JSON.parse(raw)
    return state?.user || null
  } catch { return null }
}

export default function SepetPage() {
  const {
    items, removeItem, subtotal, loading, syncFromBackend,
    catalogItems, removeCatalogItem, clearCatalog, catalogSubtotalTl,
  } = useCartStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddr, setSelectedAddr] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [synced, setSynced] = useState(false)
  const router = useRouter()

  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const isLoggedIn = !!authUser

  const [catalogModalOpen, setCatalogModalOpen] = useState(false)
  const [orderForm, setOrderForm] = useState(EMPTY_FORM)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null)

  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>('')
  const [editMode, setEditMode] = useState(false)
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true)
  const [newAddressTitle, setNewAddressTitle] = useState('')

  const hasSavedAddresses = isLoggedIn && addresses.length > 0
  const showFullAddressForm = !hasSavedAddresses || editMode

  useEffect(() => {
    syncFromBackend().finally(() => setSynced(true))
    setAuthUser(getAuthUser())
  }, [])

  const reloadAddresses = () => {
    addressApi.list()
      .then(r => {
        const addrs = r.data.data || []
        setAddresses(addrs)
        const def = addrs.find((a: Address) => a.isDefault)
        if (def) setSelectedAddr(def.id)
      })
      .catch(() => {})
  }

  useEffect(() => { reloadAddresses() }, [])

  useEffect(() => {
    if (!catalogModalOpen) return
    if (isLoggedIn && authUser) {
      setOrderForm(f => ({
        ...f,
        customerName: f.customerName || authUser.name || '',
        customerEmail: authUser.email,
        customerPhone: f.customerPhone || authUser.phone || '',
      }))
    }
    if (hasSavedAddresses && !selectedSavedAddrId) {
      const def = addresses.find(a => a.isDefault) || addresses[0]
      if (def) applySavedAddress(def)
    }
  }, [catalogModalOpen, isLoggedIn, authUser, hasSavedAddresses])

  const applySavedAddress = (addr: Address) => {
    setSelectedSavedAddrId(addr.id)
    setEditMode(false)
    setOrderForm(f => ({
      ...f,
      customerName: addr.fullName || authUser?.name || f.customerName,
      customerAddress: addr.addressLine,
      city: addr.city,
      district: addr.district,
    }))
  }

  const handleNewAddress = () => {
    setSelectedSavedAddrId('')
    setEditMode(true)
    setSaveAddressToProfile(true)
    setNewAddressTitle('')
    setOrderForm(f => ({ ...f, customerAddress: '', city: '', district: '' }))
  }

  const handleRemoveStatic = async (id: string) => {
    setRemovingId(id)
    try { await removeItem(id); toast.success('Ürün kaldırıldı') }
    catch { toast.error('Kaldırma başarısız') }
    finally { setRemovingId(null) }
  }

  const handleRemoveCatalog = (id: string) => {
    removeCatalogItem(id)
    toast.success('Ürün kaldırıldı')
  }

  const checkout = async () => {
    if (!selectedAddr) { toast.error('Teslimat adresi seçin'); return }
    if (items.length === 0) { toast.error('Sepet boş'); return }
    setCheckoutLoading(true)
    try {
      await syncFromBackend()
      if (useCartStore.getState().items.length === 0) { toast.error('Sepetiniz boş'); return }
      const res = await orderApi.checkout(selectedAddr)
      router.push(`/odeme?siparisId=${res.data.data.orderId}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı')
    } finally { setCheckoutLoading(false) }
  }

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

  const submitCatalogOrder = async () => {
    if (!orderForm.customerName.trim()) { toast.error('Ad soyad zorunlu'); return }
    if (!orderForm.customerPhone.trim()) { toast.error('Telefon zorunlu'); return }
    if (!orderForm.customerAddress.trim()) { toast.error('Adres zorunlu'); return }
    if (!isLoggedIn) {
      if (!orderForm.customerEmail.trim()) { toast.error('Email zorunlu'); return }
      if (!isValidEmail(orderForm.customerEmail)) { toast.error('Geçerli email girin'); return }
    }
    if (catalogItems.length === 0) { toast.error('Sepet boş'); return }

    setOrderSubmitting(true)
    try {
      const orderItems = catalogItems.map(it => ({
        productId: it.productId, tierId: it.tierId,
        priceTl: it.priceTl, priceUsd: it.priceUsd, kurAtAdd: it.kurAtAdd,
        attributes: it.attributes.map(a => ({ attributeId: a.attributeId, optionId: a.optionId })),
        designFileIds: it.designFileIds || [],
        designSupport: it.designSupport,
      }))

      const res = await api.post('/api/catalog/orders', { ...orderForm, items: orderItems })
      const data = res.data.data

      if (isLoggedIn && showFullAddressForm && saveAddressToProfile && orderForm.customerAddress.trim()) {
        try {
          await addressApi.add({
            title: newAddressTitle.trim() || `Adres ${addresses.length + 1}`,
            fullName: orderForm.customerName, phone: orderForm.customerPhone,
            addressLine: orderForm.customerAddress,
            city: orderForm.city || '', district: orderForm.district || '',
            isDefault: addresses.length === 0,
          })
        } catch (e) { console.warn('Adres kaydedilemedi:', e) }
      }

      if (data.guestAccountCreated) {
        toast.success(`Hesabınız oluşturuldu! ${orderForm.customerEmail} adresine giriş bilgileri gönderildi`, { duration: 5000 })
      } else {
        toast.success(`Siparişiniz alındı: ${data.orderNumber}`)
      }

      clearCatalog()
      setCatalogModalOpen(false)
      setOrderForm(EMPTY_FORM)
      setSelectedSavedAddrId('')
      setEditMode(false)
      router.push(`/odeme-katalog?siparisNo=${data.orderNumber}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı')
    } finally { setOrderSubmitting(false) }
  }

  const catalogTotalTl = catalogSubtotalTl()
  const grandTotal = subtotal + catalogTotalTl
  const totalCount = items.length + catalogItems.length

  if (!synced || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <Loader2 size={28} className="animate-spin text-[#F4821F]" />
        </main>
        <Footer />
      </>
    )
  }

  if (totalCount === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-secondary)' }}>
          <div className="text-center">
            <ShoppingCart size={44} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
            <p className="text-[18px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Sepetiniz boş</p>
            <p className="text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>Alışverişe başlamak için ürünleri inceleyin</p>
            <button onClick={() => router.push('/urunler')}
              className="bg-[#F4821F] text-white text-[13px] font-bold px-6 py-3 rounded-xl hover:opacity-90">
              Ürünleri İncele
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[20px] sm:text-[24px] font-black tracking-[-0.5px]"
              style={{ color: 'var(--text-primary)' }}>
              Sepetim
              <span className="ml-2 text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
                ({totalCount} ürün)
              </span>
            </h1>
            <button onClick={() => { syncFromBackend(); toast.success('Sepet güncellendi') }}
              className="flex items-center gap-1.5 text-[12px] transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              <RefreshCw size={13} /> Yenile
            </button>
          </div>

          {/* LAYOUT — mobilde tek kolon, masaüstünde 2/3 + 1/3 */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">

            {/* Sol — ürünler */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

              {/* Statik ürünler */}
              {items.length > 0 && (
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3"
                    style={{ color: 'var(--text-muted)' }}>
                    Sipariş Ürünleri ({items.length})
                  </p>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id}
                        className={`rounded-2xl p-4 transition-opacity ${removingId === item.id ? 'opacity-40' : ''}`}
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                              {item.productName}
                            </p>
                            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {item.priceBreakdown}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <p className="text-[16px] font-black text-[#F4821F]">
                              ₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </p>
                            <button onClick={() => handleRemoveStatic(item.id)}
                              disabled={removingId === item.id}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:text-red-500 disabled:opacity-40"
                              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                              {removingId === item.id
                                ? <Loader2 size={13} className="animate-spin" />
                                : <Trash2 size={13} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Katalog ürünleri */}
              {catalogItems.length > 0 && (
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-3"
                    style={{ color: 'var(--text-muted)' }}>
                    Katalog Ürünleri ({catalogItems.length})
                  </p>
                  <div className="space-y-3">
                    {catalogItems.map(item => {
                      const fileCount = item.designFileIds?.length || 0
                      const hasSupport = item.designSupport?.requested
                      const hasDesign = fileCount > 0 || hasSupport
                      const notesExpanded = expandedNotesId === item.id
                      return (
                        <div key={item.id} className="rounded-2xl p-4"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="flex gap-3">
                            {/* Görsel */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0"
                              style={{ background: 'var(--bg-secondary)' }}>
                              {item.mainImageUrl
                                ? <img src={item.mainImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center">
                                    <Package size={20} style={{ color: 'var(--text-muted)' }} />
                                  </div>}
                            </div>

                            {/* İçerik */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-[13px] sm:text-[14px] font-bold leading-tight"
                                  style={{ color: 'var(--text-primary)' }}>
                                  {item.productName}
                                </p>
                                <button onClick={() => handleRemoveCatalog(item.id)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 hover:text-red-500 transition-colors"
                                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                  <Trash2 size={12} />
                                </button>
                              </div>

                              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {item.categoryName} · {item.tierQty.toLocaleString('tr-TR')} adet
                              </p>

                              {item.attributes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {item.attributes.map(a => (
                                    <span key={a.attributeId}
                                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                                      style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                                      {a.label}: {a.optionValue}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {fileCount > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                                      style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
                                      <Check size={10} /> {fileCount} dosya
                                    </span>
                                  )}
                                  {hasSupport && (
                                    <button onClick={() => setExpandedNotesId(notesExpanded ? null : item.id)}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                                      style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                                      <Palette size={10} /> Tasarım Desteği {notesExpanded ? '▲' : '▼'}
                                    </button>
                                  )}
                                  {!hasDesign && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                                      style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706' }}>
                                      <AlertTriangle size={10} /> Tasarım eksik
                                    </span>
                                  )}
                                </div>
                                <p className="text-[15px] font-black text-[#F4821F] flex-shrink-0">
                                  ₺{Number(item.priceTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                </p>
                              </div>

                              {hasSupport && notesExpanded && (
                                <div className="mt-2 p-2.5 rounded-lg text-[11px] leading-relaxed"
                                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                  {item.designSupport?.notes || '(not yok)'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Sağ — özet + ödeme */}
            <div className="order-1 lg:order-2 space-y-3">

              {/* Teslimat adresi — sadece statik ürünler için */}
              {items.length > 0 && (
                <div className="rounded-2xl p-4"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={14} style={{ color: '#F4821F' }} />
                    <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Teslimat Adresi</p>
                  </div>
                  {addresses.length > 0 ? (
                    <div className="space-y-2">
                      {addresses.map(a => (
                        <label key={a.id}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all"
                          style={{
                            border: selectedAddr === a.id ? '1.5px solid #F4821F' : '1px solid var(--border)',
                            background: selectedAddr === a.id ? 'rgba(244,130,31,0.05)' : 'var(--bg-secondary)',
                          }}>
                          <input type="radio" name="addr-static" value={a.id}
                            checked={selectedAddr === a.id}
                            onChange={() => setSelectedAddr(a.id)}
                            className="mt-0.5 accent-[#F4821F]" />
                          <div>
                            <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                              {a.addressLine}, {a.district}/{a.city}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      Henüz kayıtlı adres yok.
                    </p>
                  )}
                </div>
              )}

              {/* Sipariş özeti */}
              <div className="rounded-2xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-[12px] font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Sipariş Özeti</p>
                <div className="space-y-1.5 mb-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="truncate mr-2 max-w-[140px]">{item.productName}</span>
                      <span>₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {catalogItems.map(item => (
                    <div key={item.id} className="flex justify-between text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="truncate mr-2 max-w-[140px]">
                        {item.productName}
                        <span className="text-[10px] ml-1">×{item.tierQty}</span>
                      </span>
                      <span>₺{Number(item.priceTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Kargo</span>
                  <span className="text-green-600 font-bold">Ücretsiz</span>
                </div>
                <div className="flex justify-between items-center pt-3"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Toplam</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>KDV Dahil</p>
                  </div>
                  <p className="text-[22px] font-black text-[#F4821F]">
                    ₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Butonlar */}
              {catalogItems.length > 0 && (
                <button onClick={() => setCatalogModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-white rounded-2xl transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)', boxShadow: '0 6px 14px rgba(244,130,31,0.3)' }}>
                  <Send size={15} />
                  Siparişi Tamamla
                  <span className="text-[12px] opacity-80">
                    (₺{catalogTotalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })})
                  </span>
                </button>
              )}

              {items.length > 0 && (
                <button onClick={checkout} disabled={checkoutLoading || !selectedAddr}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-white rounded-2xl transition-all disabled:opacity-50"
                  style={{ background: '#1a1a1a' }}>
                  {checkoutLoading
                    ? <><Loader2 size={15} className="animate-spin" /> İşleniyor...</>
                    : 'Ödemeye Geç →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ KATALOG SİPARİŞ MODAL ═══ */}
        {catalogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCatalogModalOpen(false)}>
            <div onClick={e => e.stopPropagation()}
              className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              {/* Modal başlık */}
              <div className="sticky top-0 flex items-center justify-between px-5 py-4 z-10"
                style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Sipariş Bilgileri
                </h3>
                <button onClick={() => setCatalogModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={15} />
                </button>
              </div>

              <div className="p-5 space-y-4">

                {/* Login banner */}
                {isLoggedIn ? (
                  <div className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <UserCircle size={18} className="text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold">Giriş yaptınız</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{authUser?.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl p-3"
                    style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)' }}>
                    <div className="flex items-start gap-2">
                      <KeyRound size={14} className="text-[#F4821F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[12px] font-bold">Üye olmadan sipariş veriyorsunuz</p>
                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          Sipariş sonrası emailinize giriş şifreniz gönderilir.
                        </p>
                      </div>
                    </div>
                    <button onClick={() => router.push(`/giris?next=${encodeURIComponent('/sepet')}`)}
                      className="mt-2 w-full text-[11px] font-bold py-1.5 rounded-lg hover:opacity-80 transition-colors"
                      style={{ color: '#F4821F' }}>
                      Hesabınız var mı? Giriş yap →
                    </button>
                  </div>
                )}

                {/* Özet */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {catalogItems.length} ürün · KDV Dahil
                  </p>
                  <p className="text-[20px] font-black text-[#F4821F]">
                    ₺{catalogTotalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                  </p>
                </div>

                {/* Kayıtlı adres */}
                {hasSavedAddresses && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 flex items-center gap-1.5"
                      style={{ color: 'var(--text-muted)' }}>
                      <MapPin size={11} /> Teslimat Adresi
                    </label>
                    <div className="space-y-2">
                      {addresses.map(a => (
                        <label key={a.id}
                          className="flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: selectedSavedAddrId === a.id ? 'rgba(244,130,31,0.08)' : 'var(--bg-secondary)',
                            border: selectedSavedAddrId === a.id ? '1.5px solid #F4821F' : '1px solid var(--border)',
                          }}>
                          <input type="radio" name="catalog-addr"
                            checked={selectedSavedAddrId === a.id}
                            onChange={() => applySavedAddress(a)}
                            className="mt-0.5 accent-[#F4821F]" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                              {a.isDefault && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                                  style={{ background: 'rgba(244,130,31,0.15)', color: '#F4821F' }}>
                                  Varsayılan
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {a.addressLine}, {a.district}/{a.city}
                            </p>
                          </div>
                        </label>
                      ))}
                      <button type="button" onClick={handleNewAddress}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold rounded-xl transition-all"
                        style={{
                          border: editMode ? '1.5px solid #F4821F' : '1px dashed var(--border)',
                          color: editMode ? '#F4821F' : 'var(--text-muted)',
                          background: editMode ? 'rgba(244,130,31,0.05)' : 'transparent',
                        }}>
                        <Plus size={11} /> Yeni adres ekle
                      </button>
                    </div>
                  </div>
                )}

                {/* Form alanları */}
                {(!isLoggedIn || showFullAddressForm) && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                      style={{ color: 'var(--text-muted)' }}>
                      Ad Soyad <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input value={orderForm.customerName}
                      onChange={e => setOrderForm(f => ({ ...f, customerName: e.target.value }))}
                      placeholder="Ahmet Yılmaz"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                      style={{ color: 'var(--text-muted)' }}>
                      Telefon <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input value={orderForm.customerPhone}
                      onChange={e => setOrderForm(f => ({ ...f, customerPhone: e.target.value }))}
                      placeholder="0555 555 55 55"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  {!isLoggedIn && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1"
                        style={{ color: 'var(--text-muted)' }}>
                        <Mail size={10} /> Email <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input value={orderForm.customerEmail}
                        onChange={e => setOrderForm(f => ({ ...f, customerEmail: e.target.value }))}
                        placeholder="mail@adres.com"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  )}
                </div>

                {showFullAddressForm && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                        style={{ color: 'var(--text-muted)' }}>
                        Adres <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <textarea value={orderForm.customerAddress}
                        onChange={e => setOrderForm(f => ({ ...f, customerAddress: e.target.value }))}
                        rows={2} placeholder="Mahalle, sokak, kapı no..."
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none resize-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                          style={{ color: 'var(--text-muted)' }}>Şehir</label>
                        <input value={orderForm.city}
                          onChange={e => setOrderForm(f => ({ ...f, city: e.target.value }))}
                          placeholder="Gaziantep"
                          className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                          style={{ color: 'var(--text-muted)' }}>İlçe</label>
                        <input value={orderForm.district}
                          onChange={e => setOrderForm(f => ({ ...f, district: e.target.value }))}
                          placeholder="Şehitkamil"
                          className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                      </div>
                    </div>

                    {isLoggedIn && (
                      <div className="rounded-xl p-3"
                        style={{ background: 'rgba(244,130,31,0.04)', border: '1px solid rgba(244,130,31,0.2)' }}>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" checked={saveAddressToProfile}
                            onChange={e => setSaveAddressToProfile(e.target.checked)}
                            className="mt-0.5 accent-[#F4821F]" />
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <Save size={11} className="text-[#F4821F]" />
                              <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                                Bu adresi profilime kaydet
                              </span>
                            </div>
                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              Sonraki siparişlerde hızlı seçim
                            </p>
                          </div>
                        </label>
                        {saveAddressToProfile && (
                          <input value={newAddressTitle}
                            onChange={e => setNewAddressTitle(e.target.value)}
                            placeholder="Adres adı: Ev / İş / Diğer..."
                            className="mt-2 w-full px-3 py-2 text-[12px] rounded-lg outline-none"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        )}
                      </div>
                    )}
                  </>
                )}

                {hasSavedAddresses && selectedSavedAddrId && !editMode && (
                  <button type="button" onClick={() => setEditMode(true)}
                    className="text-[11px] flex items-center gap-1.5 hover:underline"
                    style={{ color: 'var(--text-muted)' }}>
                    <Edit3 size={10} /> Bu sipariş için adresi değiştir
                  </button>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                    style={{ color: 'var(--text-muted)' }}>Not (opsiyonel)</label>
                  <textarea value={orderForm.notes}
                    onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2} placeholder="Acele, hızlı kargo vb."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 flex gap-3 px-5 py-4"
                style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setCatalogModalOpen(false)}
                  className="px-4 py-3 text-[13px] font-medium rounded-xl"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={submitCatalogOrder} disabled={orderSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-white rounded-xl disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)' }}>
                  {orderSubmitting
                    ? <><Loader2 size={14} className="animate-spin" /> Gönderiliyor...</>
                    : <><Send size={14} /> Siparişi Gönder</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}