'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  Percent, CreditCard, Headphones, TrendingUp,
  Building2, Phone, MapPin, FileText, CheckCircle2,
  ArrowRight, Loader2, Star, ChevronDown, ChevronUp,
  AlertCircle, Shield, Check
} from 'lucide-react'

const avantajlar = [
  { icon: Percent,    title: '%5\'ten %20\'ye İskonto', desc: 'Aylık ciroya göre kademeli indirim' },
  { icon: CreditCard, title: 'Vadeli Ödeme',            desc: '30-60 gün vade imkânı' },
  { icon: Headphones, title: 'Öncelikli Destek',        desc: 'Özel bayi hattı 08:00-22:00' },
  { icon: TrendingUp, title: 'Ciro Primi',              desc: 'Hedef aşımında ek indirim' },
]

const adimlar = [
  { n: '01', title: 'Başvuru Yapın',     desc: 'Formu doldurun, şartları kabul edin' },
  { n: '02', title: 'İnceleme',          desc: '1-2 iş günü içinde değerlendiriyoruz' },
  { n: '03', title: 'Onay & Aktivasyon', desc: 'Bayi paneliniz aktif, siparişe başlayın' },
]

const iskontoCedveli = [
  { min: 0,      max: 4999,  oran: 5,  vade: '—',    aciklama: 'Başlangıç seviyesi' },
  { min: 5000,   max: 14999, oran: 8,  vade: '15 gün', aciklama: 'Bronz bayi' },
  { min: 15000,  max: 29999, oran: 12, vade: '30 gün', aciklama: 'Gümüş bayi' },
  { min: 30000,  max: 59999, oran: 15, vade: '45 gün', aciklama: 'Altın bayi' },
  { min: 60000,  max: null,  oran: 20, vade: '60 gün', aciklama: 'Platin bayi' },
]

const sartlar = [
  'Bayi olmak için ticaret siciline kayıtlı bir işletmeye sahip olmanız gerekmektedir.',
  'Aylık asgari 5.000 ₺ ciro koşulu aranmaktadır (ilk 3 ay muaf).',
  'Siparişler matbaanın üretim kapasitesine göre önceliklendirilir.',
  'Bayi indirimleri sadece matbaa ürünlerini kapsar; kargo ve kurye ücretleri ayrıca uygulanır.',
  'Vadeli ödemeler için ilk 3 ay peşin ödeme şartı geçerlidir.',
  'Tahsilat gecikmelerinde bayilik statüsü askıya alınabilir.',
  'Bayi bilgileri (firma adı, şehir) onay sonrasında web sitemizde yayınlanabilir.',
  'Bayilik sözleşmesi her iki tarafın 30 gün önceden bildirmesiyle feshedilebilir.',
  'Bayi fiyatları matbaa tarafından önceden haber verilmeksizin güncellenebilir.',
  'Bu başvuruyu göndererek Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında verilerinizin işleneceğini kabul etmiş sayılırsınız.',
]

