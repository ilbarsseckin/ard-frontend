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

  // ✨ YENİ: profil kayıt durumu
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
    setOrderForm(f => ({
      ...f,
      customerAddress: '', city: '', district: '',
    }))
  }

  const handleRemoveStatic = async (id: string) => {
    setRemovingId(id)
    try {
      await removeItem(id)
      toast.success('Ürün sepetten kaldırıldı')
    } catch {
      toast.error('Kaldırma işlemi başarısız')
    } finally {
      setRemovingId(null)
    }
  }

  const handleRemoveCatalog = (id: string) => {
    removeCatalogItem(id)
    toast.success('Katalog ürünü kaldırıldı')
  }

  const checkout = async () => {
    if (!selectedAddr) { toast.error('Teslimat adresi seçin'); return }
    if (items.length === 0) { toast.error('Statik ürün sepette yok'); return }
    setCheckoutLoading(true)
    try {
      await syncFromBackend()
      if (useCartStore.getState().items.length === 0) {
        toast.error('Sepetiniz boş'); return
      }
      const res = await orderApi.checkout(selectedAddr)
      router.push(`/odeme?siparisId=${res.data.data.orderId}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

  const submitCatalogOrder = async () => {
    if (!orderForm.customerName.trim()) { toast.error('Ad soyad zorunlu'); return }
    if (!orderForm.customerPhone.trim()) { toast.error('Telefon zorunlu'); return }
    if (!orderForm.customerAddress.trim()) { toast.error('Adres zorunlu'); return }

    if (!isLoggedIn) {
      if (!orderForm.customerEmail.trim()) {
        toast.error('Üye değilseniz email zorunlu'); return
      }
      if (!isValidEmail(orderForm.customerEmail)) {
        toast.error('Geçerli email girin'); return
      }
    }
    if (catalogItems.length === 0) { toast.error('Sepet boş'); return }

    setOrderSubmitting(true)
    try {
      const items = catalogItems.map(it => ({
        productId: it.productId,
        tierId: it.tierId,
        priceTl: it.priceTl,
        priceUsd: it.priceUsd,
        kurAtAdd: it.kurAtAdd,
        attributes: it.attributes.map(a => ({
          attributeId: a.attributeId,
          optionId: a.optionId,
        })),
        designFileIds: it.designFileIds || [],
        designSupport: it.designSupport,
      }))

      const res = await api.post('/api/catalog/orders', { ...orderForm, items })
      const data = res.data.data

      // ✨ Sipariş başarılı — yeni adresi profile kaydet (best-effort)
      if (isLoggedIn && showFullAddressForm && saveAddressToProfile && orderForm.customerAddress.trim()) {
        try {
          await addressApi.add({
            title: newAddressTitle.trim() || `Adres ${addresses.length + 1}`,
            fullName: orderForm.customerName,
            phone: orderForm.customerPhone,
            addressLine: orderForm.customerAddress,
            city: orderForm.city || '',
            district: orderForm.district || '',
            isDefault: addresses.length === 0,  // ilk adres ise default
          })
          toast.success('Adres profile kaydedildi', { duration: 2000 })
        } catch (err) {
          console.warn('Adres kaydedilemedi:', err)
          // sessiz başarısızlık — sipariş geçti zaten
        }
      }

      if (data.guestAccountCreated) {
        toast.success(`Hesabınız oluşturuldu! Giriş bilgileri ${orderForm.customerEmail} adresine gönderildi`, { duration: 5000 })
      } else {
        toast.success(`Siparişiniz alındı: ${data.orderNumber}`)
      }

      clearCatalog()
      setCatalogModalOpen(false)
      setOrderForm(EMPTY_FORM)
      setSelectedSavedAddrId('')
      setEditMode(false)
      setNewAddressTitle('')
      router.push(`/odeme-katalog?siparisNo=${data.orderNumber}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı')
    } finally {
      setOrderSubmitting(false)
    }
  }

  const catalogTotalTl = catalogSubtotalTl()
  const grandTotal = subtotal + catalogTotalTl
  const totalCount = items.length + catalogItems.length

  if (!synced || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
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
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart size={40} className="mx-auto mb-4 text-gray-200" />
            <p className="text-[16px] font-medium mb-1">Sepetiniz boş</p>
            <button onClick={() => router.push('/')}
              className="bg-[#F4821F] text-white text-[13px] px-5 py-2.5 rounded-lg hover:opacity-90 mt-4">
              Ana sayfa
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
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[24px] font-medium tracking-[-0.5px]">Sepetim</h1>
            <button onClick={() => { syncFromBackend(); toast.success('Sepet güncellendi') }}
              className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw size={13} /> Yenile
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">

              {items.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-bold uppercase tracking-[1.5px] text-gray-400 mb-3">
                    Sipariş Ürünleri ({items.length})
                  </h2>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id}
                        className={`bg-white dark:bg-[#141414] border border-black/[0.07] rounded-xl p-4 transition-opacity ${removingId === item.id ? 'opacity-40' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium">{item.productName}</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">{item.priceBreakdown}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <p className="text-[16px] font-medium">
                              ₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </p>
                            <button onClick={() => handleRemoveStatic(item.id)}
                              disabled={removingId === item.id}
                              className="w-8 h-8 rounded-lg border border-black/[0.08] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                              {removingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {catalogItems.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-bold uppercase tracking-[1.5px] text-gray-400 mb-3">
                    Katalog Ürünleri ({catalogItems.length})
                  </h2>
                  <div className="space-y-3">
                    {catalogItems.map(item => {
                      const fileCount = item.designFileIds?.length || 0
                      const hasSupport = item.designSupport?.requested
                      const hasDesign = fileCount > 0 || hasSupport
                      const notesExpanded = expandedNotesId === item.id
                      return (
                        <div key={item.id}
                          className="bg-white dark:bg-[#141414] border border-black/[0.07] rounded-xl p-4">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' }}>
                              {item.mainImageUrl
                                ? <img src={item.mainImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                : <Package size={20} className="text-gray-300 m-auto mt-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium">{item.productName}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {item.categoryName} · {item.tierQty.toLocaleString('tr-TR')} adet
                              </p>
                              {item.attributes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.attributes.map(a => (
                                    <span key={a.attributeId} className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                      style={{ background: 'rgba(244,130,31,0.08)', color: '#F4821F' }}>
                                      {a.label}: {a.optionValue}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2">
                                {fileCount > 0 && (
                                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md"
                                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                    <Check size={11} className="text-emerald-600" />
                                    <span className="text-[11px] font-bold text-emerald-700">{fileCount} tasarım yüklendi</span>
                                  </div>
                                )}
                                {hasSupport && (
                                  <button onClick={() => setExpandedNotesId(notesExpanded ? null : item.id)}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-orange-500/15 transition-colors"
                                    style={{ background: 'rgba(244,130,31,0.1)', border: '1px solid rgba(244,130,31,0.25)' }}>
                                    <Palette size={11} className="text-[#F4821F]" />
                                    <span className="text-[11px] font-bold text-[#F4821F]">
                                      Tasarım Desteği {notesExpanded ? '▲' : '▼'}
                                    </span>
                                  </button>
                                )}
                                {!hasDesign && (
                                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md"
                                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                                    <AlertTriangle size={11} className="text-amber-600" />
                                    <span className="text-[11px] font-bold text-amber-700">Tasarım eksik</span>
                                  </div>
                                )}
                                {hasSupport && notesExpanded && (
                                  <div className="mt-2 p-2.5 rounded-lg text-[11px] leading-relaxed"
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                    {item.designSupport?.notes || '(not yok)'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-start gap-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-[16px] font-medium">
                                  ₺{Number(item.priceTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-[10px] text-gray-400">KDV Dahil</p>
                              </div>
                              <button onClick={() => handleRemoveCatalog(item.id)}
                                className="w-8 h-8 rounded-lg border border-black/[0.08] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => setCatalogModalOpen(true)}
                    className="mt-4 w-full bg-[#F4821F] text-white text-[13px] font-bold py-3 rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                    <Send size={14} />
                    Siparişi Tamamla (₺{catalogTotalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })})
                  </button>
                </section>
              )}
            </div>

            <div className="space-y-3">
              {items.length > 0 && (
                <div className="bg-white dark:bg-[#141414] border border-black/[0.07] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={14} className="text-gray-400" />
                    <p className="text-[13px] font-medium">Teslimat adresi</p>
                  </div>
                  {addresses.length > 0 ? (
                    <div className="space-y-2">
                      {addresses.map(a => (
                        <label key={a.id}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                            selectedAddr === a.id ? 'border-[#F4821F] bg-orange-50' : 'border-black/[0.05]'
                          }`}>
                          <input type="radio" name="addr-static" value={a.id}
                            checked={selectedAddr === a.id}
                            onChange={() => setSelectedAddr(a.id)} className="mt-0.5" />
                          <div>
                            <p className="text-[12px] font-medium">{a.title}</p>
                            <p className="text-[11px] text-gray-400">{a.addressLine}, {a.district}/{a.city}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400">
                      Henüz kayıtlı adres yok. Sipariş verirken adres ekleyebilirsiniz.
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] rounded-xl p-4">
                <div className="space-y-2 mb-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-[12px] text-gray-400">
                      <span className="truncate mr-2 max-w-[130px]">{item.productName}</span>
                      <span>₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {catalogItems.map(item => (
                    <div key={item.id} className="flex justify-between text-[12px] text-gray-400">
                      <span className="truncate mr-2 max-w-[130px]">{item.productName} <span className="text-[10px]">×{item.tierQty}</span></span>
                      <span>₺{Number(item.priceTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[12px] text-gray-400 mb-1">
                  <span>Kargo</span><span className="text-emerald-600">Ücretsiz</span>
                </div>
                <div className="border-t border-black/[0.07] pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-[14px] font-medium block">Toplam</span>
                    <span className="text-[10px] text-gray-400">KDV Dahil</span>
                  </div>
                  <span className="text-[18px] font-medium text-[#F4821F]">
                    ₺{grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {items.length > 0 && (
                <button onClick={checkout} disabled={checkoutLoading || !selectedAddr}
                  className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {checkoutLoading ? <><Loader2 size={16} className="animate-spin" /> İşleniyor...</> : 'Statik ürünleri sipariş ver →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ KATALOG MODAL ═══ */}
        {catalogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCatalogModalOpen(false)}>
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-[#141414]"
              style={{ border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold">Sipariş Bilgileri</h3>
                <button onClick={() => setCatalogModalOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              {/* Login durumu banner */}
              {isLoggedIn ? (
                <div className="rounded-lg p-3 mb-4 flex items-center gap-3"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <UserCircle size={18} className="text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold">Giriş yaptınız</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{authUser?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg p-3 mb-4"
                  style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)' }}>
                  <div className="flex items-start gap-2">
                    <KeyRound size={14} className="text-[#F4821F] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] font-bold">Üye olmadan sipariş veriyorsunuz</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Sipariş tamamlanınca <strong>emailinize giriş şifreniz</strong> gönderilir.
                      </p>
                    </div>
                  </div>
                  <button onClick={() => router.push(`/giris?next=${encodeURIComponent('/sepet')}`)}
                    className="mt-2 w-full text-[11px] font-bold py-1.5 rounded-lg hover:bg-orange-500/10 transition-colors"
                    style={{ color: '#F4821F' }}>
                    Zaten hesabınız var mı? Giriş yap →
                  </button>
                </div>
              )}

              {/* Özet */}
              <div className="rounded-lg p-3 mb-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  {catalogItems.length} ürün · KDV Dahil
                </p>
                <p className="text-[18px] font-black" style={{ color: '#F4821F' }}>
                  ₺{catalogTotalTl.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Kayıtlı adres seçici */}
              {hasSavedAddresses && (
                <div className="mb-4">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 flex items-center gap-1.5"
                    style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> Teslimat Adresi
                  </label>
                  <div className="space-y-2">
                    {addresses.map(a => (
                      <label key={a.id}
                        className="flex items-start gap-2.5 p-3 rounded-lg cursor-pointer transition-colors"
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
                            <p className="text-[12px] font-bold">{a.title}</p>
                            {a.isDefault && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                                style={{ background: 'rgba(244,130,31,0.15)', color: '#F4821F' }}>
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>
                            {a.addressLine}, {a.district}/{a.city}
                          </p>
                        </div>
                      </label>
                    ))}

                    <button type="button" onClick={handleNewAddress}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold rounded-lg transition-colors"
                      style={{
                        border: editMode ? '1.5px solid #F4821F' : '1px dashed var(--border)',
                        background: editMode ? 'rgba(244,130,31,0.05)' : 'transparent',
                        color: editMode ? '#F4821F' : 'var(--text-muted)',
                      }}>
                      <Plus size={11} /> Yeni adres
                    </button>
                  </div>
                </div>
              )}

              {/* Login + adres yok hint */}
              {isLoggedIn && !hasSavedAddresses && (
                <div className="mb-4 p-3 rounded-lg text-[11px] flex items-start gap-2"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <MapPin size={12} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Henüz kayıtlı adresiniz yok. Aşağıdaki adresi <strong>profilinize kaydedebilirsiniz</strong>
                    {' '}— bir sonraki siparişte hızlı seçim için.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {(!isLoggedIn || showFullAddressForm) && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                      style={{ color: 'var(--text-muted)' }}>
                      Ad Soyad <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input value={orderForm.customerName}
                      onChange={e => setOrderForm(f => ({ ...f, customerName: e.target.value }))}
                      placeholder="Ahmet Yılmaz"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
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
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
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
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                    </div>
                  )}
                </div>

                {/* Adres alanları — guest veya yeni/edit mode'da */}
                {showFullAddressForm && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                        style={{ color: 'var(--text-muted)' }}>
                        Adres <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <textarea value={orderForm.customerAddress}
                        onChange={e => setOrderForm(f => ({ ...f, customerAddress: e.target.value }))}
                        rows={2}
                        placeholder="Mahalle, sokak, kapı no..."
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                          style={{ color: 'var(--text-muted)' }}>Şehir</label>
                        <input value={orderForm.city}
                          onChange={e => setOrderForm(f => ({ ...f, city: e.target.value }))}
                          placeholder="Gaziantep"
                          className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                          style={{ color: 'var(--text-muted)' }}>İlçe</label>
                        <input value={orderForm.district}
                          onChange={e => setOrderForm(f => ({ ...f, district: e.target.value }))}
                          placeholder="Şehitkamil"
                          className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                      </div>
                    </div>

                    {/* ✨ ADRESİ PROFİLE KAYDET — sadece login kullanıcıya */}
                    {isLoggedIn && (
                      <div className="rounded-lg p-3"
                        style={{ background: 'rgba(244,130,31,0.04)', border: '1px solid rgba(244,130,31,0.2)' }}>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox"
                            checked={saveAddressToProfile}
                            onChange={e => setSaveAddressToProfile(e.target.checked)}
                            className="mt-0.5 accent-[#F4821F]" />
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <Save size={11} className="text-[#F4821F]" />
                              <span className="text-[12px] font-bold">Bu adresi profilime kaydet</span>
                            </div>
                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              Sonraki siparişlerinizde hızlı seçim için
                            </p>
                          </div>
                        </label>

                        {saveAddressToProfile && (
                          <input value={newAddressTitle}
                            onChange={e => setNewAddressTitle(e.target.value)}
                            placeholder="Adres adı: Ev / İş / Diğer..."
                            className="mt-2 w-full px-3 py-2 text-[12px] rounded-lg outline-none"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Kayıtlı adres seçili → düzenle butonu */}
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
                    rows={2}
                    placeholder="Acele, hızlı kargo vb."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                </div>
              </div>

              <div className="flex gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setCatalogModalOpen(false)}
                  className="px-5 py-2.5 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={submitCatalogOrder} disabled={orderSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
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