'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/lib/store/auth'
import { orderApi, addressApi, catalogOrderApi } from '@/lib/api'
import {
  Package, User, LogOut, MapPin, Plus, Edit3, Trash2, Star, Loader2, X, Check, Truck, Search,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  addressLine: string
  district: string
  city: string
  isDefault: boolean
}

const EMPTY_ADDR_FORM = {
  title: '',
  fullName: '',
  phone: '',
  addressLine: '',
  district: '',
  city: '',
  isDefault: false,
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ödeme Bekleniyor', color: 'text-gray-500' },
  PAID: { label: 'Ödendi', color: 'text-blue-600' },
  REVIEWING: { label: 'İncelemede', color: 'text-amber-600' },
  PRINTING: { label: 'Baskıda', color: 'text-purple-600' },
  SHIPPED: { label: 'Kargoda', color: 'text-blue-600' },
  COMPLETED: { label: 'Tamamlandı', color: 'text-emerald-600' },
  CANCELLED: { label: 'İptal', color: 'text-red-500' },
}

type TabKey = 'orders' | 'catalog_orders' | 'addresses'

export default function HesabimPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [activeTab, setActiveTab] = useState<TabKey>('catalog_orders')

  // Orders (eski sistem)
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Katalog siparişleri
  const [catalogOrders, setCatalogOrders] = useState<any[]>([])
  const [catalogOrdersLoading, setCatalogOrdersLoading] = useState(true)
  const [trackingSearch, setTrackingSearch] = useState('')

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [addrModalOpen, setAddrModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR_FORM)
  const [savingAddr, setSavingAddr] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      const stored = localStorage.getItem('baski-auth')
      if (!stored) { router.push('/giris'); return }
      const { state } = JSON.parse(stored)
      if (!state?.token) { router.push('/giris'); return }

      loadOrders()
      loadCatalogOrders()
      loadAddresses()
    } catch {
      router.push('/giris')
    }
  }, [mounted])

  const loadOrders = () => {
    setOrdersLoading(true)
    orderApi.list()
      .then(r => setOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false))
  }

  const loadCatalogOrders = () => {
    setCatalogOrdersLoading(true)
    catalogOrderApi.myOrders()
      .then(r => setCatalogOrders(r.data.data || []))
      .catch(() => {})
      .finally(() => setCatalogOrdersLoading(false))
  }

  const loadAddresses = () => {
    setAddressesLoading(true)
    addressApi.list()
      .then(r => setAddresses(r.data.data || []))
      .catch(() => {})
      .finally(() => setAddressesLoading(false))
  }

  const handleLogout = () => { logout(); router.push('/') }

  const openAddModal = () => {
    setEditingId(null)
    setAddrForm({
      ...EMPTY_ADDR_FORM,
      fullName: user?.name || '',
      phone: user?.phone || '',
      isDefault: addresses.length === 0,  // ilk adres ise default
    })
    setAddrModalOpen(true)
  }

  const openEditModal = (a: Address) => {
    setEditingId(a.id)
    setAddrForm({
      title: a.title,
      fullName: a.fullName,
      phone: a.phone,
      addressLine: a.addressLine,
      district: a.district,
      city: a.city,
      isDefault: a.isDefault,
    })
    setAddrModalOpen(true)
  }

  const closeAddrModal = () => {
    setAddrModalOpen(false)
    setEditingId(null)
    setAddrForm(EMPTY_ADDR_FORM)
  }

  const saveAddress = async () => {
    if (!addrForm.title.trim()) { toast.error('Adres adı zorunlu (Ev, İş vb.)'); return }
    if (!addrForm.fullName.trim()) { toast.error('Ad soyad zorunlu'); return }
    if (!addrForm.phone.trim()) { toast.error('Telefon zorunlu'); return }
    if (!addrForm.addressLine.trim()) { toast.error('Adres detayı zorunlu'); return }
    if (!addrForm.city.trim()) { toast.error('Şehir zorunlu'); return }
    if (!addrForm.district.trim()) { toast.error('İlçe zorunlu'); return }

    setSavingAddr(true)
    try {
      if (editingId) {
        await addressApi.update(editingId, addrForm)
        toast.success('Adres güncellendi')
      } else {
        await addressApi.add(addrForm)
        toast.success('Adres eklendi')
      }
      closeAddrModal()
      loadAddresses()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Adres kaydedilemedi')
    } finally {
      setSavingAddr(false)
    }
  }

  const deleteAddress = async (id: string, title: string) => {
    if (!confirm(`"${title}" adresini silmek istediğinize emin misiniz?`)) return
    setDeletingId(id)
    try {
      await addressApi.delete(id)
      toast.success('Adres silindi')
      loadAddresses()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Adres silinemedi')
    } finally {
      setDeletingId(null)
    }
  }

  const setDefault = async (a: Address) => {
    if (a.isDefault) return
    try {
      await addressApi.update(a.id, { ...a, isDefault: true })
      toast.success(`"${a.title}" artık varsayılan adres`)
      loadAddresses()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Varsayılan yapılamadı')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">
                Hesabım
              </h1>
              <p className="text-[13px] text-gray-400 mt-1">{user?.email}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={14} /> Çıkış yap
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setActiveTab('catalog_orders')}
              className="flex items-center gap-2 px-5 py-3 text-[13px] font-bold transition-colors -mb-px"
              style={{
                color: activeTab === 'catalog_orders' ? '#F4821F' : 'var(--text-muted)',
                borderBottom: activeTab === 'catalog_orders' ? '2px solid #F4821F' : '2px solid transparent',
              }}>
              <Truck size={14} /> Siparişlerim
              {catalogOrders.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: activeTab === 'catalog_orders' ? '#F4821F' : 'var(--border)',
                    color: activeTab === 'catalog_orders' ? 'white' : 'var(--text-muted)',
                  }}>
                  {catalogOrders.length}
                </span>
              )}
            </button>
            <button onClick={() => setActiveTab('addresses')}
              className="flex items-center gap-2 px-5 py-3 text-[13px] font-bold transition-colors -mb-px"
              style={{
                color: activeTab === 'addresses' ? '#F4821F' : 'var(--text-muted)',
                borderBottom: activeTab === 'addresses' ? '2px solid #F4821F' : '2px solid transparent',
              }}>
              <MapPin size={14} /> Adreslerim
              {addresses.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: activeTab === 'addresses' ? '#F4821F' : 'var(--border)',
                    color: activeTab === 'addresses' ? 'white' : 'var(--text-muted)',
                  }}>
                  {addresses.length}
                </span>
              )}
            </button>
          </div>

          {/* KATALOG SİPARİŞLERİM TAB */}
          {activeTab === 'catalog_orders' && (
            <>
              {/* Sipariş no ile hızlı sorgula */}
              <div className="rounded-xl p-4 mb-4 flex gap-2"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <input
                  type="text"
                  value={trackingSearch}
                  onChange={e => setTrackingSearch(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && trackingSearch.trim() && router.push(`/siparis/${trackingSearch.trim()}`)}
                  placeholder="Sipariş no ile sorgula… (CAT-XXXXXXXX)"
                  className="flex-1 px-3 py-2 text-[13px] font-mono rounded-lg outline-none"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={() => trackingSearch.trim() && router.push(`/siparis/${trackingSearch.trim()}`)}
                  disabled={!trackingSearch.trim()}
                  className="px-4 py-2 text-[12px] font-bold text-white rounded-lg disabled:opacity-40 flex items-center gap-1.5"
                  style={{ background: '#F4821F' }}>
                  <Search size={13} /> Takip Et
                </button>
              </div>
              {catalogOrdersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl p-4 h-20 animate-pulse"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                  ))}
                </div>
              ) : catalogOrders.length === 0 ? (
                <div className="rounded-xl p-10 text-center"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <Package size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Henüz sipariş yok</p>
                  <Link href="/urunler" className="inline-block mt-3 text-[12px] font-bold text-[#F4821F] hover:underline">
                    Ürünlere göz at →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {catalogOrders.map((o: any) => {
                    const statusColors: Record<string, { label: string; color: string; bg: string }> = {
                      PENDING:       { label: 'Ödeme Bekliyor', color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
                      CONFIRMED:     { label: 'Onaylandı',      color: '#2563EB', bg: 'rgba(59,130,246,0.1)' },
                      IN_PRODUCTION: { label: 'Üretimde',       color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
                      READY:         { label: 'Hazır',          color: '#0891B2', bg: 'rgba(8,145,178,0.1)'  },
                      SHIPPED:       { label: 'Kargoda',        color: '#059669', bg: 'rgba(16,185,129,0.1)' },
                      DELIVERED:     { label: 'Teslim Edildi',  color: '#16A34A', bg: 'rgba(22,163,74,0.1)'  },
                      CANCELLED:     { label: 'İptal',          color: '#DC2626', bg: 'rgba(239,68,68,0.1)'  },
                    }
                    const st = statusColors[o.status] || statusColors.PENDING
                    return (
                      <Link key={o.id} href={`/siparis/${o.orderNumber}`}
                        className="block rounded-xl p-4 transition-all hover:shadow-sm"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <code className="text-[13px] font-mono font-bold" style={{ color: '#F4821F' }}>
                                {o.orderNumber}
                              </code>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                style={{ background: st.bg, color: st.color }}>
                                {st.label}
                              </span>
                              {o.trackingNumber && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                  style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
                                  <Truck size={9} className="inline mr-1" />
                                  {o.trackingNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                              {new Date(o.createdAt).toLocaleDateString('tr-TR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </p>
                            {o.items?.slice(0, 2).map((item: any, i: number) => (
                              <p key={i} className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                                {item.productName} ×{item.tierQty}
                              </p>
                            ))}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[18px] font-black" style={{ color: '#F4821F' }}>
                              ₺{Number(o.totalTl).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              Takip →
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
            <>
              {ordersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 h-20 animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-10 text-center">
                  <Package size={32} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
                  <p className="text-[14px] text-gray-500">Henüz sipariş yok</p>
                  <Link href="/" className="inline-block mt-3 text-[12px] text-[#F4821F] hover:underline">
                    İlk siparişini ver →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o: any) => {
                    const s = statusMap[o.status] || { label: o.status, color: 'text-gray-500' }
                    return (
                      <Link key={o.id} href={`/hesabim/siparisler/${o.id}`}
                        className="block bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 hover:border-[#F4821F] transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                              #{o.id.substring(0, 8).toUpperCase()}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[12px] font-medium ${s.color}`}>{s.label}</span>
                            <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                              ₺{o.totalPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* ADRESLERİM TAB */}
          {activeTab === 'addresses' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  Kayıtlı teslimat adresleriniz
                </p>
                <button onClick={openAddModal}
                  className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors">
                  <Plus size={13} /> Yeni Adres
                </button>
              </div>

              {addressesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 h-32 animate-pulse" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-10 text-center">
                  <MapPin size={32} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
                  <p className="text-[14px] text-gray-500 mb-4">Henüz kayıtlı adres yok</p>
                  <button onClick={openAddModal}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors">
                    <Plus size={13} /> İlk Adresimi Ekle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {addresses.map(a => (
                    <div key={a.id}
                      className="bg-white dark:bg-[#141414] rounded-xl p-4 transition-colors"
                      style={{
                        border: a.isDefault ? '1.5px solid #F4821F' : '1px solid var(--border)',
                      }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-bold">{a.title}</p>
                          {a.isDefault && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5"
                              style={{ background: 'rgba(244,130,31,0.15)', color: '#F4821F' }}>
                              <Star size={9} /> Varsayılan
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                          {a.fullName} <span className="text-gray-400">·</span> {a.phone}
                        </p>
                        <p className="text-[12px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          {a.addressLine}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {a.district}/{a.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        {!a.isDefault && (
                          <button onClick={() => setDefault(a)}
                            className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:underline"
                            style={{ color: '#F4821F' }}>
                            <Star size={10} /> Varsayılan yap
                          </button>
                        )}
                        <button onClick={() => openEditModal(a)}
                          className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:underline ml-auto"
                          style={{ color: 'var(--text-secondary)' }}>
                          <Edit3 size={10} /> Düzenle
                        </button>
                        <button onClick={() => deleteAddress(a.id, a.title)}
                          disabled={deletingId === a.id}
                          className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:underline transition-colors disabled:opacity-40">
                          {deletingId === a.id
                            ? <Loader2 size={10} className="animate-spin" />
                            : <Trash2 size={10} />}
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ADRES MODAL */}
        {addrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={closeAddrModal}>
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-[#141414]"
              style={{ border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold">
                  {editingId ? 'Adresi Düzenle' : 'Yeni Adres'}
                </h3>
                <button onClick={closeAddrModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                    style={{ color: 'var(--text-muted)' }}>
                    Adres Adı <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input value={addrForm.title}
                    onChange={e => setAddrForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Ev, İş, Diğer..."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                    style={{ color: 'var(--text-muted)' }}>
                    Ad Soyad <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input value={addrForm.fullName}
                    onChange={e => setAddrForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                    style={{ color: 'var(--text-muted)' }}>
                    Telefon <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input value={addrForm.phone}
                    onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="0555 555 55 55"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                    style={{ color: 'var(--text-muted)' }}>
                    Adres Detayı <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea value={addrForm.addressLine}
                    onChange={e => setAddrForm(f => ({ ...f, addressLine: e.target.value }))}
                    rows={2}
                    placeholder="Mahalle, sokak, kapı no, daire..."
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                      style={{ color: 'var(--text-muted)' }}>
                      Şehir <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input value={addrForm.city}
                      onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="Gaziantep"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                      style={{ color: 'var(--text-muted)' }}>
                      İlçe <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input value={addrForm.district}
                      onChange={e => setAddrForm(f => ({ ...f, district: e.target.value }))}
                      placeholder="Şehitkamil"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                  </div>
                </div>

                <div className="rounded-lg p-3"
                  style={{ background: 'rgba(244,130,31,0.04)', border: '1px solid rgba(244,130,31,0.2)' }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))}
                      className="accent-[#F4821F]" />
                    <span className="text-[12px] font-bold flex items-center gap-1">
                      <Star size={11} className="text-[#F4821F]" />
                      Varsayılan adres olarak ayarla
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={closeAddrModal}
                  className="px-5 py-2.5 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={saveAddress} disabled={savingAddr}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                  {savingAddr
                    ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                    : <><Check size={14} /> {editingId ? 'Güncelle' : 'Kaydet'}</>}
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