'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { productApi, cartApi } from '@/lib/api'
import { useCartStore } from '@/lib/store/cart'
import { Check, Upload, Calculator } from 'lucide-react'

const steps = ['Ürün & boyut', 'Tasarım yükle', 'Özet']

type Form = {
  productSlug: string
  widthCm?: number
  heightCm?: number
  quantity: number
}

function SiparisContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [products, setProducts] = useState<any[]>([])
  const [price, setPrice] = useState<any>(null)
  const [calcLoading, setCalcLoading] = useState(false)
  const [cartItemId, setCartItemId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  const applyCartResponse = useCartStore(s => s.applyCartResponse)
  const [submitting, setSubmitting] = useState(false)

  const enParam   = params.get('en')   ? Number(params.get('en'))   : undefined
  const boyParam  = params.get('boy')  ? Number(params.get('boy'))  : undefined
  const adetParam = params.get('adet') ? Number(params.get('adet')) : 1

  const { register, watch, handleSubmit, formState: { errors } } = useForm<Form>({
    defaultValues: {
      quantity: adetParam,
      productSlug: params.get('urun') || '',
      widthCm: enParam,
      heightCm: boyParam,
    }
  })

  const slug = watch('productSlug')
  const selectedProduct = products.find(p => p.slug === slug)

  useEffect(() => {
    productApi.list().then(r => setProducts(r.data.data || []))
  }, [])

  const calcPrice = async () => {
    const vals = watch()
    if (!vals.productSlug || !vals.quantity) return
    setCalcLoading(true)
    try {
      const res = await productApi.calculatePrice({
        productSlug: vals.productSlug,
        widthCm: vals.widthCm ? Number(vals.widthCm) : undefined,
        heightCm: vals.heightCm ? Number(vals.heightCm) : undefined,
        quantity: Number(vals.quantity),
      })
      setPrice(res.data.data)
    } catch {
      toast.error('Fiyat hesaplanamadı')
    } finally { setCalcLoading(false) }
  }

const handleStep1 = async (data: Form) => {
    if (submitting) return                                // çift tıklama koruması
    if (!price) { toast.error('Önce fiyat hesaplayın'); return }
    setSubmitting(true)
    try {
      const res = await cartApi.addItem({
        productSlug: data.productSlug,
        widthCm: data.widthCm ? Number(data.widthCm) : undefined,
        heightCm: data.heightCm ? Number(data.heightCm) : undefined,
        quantity: Number(data.quantity),
        declaredPrints: 1,
      })

      // Backend cart'ı + addedItemId'yi store'a yaz
      const addedId = applyCartResponse(res.data?.data)
      if (!addedId) {
        toast.error('Eklenen ürün belirlenemedi')
        return
      }
      setCartItemId(addedId)

      if (selectedProduct?.hasFile) setStep(1)
      else setStep(2)
    } catch {
      toast.error('Sepete eklenemedi')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !cartItemId) { setStep(2); return }
    setUploadLoading(true)
    try {
      await cartApi.uploadFile(cartItemId, file)
      toast.success('Dosya yüklendi')
      setStep(2)
    } catch { toast.error('Dosya yüklenemedi') }
    finally { setUploadLoading(false) }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-[24px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100 mb-2">
            Sipariş oluştur
          </h1>

          {/* Adım göstergesi */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${
                  i < step ? 'bg-emerald-500 text-white' :
                  i === step ? 'bg-[#F4821F] text-white' :
                  'bg-black/[0.08] dark:bg-white/[0.08] text-gray-400'
                }`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-[12px] ${i === step ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-400'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-8 h-px bg-black/[0.08] dark:bg-white/[0.08] ml-1" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-6">

            {/* ADIM 1 */}
            {step === 0 && (
              <form onSubmit={handleSubmit(handleStep1)} className="space-y-5">

                {/* Ürün seç */}
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ürün seçin
                  </label>
                  <select
                    {...register('productSlug', { required: true })}
                    className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]"
                  >
                    <option value="">Seçiniz...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Boyut — sadece m² ürünlerde */}
                {selectedProduct?.unit === 'm2' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                        En (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        {...register('widthCm', { required: true, min: 1 })}
                        className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Boy (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="50"
                        {...register('heightCm', { required: true, min: 1 })}
                        className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]"
                      />
                    </div>
                  </div>
                )}

                {/* Adet */}
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adet
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { required: true, min: 1 })}
                    className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]"
                  />
                </div>

                {/* Fiyat hesapla */}
                <button
                  type="button"
                  onClick={calcPrice}
                  disabled={calcLoading}
                  className="w-full flex items-center justify-center gap-2 border border-black/[0.08] dark:border-white/[0.08] text-[13px] text-gray-700 dark:text-gray-300 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                >
                  <Calculator size={14} />
                  {calcLoading ? 'Hesaplanıyor...' : 'Fiyat hesapla'}
                </button>

                {/* Fiyat sonucu */}
                {price && (
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4">
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 mb-1">
                      {price.priceBreakdown}
                    </p>
                    <div className="text-[22px] font-medium text-[#F4821F] tracking-[-0.4px]">
                      ₺{Number(price.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? 'Ekleniyor...' : 'Devam et →'}
                </button>
              </form>
            )}

            {/* ADIM 2 — Tasarım yükle */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                    Tasarım dosyanızı yükleyin
                  </p>
                  <p className="text-[12px] text-gray-400 mb-4">
                    PDF, AI, EPS formatları kabul edilir. Maksimum 100 MB.
                  </p>
                  <label className="block border-2 border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-xl p-8 text-center cursor-pointer hover:border-[#F4821F] transition-colors">
                    <Upload size={28} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {file ? file.name : 'Dosyayı sürükle veya tıkla'}
                    </p>
                    <p className="text-[11px] text-gray-400">PDF · AI · EPS · Maks 100MB</p>
                    <input
                      type="file"
                      accept=".pdf,.ai,.eps"
                      className="hidden"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 text-[13px] text-gray-500 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    Sonra yükle
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploadLoading || !file}
                    className="flex-1 bg-[#F4821F] text-white text-[13px] font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {uploadLoading ? 'Yükleniyor...' : 'Yükle ve devam et →'}
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 3 — Özet */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                      Ürün sepete eklendi
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Sepetten devam ederek ödeme yapabilirsiniz
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep(0); setPrice(null); setFile(null); setCartItemId(null) }}
                    className="flex-1 text-[13px] text-gray-500 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 transition-colors"
                  >
                    Yeni ürün ekle
                  </button>
                  <button
                    onClick={() => router.push('/sepet')}
                    className="flex-1 bg-[#F4821F] text-white text-[13px] font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Sepete git →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default function SiparisPage() {
  return <Suspense><SiparisContent /></Suspense>
}