export default function BayilikPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sartlarAcik, setSartlarAcik] = useState(false)
  const [sartlarOnaylandi, setSartlarOnaylandi] = useState(false)
  const [kvkkOnaylandi, setKvkkOnaylandi] = useState(false)
  const [form, setForm] = useState({
    companyName: '', taxNumber: '', taxOffice: '',
    phone: '', address: '', city: '', district: '',
    estimatedMonthlyRevenue: '',
    businessType: '',
    website: '',
    note: '',
  })

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName || !form.taxNumber || !form.phone || !form.address || !form.city) {
      toast.error('Zorunlu alanları doldurun')
      return
    }
    if (!sartlarOnaylandi || !kvkkOnaylandi) {
      toast.error('Şartları ve KVKK metnini onaylamanız gerekiyor')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/dealer/apply', form)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      const msg = err.response?.data?.message
      if (err.response?.status === 401) {
        toast.error('Başvuru için önce giriş yapmanız gerekiyor')
        router.push('/giris?redirect=/bayilik')
      } else {
        toast.error(msg || 'Başvuru gönderilemedi')
      }
    } finally {
      setLoading(false)
    }
  }

  // Tahmini ciroya göre iskonto sınıfı
  const ciro = parseFloat(form.estimatedMonthlyRevenue) || 0
  const aktifSeviye = iskontoCedveli.findLast(s => ciro >= s.min)

  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="relative overflow-hidden py-24"
          style={{ background: 'linear-gradient(135deg, #0a0c14 0%, #151b2e 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, #F4821F 0%, transparent 55%), radial-gradient(circle at 85% 30%, #3B82F6 0%, transparent 55%)' }} />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-bold tracking-[2px] uppercase"
              style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.25)' }}>
              <Star size={10} fill="#F4821F" /> Bayi Programı 2025
            </div>
            <h1 className="text-[56px] font-black text-white leading-[1.05] tracking-[-2.5px] mb-5">
              Bayimiz Olun,<br />
              <span className="text-[#F4821F]">Birlikte Büyüyelim</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
              Türkiye'nin önde gelen matbaasının yetkili bayisi olun.
              Özel fiyatlar, öncelikli üretim ve kişisel destek ekibiyle kazancınızı katlayın.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#basvuru"
                className="inline-flex items-center gap-2 bg-[#F4821F] text-white font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-[#e07010] transition-all hover:scale-105">
                Hemen Başvur <ArrowRight size={15} />
              </a>
              <a href="#iskonto"
                className="inline-flex items-center gap-2 text-white/60 font-medium text-[13px] px-6 py-3.5 rounded-xl hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                İskonto tablosu
              </a>
            </div>
          </div>
        </section>

        {/* AVANTAJLAR */}
        <section className="py-16 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-4">
            {avantajlar.map((a, i) => (
              <div key={i} className="p-6 rounded-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(244,130,31,0.1)' }}>
                  <a.icon size={20} className="text-[#F4821F]" />
                </div>
                <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* İSKONTO TABLOSU */}
        <section id="iskonto" className="py-14" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-[26px] font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
              Ciro Bazlı İskonto Cetveli
            </h2>
            <p className="text-center text-[13px] mb-8" style={{ color: 'var(--text-muted)' }}>
              Aylık cirona göre kademelenen iskonto oranları otomatik uygulanır.
            </p>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {/* Tablo başlık */}
              <div className="grid grid-cols-5 px-5 py-3 text-[10px] font-bold uppercase tracking-[1px]"
                style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <span>Aylık Ciro</span>
                <span>Seviye</span>
                <span className="text-center">İskonto</span>
                <span className="text-center">Vade</span>
                <span className="text-right">Durum</span>
              </div>

              {iskontoCedveli.map((s, i) => {
                const isAktif = aktifSeviye?.min === s.min && ciro > 0
                return (
                  <div key={i}
                    className="grid grid-cols-5 px-5 py-4 items-center transition-colors"
                    style={{
                      background: isAktif ? 'rgba(244,130,31,0.06)' : 'var(--bg-card)',
                      borderBottom: i < iskontoCedveli.length - 1 ? '1px solid var(--border)' : 'none',
                      borderLeft: isAktif ? '3px solid #F4821F' : '3px solid transparent',
                    }}>
                    <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                      {s.min.toLocaleString('tr-TR')} ₺
                      {s.max ? ` – ${s.max.toLocaleString('tr-TR')} ₺` : ' ve üzeri'}
                    </div>
                    <div className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                      {s.aciklama}
                    </div>
                    <div className="text-center">
                      <span className="text-[16px] font-black text-[#F4821F]">%{s.oran}</span>
                    </div>
                    <div className="text-center text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                      {s.vade}
                    </div>
                    <div className="text-right">
                      {isAktif
                        ? <span className="text-[11px] font-bold text-[#F4821F] flex items-center justify-end gap-1"><Check size={12} /> Seviyeniz</span>
                        : <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>—</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              * İskonto oranları KDV hariç fiyat üzerinden uygulanır. Ciro hesabı her ayın son günü yapılır.
            </p>
          </div>
        </section>

        {/* SÜREÇ */}
        <section className="py-14 max-w-4xl mx-auto px-6">
          <h2 className="text-[24px] font-bold text-center mb-10" style={{ color: 'var(--text-primary)' }}>
            Nasıl Bayi Olunur?
          </h2>
          <div className="grid grid-cols-3 gap-8 relative">
            <div className="absolute top-7 left-[calc(16.6%+28px)] right-[calc(16.6%+28px)] h-px"
              style={{ background: 'var(--border)' }} />
            {adimlar.map((a, i) => (
              <div key={i} className="text-center relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-[18px] font-black text-white shadow-lg"
                  style={{ background: '#F4821F' }}>
                  {a.n}
                </div>
                <p className="text-[15px] font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BAŞVURU FORMU */}
        <section id="basvuru" className="py-16" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-[28px] font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
              Bayi Başvuru Formu
            </h2>
            <p className="text-center text-[13px] mb-8" style={{ color: 'var(--text-muted)' }}>
              Formu doldurun, şartları kabul edin, 1-2 iş günü içinde dönelim.
            </p>

            {submitted ? (
              <div className="text-center py-14 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                </div>
                <h3 className="text-[22px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Başvurunuz Alındı!
                </h3>
                <p className="text-[13px] mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  1-2 iş günü içinde kayıtlı e-posta adresinize dönüş yapacağız.
                  Başvurunuzu hesabım sayfasından takip edebilirsiniz.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/" className="text-[13px] font-medium text-[#F4821F] hover:underline">
                    Ana sayfaya dön
                  </Link>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <Link href="/hesabim" className="text-[13px] font-medium hover:underline" style={{ color: 'var(--text-secondary)' }}>
                    Hesabım
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}
                className="rounded-2xl p-8 space-y-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

                {/* BÖLÜM 1 — Firma */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4 pb-2"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    Firma Bilgileri
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Firma / İşletme adı *
                      </label>
                      <input value={form.companyName} onChange={e => f('companyName', e.target.value)}
                        placeholder="ABC Matbaa Ltd. Şti."
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none focus:ring-2 focus:ring-[#F4821F]/20"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Vergi numarası *
                      </label>
                      <input value={form.taxNumber} onChange={e => f('taxNumber', e.target.value.replace(/\D/g, ''))}
                        placeholder="1234567890" maxLength={11}
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none font-mono"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Vergi dairesi
                      </label>
                      <input value={form.taxOffice} onChange={e => f('taxOffice', e.target.value)}
                        placeholder="Kadıköy VD"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        İş telefonu *
                      </label>
                      <input value={form.phone} onChange={e => f('phone', e.target.value)}
                        placeholder="0212 123 45 67"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Web sitesi
                      </label>
                      <input value={form.website} onChange={e => f('website', e.target.value)}
                        placeholder="www.firmaadi.com"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        İşletme türü
                      </label>
                      <select value={form.businessType} onChange={e => f('businessType', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                        <option value="">Seçiniz</option>
                        <option>Reklam Ajansı</option>
                        <option>Matbaa</option>
                        <option>Baskı & Tasarım Stüdyosu</option>
                        <option>Tanıtım & Organizasyon</option>
                        <option>E-Ticaret</option>
                        <option>Perakende Satış</option>
                        <option>Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Şehir *
                      </label>
                      <input value={form.city} onChange={e => f('city', e.target.value)}
                        placeholder="İstanbul"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        İlçe
                      </label>
                      <input value={form.district} onChange={e => f('district', e.target.value)}
                        placeholder="Kadıköy"
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        İş adresi *
                      </label>
                      <textarea value={form.address} onChange={e => f('address', e.target.value)}
                        placeholder="Mahalle, cadde, sokak, bina no..." rows={2}
                        className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                </div>

                {/* BÖLÜM 2 — Ciro */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4 pb-2"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    Baskı Hacmi
                  </p>
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Tahmini aylık baskı harcaması (₺)
                    </label>
                    <input
                      type="number" min="0" step="500"
                      value={form.estimatedMonthlyRevenue}
                      onChange={e => f('estimatedMonthlyRevenue', e.target.value)}
                      placeholder="Örn: 10000"
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />

                    {/* Ciro göre anlık iskonto göster */}
                    {ciro > 0 && aktifSeviye && (
                      <div className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'rgba(244,130,31,0.08)', border: '1px solid rgba(244,130,31,0.2)' }}>
                        <Percent size={16} className="text-[#F4821F] flex-shrink-0" />
                        <div>
                          <p className="text-[13px] font-bold text-[#F4821F]">
                            %{aktifSeviye.oran} iskonto — {aktifSeviye.aciklama}
                          </p>
                          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            {aktifSeviye.vade !== '—' ? `${aktifSeviye.vade} vade imkânı` : 'Peşin ödeme'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Ek notunuz (opsiyonel)
                    </label>
                    <textarea value={form.note} onChange={e => f('note', e.target.value)}
                      placeholder="Özel talepleriniz, ürün tercihiniz..." rows={2}
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none resize-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>

                {/* BÖLÜM 3 — Şartlar */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[1.5px] mb-4 pb-2"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                    Bayilik Şartları
                  </p>

                  {/* Şartlar aç/kapa */}
                  <button type="button"
                    onClick={() => setSartlarAcik(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors mb-3"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[#F4821F]" />
                      <span className="text-[13px] font-medium">Bayilik Sözleşmesi ve Şartları</span>
                    </div>
                    {sartlarAcik ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {sartlarAcik && (
                    <div className="mb-3 px-4 py-4 rounded-xl text-[12px] leading-[1.8] space-y-1.5"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', maxHeight: 260, overflowY: 'auto' }}>
                      {sartlar.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-bold text-[#F4821F] flex-shrink-0 mt-0.5">{i + 1}.</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Onay kutuları */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        onClick={() => setSartlarOnaylandi(v => !v)}
                        className="mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                        style={{
                          background: sartlarOnaylandi ? '#F4821F' : 'var(--bg-secondary)',
                          border: `2px solid ${sartlarOnaylandi ? '#F4821F' : 'var(--border-strong)'}`,
                        }}>
                        {sartlarOnaylandi && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Bayilik şartlarını, iskonto cetvelini ve sözleşme koşullarını okudum, anladım ve kabul ediyorum.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <div
                        onClick={() => setKvkkOnaylandi(v => !v)}
                        className="mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
                        style={{
                          background: kvkkOnaylandi ? '#F4821F' : 'var(--bg-secondary)',
                          border: `2px solid ${kvkkOnaylandi ? '#F4821F' : 'var(--border-strong)'}`,
                        }}>
                        {kvkkOnaylandi && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        KVKK kapsamında kişisel verilerimin işlenmesine, bayi kaydı amacıyla kullanılmasına ve
                        onay durumunda firma bilgilerimin web sitesinde yayınlanmasına onay veriyorum.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Eksik onay uyarısı */}
                {(!sartlarOnaylandi || !kvkkOnaylandi) && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px]"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#B45309' }}>
                    <AlertCircle size={13} />
                    Göndermek için şartları ve KVKK metnini onaylamanız gerekiyor.
                  </div>
                )}

                <button type="submit"
                  disabled={loading || !sartlarOnaylandi || !kvkkOnaylandi}
                  className="w-full bg-[#F4821F] text-white font-bold text-[14px] py-4 rounded-xl hover:bg-[#e07010] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Gönderiliyor...</>
                    : <>Başvuruyu Gönder — Onaya Sun <ArrowRight size={15} /></>}
                </button>

                <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
                  Başvurunuz inceleme sürecinde. 1-2 iş günü içinde e-posta ile dönüş yapılır.
                </p>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}