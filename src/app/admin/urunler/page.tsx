'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api, { productApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Upload, RefreshCw, TrendingUp, ToggleLeft, ToggleRight, Download } from 'lucide-react'

function UrunlerContent() {
  const params = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'import' ? 'import' : 'list')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [bulkType, setBulkType] = useState('PERCENT_INCREASE')
  const [bulkValue, setBulkValue] = useState(10)
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadProducts = () => {
    setLoading(true)
    api.get('/api/admin/products').then(r => setProducts(r.data.data || [])).finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [])

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await api.post('/api/admin/products/import', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setImportResult(res.data.data)
      toast.success(`${res.data.data.imported} ürün eklendi, ${res.data.data.updated} güncellendi`)
      loadProducts()
    } catch { toast.error('Import başarısız') }
    finally { setImporting(false) }
  }

  const handleBulkPrice = async () => {
    setBulkLoading(true)
    try {
      const res = await api.patch('/api/admin/products/bulk-price', {
        categorySlug: bulkCategory || undefined,
        updateType: bulkType,
        value: Number(bulkValue),
      })
      toast.success(`${res.data.data.updatedRules} fiyat kuralı güncellendi`)
      loadProducts()
    } catch { toast.error('Fiyat güncelleme başarısız') }
    finally { setBulkLoading(false) }
  }

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/api/admin/products/${id}/toggle`)
      loadProducts()
      toast.success('Durum güncellendi')
    } catch { toast.error('Güncelleme başarısız') }
  }

  const downloadTemplate = () => {
    const csv = 'urun_adi,kategori,birim,liste_fiyati,min_adet,aciklama,aktif\nVinil Baskı,buyuk-format,m2,185,1,Yüksek kalite vinil baskı,1\nKartvizit 350g Mat,kartvizit,paket,180,250,350gr mat kartvizit,1'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'urun-sablonu.csv'; a.click()
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Ürün yönetimi</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">{products.length} aktif ürün</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTab('list')}
                className={`text-[12px] px-4 py-2 rounded-lg border transition-colors ${tab === 'list' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent' : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500'}`}>
                Ürün listesi
              </button>
              <button onClick={() => setTab('import')}
                className={`text-[12px] px-4 py-2 rounded-lg border transition-colors ${tab === 'import' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent' : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500'}`}>
                Excel import
              </button>
              <button onClick={() => setTab('price')}
                className={`text-[12px] px-4 py-2 rounded-lg border transition-colors ${tab === 'price' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent' : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500'}`}>
                Fiyat güncelle
              </button>
            </div>
          </div>

          {/* ÜRÜN LİSTESİ */}
          {tab === 'list' && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_120px_100px_80px_80px] text-[11px] font-medium text-gray-400 px-5 py-3 border-b border-black/[0.07] dark:border-white/[0.07] uppercase tracking-[0.5px]">
                <span>Ürün adı</span>
                <span>Kategori</span>
                <span>Birim</span>
                <span>Min adet</span>
                <span className="text-right">Durum</span>
              </div>
              <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="px-5 py-4 animate-pulse">
                      <div className="h-3 bg-gray-100 dark:bg-white/[0.05] rounded w-1/2" />
                    </div>
                  ))
                ) : products.map((p: any) => (
                  <div key={p.id} className="grid grid-cols-[1fr_120px_100px_80px_80px] items-center px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">{p.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{p.slug}</p>
                    </div>
                    <span className="text-[12px] text-gray-500">{p.pricingModel}</span>
                    <span className="text-[12px] text-gray-500">{p.unit}</span>
                    <span className="text-[12px] text-gray-500">{p.minOrder}</span>
                    <div className="flex justify-end">
                      <button onClick={() => handleToggle(p.id)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                        {p.isActive
                          ? <ToggleRight size={22} className="text-emerald-500" />
                          : <ToggleLeft size={22} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXCEL IMPORT */}
          {tab === 'import' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">Toplu ürün yükle</p>
                    <p className="text-[12px] text-gray-400 mt-1">CSV veya Excel dosyası ile ürünleri toplu ekle veya güncelle</p>
                  </div>
                  <button onClick={downloadTemplate}
                    className="flex items-center gap-1.5 text-[12px] text-gray-500 px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                    <Download size={13} /> Şablonu indir
                  </button>
                </div>

                <div className="mb-4 bg-gray-50 dark:bg-white/[0.03] rounded-lg p-3.5">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-[0.5px]">Zorunlu kolonlar</p>
                  <div className="flex flex-wrap gap-2">
                    {['urun_adi', 'kategori', 'birim', 'liste_fiyati'].map(c => (
                      <code key={c} className="text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-white/[0.08] text-gray-700 dark:text-gray-300">{c}</code>
                    ))}
                    <span className="text-[11px] text-gray-400">+ opsiyonel: min_adet, aciklama, aktif</span>
                  </div>
                </div>

                <label className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${importing ? 'border-[#F4821F] bg-orange-50 dark:bg-orange-500/10' : 'border-black/[0.1] dark:border-white/[0.1] hover:border-[#F4821F]'}`}>
                  <Upload size={28} className={`mx-auto mb-3 ${importing ? 'text-[#F4821F]' : 'text-gray-300'}`} />
                  <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {importing ? 'Yükleniyor...' : 'CSV veya Excel dosyasını sürükle / tıkla'}
                  </p>
                  <p className="text-[12px] text-gray-400">.csv · .xlsx · Maks 5MB</p>
                  <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                    onChange={handleImport} disabled={importing} />
                </label>
              </div>

              {importResult && (
                <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-5">
                  <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 mb-4">Import sonucu</p>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Toplam satır', value: importResult.totalRows, color: 'text-gray-900 dark:text-gray-100' },
                      { label: 'Eklendi', value: importResult.imported, color: 'text-emerald-600' },
                      { label: 'Güncellendi', value: importResult.updated, color: 'text-blue-600' },
                      { label: 'Hata', value: importResult.errors, color: 'text-red-500' },
                    ].map((m, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-white/[0.03] rounded-lg p-3 text-center">
                        <p className={`text-[20px] font-medium ${m.color}`}>{m.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  {importResult.errorMessages?.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-3">
                      <p className="text-[11px] font-medium text-red-600 mb-1">Hatalar:</p>
                      {importResult.errorMessages.map((e: string, i: number) => (
                        <p key={i} className="text-[11px] text-red-500">{e}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* FİYAT GÜNCELLEME */}
          {tab === 'price' && (
            <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-6 max-w-lg">
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-1">Toplu fiyat güncelleme</p>
              <p className="text-[12px] text-gray-400 mb-5">Tüm ürünlere veya belirli bir kategoriye fiyat işlemi uygula</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori (boş = tüm ürünler)</label>
                  <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]">
                    <option value="">Tüm ürünler</option>
                    <option value="buyuk-format">Büyük format</option>
                    <option value="kartvizit">Kartvizit</option>
                    <option value="sticker">Sticker</option>
                    <option value="tabela">Tabela</option>
                    <option value="promosyon">Promosyon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">İşlem türü</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'PERCENT_INCREASE', label: '% Zam' },
                      { val: 'PERCENT_DECREASE', label: '% İndirim' },
                      { val: 'FIXED_INCREASE', label: '₺ Artış' },
                      { val: 'FIXED_PRICE', label: 'Sabit fiyat' },
                    ].map(o => (
                      <button key={o.val} onClick={() => setBulkType(o.val)}
                        className={`text-[12px] py-2 rounded-lg border transition-colors ${bulkType === o.val ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent' : 'border-black/[0.08] dark:border-white/[0.08] text-gray-500'}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Değer {bulkType.includes('PERCENT') ? '(%)' : '(₺)'}
                  </label>
                  <input type="number" value={bulkValue} min="0"
                    onChange={e => setBulkValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
                </div>

                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3">
                  <p className="text-[12px] text-amber-700 dark:text-amber-400">
                    {bulkType === 'PERCENT_INCREASE' && `Tüm ${bulkCategory || 'ürün'} fiyatları %${bulkValue} artırılacak`}
                    {bulkType === 'PERCENT_DECREASE' && `Tüm ${bulkCategory || 'ürün'} fiyatları %${bulkValue} düşürülecek`}
                    {bulkType === 'FIXED_INCREASE' && `Tüm ${bulkCategory || 'ürün'} fiyatlarına ₺${bulkValue} eklenecek`}
                    {bulkType === 'FIXED_PRICE' && `Tüm ${bulkCategory || 'ürün'} fiyatları ₺${bulkValue} olarak ayarlanacak`}
                  </p>
                </div>

                <button onClick={handleBulkPrice} disabled={bulkLoading}
                  className="w-full bg-[#F4821F] text-white text-[13px] font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  <TrendingUp size={14} />
                  {bulkLoading ? 'Güncelleniyor...' : 'Fiyatları güncelle'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  )
}

export default function UrunlerPage() {
  return <Suspense><UrunlerContent /></Suspense>
}
