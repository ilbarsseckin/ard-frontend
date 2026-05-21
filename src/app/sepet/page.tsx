'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/cart'
import { addressApi, orderApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Trash2, ShoppingCart, MapPin, Plus, AlertTriangle, Loader2, RefreshCw } from 'lucide-react'

interface Address {
  id: string; title: string; fullName: string
  addressLine: string; district: string; city: string; isDefault: boolean
}

export default function SepetPage() {
  const { items, removeItem, subtotal, loading, syncFromBackend } = useCartStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddr, setSelectedAddr] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [synced, setSynced] = useState(false)
  const router = useRouter()

  // Sayfa açıldığında backend cart ile senkronize et
  useEffect(() => {
    syncFromBackend().finally(() => setSynced(true))
  }, [])

  useEffect(() => {
    addressApi.list()
      .then(r => {
        const addrs = r.data.data || []
        setAddresses(addrs)
        const def = addrs.find((a: Address) => a.isDefault)
        if (def) setSelectedAddr(def.id)
      })
      .catch(() => {})
  }, [])

  const handleRemove = async (id: string) => {
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

  const checkout = async () => {
    if (!selectedAddr) { toast.error('Teslimat adresi seçin'); return }
    if (items.length === 0) { toast.error('Sepetiniz boş'); return }
    setCheckoutLoading(true)
    try {
      const res = await orderApi.checkout(selectedAddr)
      const { orderId } = res.data.data
      toast.success('Sipariş oluşturuldu! Ödeme sayfasına yönlendiriliyorsunuz...')
      // Ödeme sayfasına orderId ile yönlendir
      router.push(`/odeme?siparisId=${orderId}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // İlk senkronizasyon henüz bitmedi
  if (!synced || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-[#F4821F]" />
            <p className="text-[13px] text-gray-400">Sepet yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart size={40} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
            <p className="text-[16px] font-medium text-gray-900 dark:text-gray-100 mb-1">Sepetiniz boş</p>
            <p className="text-[13px] text-gray-400 mb-5">Ürün eklemek için kataloga göz atın</p>
            <button
              onClick={() => router.push('/urunler')}
              className="bg-[#F4821F] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Ürünlere git
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

          {/* Başlık + yenile */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[24px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">
              Sepetim
            </h1>
            <button
              onClick={() => { syncFromBackend(); toast.success('Sepet güncellendi') }}
              className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <RefreshCw size={13} />
              Yenile
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Sol — ürünler */}
            <div className="col-span-2 space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 transition-opacity ${removingId === item.id ? 'opacity-40' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{item.priceBreakdown}</p>

                      {/* Boyut bilgisi */}
                      {(item.widthCm || item.heightCm) && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.widthCm && item.heightCm
                            ? `${item.widthCm} × ${item.heightCm} cm`
                            : item.widthCm
                            ? `${item.widthCm} cm en`
                            : `${item.heightCm} cm boy`}
                          {' · '}Adet: {item.quantity}
                        </p>
                      )}

                      {/* Yüklenen dosya */}
                      {item.fileOriginalName && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                          📎 {item.fileOriginalName}
                          {item.filePagesCount != null && ` (${item.filePagesCount} sayfa)`}
                        </p>
                      )}

                      {/* Sayfa uyarısı — backend pageWarning veya manual hesap */}
                      {(item.pageWarning ||
                        (item.filePagesCount != null && item.filePagesCount > item.declaredPrints)) && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                          <AlertTriangle size={11} />
                          PDF&apos;de {item.filePagesCount} sayfa var — {item.declaredPrints} baskı beyan edildi
                        </div>
                      )}

                      {/* Dosya bekleniyor uyarısı */}
                      {item.hasFile === false && !item.fileOriginalName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-blue-500">
                          <AlertTriangle size={11} />
                          Tasarım dosyası henüz yüklenmedi
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <p className="text-[16px] font-medium text-gray-900 dark:text-gray-100">
                        ₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                        className="w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-colors disabled:opacity-40"
                      >
                        {removingId === item.id
                          ? <Loader2 size={13} className="animate-spin" />
                          : <Trash2 size={13} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ — özet */}
            <div className="space-y-3">
              {/* Adres */}
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-gray-400" />
                  <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">Teslimat adresi</p>
                </div>
                {addresses.length > 0 ? (
                  <div className="space-y-2">
                    {addresses.map(a => (
                      <label
                        key={a.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                          selectedAddr === a.id
                            ? 'border-[#F4821F] bg-orange-50 dark:bg-orange-500/10'
                            : 'border-black/[0.05] dark:border-white/[0.05]'
                        }`}
                      >
                        <input
                          type="radio" name="addr" value={a.id}
                          checked={selectedAddr === a.id}
                          onChange={() => setSelectedAddr(a.id)}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{a.title}</p>
                          <p className="text-[11px] text-gray-400">{a.addressLine}, {a.district}/{a.city}</p>
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => router.push('/hesabim')}
                      className="w-full flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 py-1.5 transition-colors"
                    >
                      <Plus size={11} /> Yeni adres ekle
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/hesabim')}
                    className="w-full flex items-center justify-center gap-1.5 text-[12px] text-[#F4821F] py-2 border border-dashed border-orange-200 dark:border-orange-500/30 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                  >
                    <Plus size={13} /> Adres ekle
                  </button>
                )}
              </div>

              {/* Fiyat özeti */}
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4">
                <div className="space-y-2 mb-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-[12px] text-gray-400">
                      <span className="truncate mr-2 max-w-[130px]">{item.productName}</span>
                      <span className="flex-shrink-0">₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[12px] text-gray-400 mb-1">
                  <span>Kargo</span>
                  <span className="text-emerald-600">Ücretsiz</span>
                </div>
                <div className="border-t border-black/[0.07] dark:border-white/[0.07] pt-3 flex justify-between">
                  <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">Toplam</span>
                  <span className="text-[18px] font-medium text-[#F4821F]">
                    ₺{subtotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Ödemeye geç */}
              <button
                onClick={checkout}
                disabled={checkoutLoading || !selectedAddr || items.length === 0}
                className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {checkoutLoading
                  ? <><Loader2 size={16} className="animate-spin" /> İşleniyor...</>
                  : 'Ödemeye geç →'
                }
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                Siparişiniz onaylandıktan sonra ödeme sayfasına yönlendirilirsiniz
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}