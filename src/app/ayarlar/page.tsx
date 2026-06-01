'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Save, RefreshCw, DollarSign, Info } from 'lucide-react'

export default function AyarlarPage() {
  const [kur, setKur] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/api/settings')
      .then(r => setKur(r.data.data?.usd_kur || '45'))
      .catch(() => toast.error('Ayarlar yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    const num = parseFloat(kur)
    if (!num || isNaN(num) || num <= 0) {
      toast.error('Geçerli bir kur girin')
      return
    }
    setSaving(true)
    try {
      await api.post('/api/settings', { usd_kur: kur })
      toast.success('Kur güncellendi — yeni hesaplamalarda kullanılacak')
    } catch { toast.error('Kayıt başarısız') }
    finally { setSaving(false) }
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-6 py-8">

          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
              Sistem Ayarları
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Döviz kuru ve sistem geneli ayarlar
            </p>
          </div>

          {/* Döviz kuru kartı */}
          <div className="rounded-2xl p-6 mb-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244,130,31,0.12)' }}>
                <DollarSign size={16} className="text-[#F4821F]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  USD / TL Kuru
                </h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Ürün fiyatları USD cinsindendir; müşteriye gösterilirken bu kur uygulanır
                </p>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                  style={{ color: 'var(--text-muted)' }}>Güncel kur</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold"
                    style={{ color: '#F4821F' }}>$1 =</span>
                  <input type="number" value={kur}
                    onChange={e => setKur(e.target.value)}
                    placeholder="45.00" step="0.01" min="0"
                    disabled={loading}
                    className="w-full pl-16 pr-12 py-3.5 rounded-xl text-[16px] font-bold outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-bold"
                    style={{ color: 'var(--text-muted)' }}>₺</span>
                </div>
              </div>

              <button onClick={load}
                title="Yenile"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={handleSave} disabled={saving || loading}
                className="flex items-center gap-2 text-[13px] font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                style={{ background: '#F4821F', color: 'white' }}>
                <Save size={14} />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>

            <div className="mt-4 p-3 rounded-lg flex items-start gap-2 text-[12px]"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div style={{ color: 'var(--text-secondary)' }}>
                Kur değişikliği <strong>yalnızca yeni hesaplamalar</strong> için uygulanır.
                Mevcut sepet ve sipariş fiyatları sabit kalır.
              </div>
            </div>
          </div>

          {/* İleride buraya başka ayar kartları eklenebilir */}

        </div>
      </main>
    </AdminGuard>
  )
}