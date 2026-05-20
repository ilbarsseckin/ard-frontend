'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/cart'
import { addressApi, orderApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Trash2, ShoppingCart, MapPin, Plus, AlertTriangle } from 'lucide-react'

interface Address { id: string; title: string; fullName: string; addressLine: string; district: string; city: string; isDefault: boolean }

export default function SepetPage() {
  const { items, removeItem, subtotal } = useCartStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddr, setSelectedAddr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    addressApi.list().then(r => {
      const addrs = r.data.data || []
      setAddresses(addrs)
      const def = addrs.find((a: Address) => a.isDefault)
      if (def) setSelectedAddr(def.id)
    }).catch(() => {})
  }, [])

  const checkout = async () => {
    if (!selectedAddr) { toast.error('Teslimat adresi seçin'); return }
    setLoading(true)
    try {
      const res = await orderApi.checkout(selectedAddr)
      const { orderId } = res.data.data
      toast.success('Sipariş oluşturuldu!')
      router.push(`/hesabim/siparisler/${orderId}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı')
    } finally { setLoading(false) }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart size={40} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
            <p className="text-[16px] font-medium text-gray-900 dark:text-gray-100 mb-1">Sepetiniz boş</p>
            <p className="text-[13px] text-gray-400 mb-5">Ürün eklemek için sipariş sayfasına gidin</p>
            <button onClick={() => router.push('/siparis')}
              className="bg-[#F4821F] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Sipariş ver
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
          <h1 className="text-[24px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100 mb-8">Sepetim</h1>

          <div className="grid grid-cols-3 gap-6">
            {/* Sol — ürünler */}
            <div className="col-span-2 space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{item.productName}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{item.priceBreakdown}</p>
                      {item.fileOriginalName && (
                        <p className="text-[11px] text-emerald-600 mt-1">📎 {item.fileOriginalName}</p>
                      )}
                      {item.filePagesCount && item.filePagesCount > item.declaredPrints && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-600">
                          <AlertTriangle size={11} />
                          PDF'de {item.filePagesCount} sayfa — {item.declaredPrints} baskı beyan edildi
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <p className="text-[16px] font-medium text-gray-900 dark:text-gray-100">
                        ₺{item.totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                      <button onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                        <Trash2 size={13} />
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
                      <label key={a.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer border transition-colors ${selectedAddr === a.id ? 'border-[#F4821F] bg-orange-50 dark:bg-orange-500/10' : 'border-black/[0.05] dark:border-white/[0.05]'}`}>
                        <input type="radio" name="addr" value={a.id} checked={selectedAddr === a.id}
                          onChange={() => setSelectedAddr(a.id)} className="mt-0.5" />
                        <div>
                          <p className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{a.title}</p>
                          <p className="text-[11px] text-gray-400">{a.addressLine}, {a.district}/{a.city}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => router.push('/hesabim/adresler')}
                    className="w-full flex items-center justify-center gap-1.5 text-[12px] text-[#F4821F] py-2 border border-dashed border-orange-200 dark:border-orange-500/30 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                    <Plus size={13} /> Adres ekle
                  </button>
                )}
              </div>

              {/* Fiyat özeti */}
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4">
                <div className="flex justify-between text-[13px] text-gray-500 mb-2">
                  <span>{items.length} ürün</span>
                  <span>₺{subtotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500 mb-3">
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

              <button onClick={checkout} disabled={loading || !selectedAddr}
                className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? 'İşleniyor...' : 'Siparişi onayla →'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
