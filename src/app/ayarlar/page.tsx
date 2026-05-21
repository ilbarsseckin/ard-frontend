'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Save, RefreshCw } from 'lucide-react'

export default function AyarlarPage() {
  const [kur, setKur] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/api/settings')
      .then(r => setKur(r.data.data?.usd_kur || '45'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!kur || isNaN(+kur)) { toast.error('Geçerli bir kur girin'); return }
    setSaving(true)
    try {
      await api.post('/api/settings', { usd_kur: kur })
      toast.success('Kur güncellendi')
    } catch { toast.error('Kayıt başarısız') }
    finally { setSaving(false) }
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-[24px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Sistem Ayarları
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Döviz kuru ve genel ayarlar
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-[15px] font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              💱 Döviz Kuru
            </h2>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                  style={{ color: 'var(--text-muted)' }}>USD / TL Kuru</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#F4821F]">$1 =</span>
                  <input
                    type="number"
                    value={kur}
                    onChange={e => setKur(e.target.value)}
                    placeholder="45.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-16 pr-12 py-3.5 rounded-xl text-[16px] font-bold outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-bold"
                    style={{ color: 'var(--text-muted)' }}>₺</span>
                </div>
                <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                  Bu kur fiyat hesaplama robotunda kullanılır
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={load}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--surface)' }}>
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-[#F4821F] text-white text-[13px] font-bold px-6 py-3 rounded-xl hover:bg-[#e07010] transition-colors disabled:opacity-60">
                  <Save size={14} />
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}
