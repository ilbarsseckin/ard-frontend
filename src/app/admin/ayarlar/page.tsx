'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Save, RefreshCw, DollarSign, Info, Bell, Phone, Mail, Clock } from 'lucide-react'
import AdminSoundSettings from '@/components/admin/AdminSoundSettings'

export default function AyarlarPage() {
  const [kur, setKur] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Bildirim ayarları
  const [adminPhones, setAdminPhones] = useState('')
  const [adminEmails, setAdminEmails] = useState('')
  const [delayDays, setDelayDays] = useState('3')
  const [notifSaving, setNotifSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/api/settings'),
      api.get('/api/admin/settings/notifications').catch(() => ({ data: { data: {} } })),
    ]).then(([settRes, notifRes]) => {
      setKur(settRes.data.data?.usd_kur || '45')
      const n = notifRes.data.data || {}
      setAdminPhones(n.admin_notification_phones || '')
      setAdminEmails(n.admin_notification_emails || '')
      setDelayDays(n.delay_alert_threshold_days || '3')
    }).catch(() => toast.error('Ayarlar yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    const num = parseFloat(kur)
    if (!num || isNaN(num) || num <= 0) { toast.error('Geçerli bir kur girin'); return }
    setSaving(true)
    try {
      await api.post('/api/settings', { usd_kur: kur })
      toast.success('Kur güncellendi')
    } catch { toast.error('Kayıt başarısız') }
    finally { setSaving(false) }
  }

  const handleSaveNotif = async () => {
    setNotifSaving(true)
    try {
      await api.post('/api/admin/settings/notifications', {
        admin_notification_phones: adminPhones,
        admin_notification_emails: adminEmails,
        delay_alert_threshold_days: delayDays,
      })
      toast.success('Bildirim ayarları kaydedildi')
    } catch { toast.error('Kayıt başarısız') }
    finally { setNotifSaving(false) }
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">

          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
              Sistem Ayarları
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Döviz kuru, bildirimler ve sistem geneli ayarlar
            </p>
          </div>

          {/* USD/TL Kuru */}
          <div className="rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244,130,31,0.12)' }}>
                <DollarSign size={16} className="text-[#F4821F]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>USD / TL Kuru</h2>
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
                  <input type="number" value={kur} onChange={e => setKur(e.target.value)}
                    placeholder="45.00" step="0.01" min="0" disabled={loading}
                    className="w-full pl-16 pr-12 py-3.5 rounded-xl text-[16px] font-bold outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-bold"
                    style={{ color: 'var(--text-muted)' }}>₺</span>
                </div>
              </div>
              <button onClick={load}
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={handleSave} disabled={saving || loading}
                className="flex items-center gap-2 text-[13px] font-bold px-6 py-3 rounded-xl disabled:opacity-60"
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
                Mevcut sipariş fiyatları sabit kalır.
              </div>
            </div>
          </div>

          {/* Bildirim Ayarları */}
          <div className="rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244,130,31,0.12)' }}>
                <Bell size={16} className="text-[#F4821F]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>SMS ve Email Bildirimleri</h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Yeni sipariş ve gecikme uyarıları için admin iletişim bilgileri
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Admin telefon numaraları */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1.5"
                  style={{ color: 'var(--text-muted)' }}>
                  <Phone size={11} /> Admin Telefon Numaraları
                </label>
                <input value={adminPhones}
                  onChange={e => setAdminPhones(e.target.value)}
                  placeholder="05XXXXXXXXX, 05XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Virgülle ayırın. Yeni sipariş ve ödeme gelince bu numaralara SMS gönderilir.
                </p>
              </div>

              {/* Admin email adresleri */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1.5"
                  style={{ color: 'var(--text-muted)' }}>
                  <Mail size={11} /> Admin Email Adresleri
                </label>
                <input value={adminEmails}
                  onChange={e => setAdminEmails(e.target.value)}
                  placeholder="admin@baskiurunleri.com, info@baskiurunleri.com"
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Virgülle ayırın. Yeni sipariş detayları bu adreslere email olarak gönderilir.
                </p>
              </div>

              {/* Gecikme eşiği */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1.5"
                  style={{ color: 'var(--text-muted)' }}>
                  <Clock size={11} /> Gecikme Uyarısı Eşiği (gün)
                </label>
                <div className="flex items-center gap-3">
                  <input type="number" value={delayDays}
                    onChange={e => setDelayDays(e.target.value)}
                    min="1" max="30" placeholder="3"
                    className="w-24 px-4 py-3 rounded-xl text-[14px] font-bold outline-none text-center"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    Ödeme alınmış sipariş bu kadar gün sonra hala teslim edilmemişse uyarı gönderilir.
                    Her sabah 09:00'da kontrol edilir.
                  </p>
                </div>
              </div>

              <button onClick={handleSaveNotif} disabled={notifSaving}
                className="flex items-center gap-2 text-[13px] font-bold px-6 py-3 rounded-xl disabled:opacity-60"
                style={{ background: '#F4821F', color: 'white' }}>
                <Save size={14} />
                {notifSaving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
              </button>
            </div>
          </div>

          {/* Ses Bildirimi */}
          <AdminSoundSettings />

        </div>
      </main>
    </AdminGuard>
  )
}
