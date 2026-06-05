'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2, CheckCircle2 } from 'lucide-react'

const WA_NUMBER = '905XXXXXXXXX' // ← WhatsApp numaranı buraya yaz (başında 90, boşluksuz)
const WA_URL = (mesaj: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(mesaj)}`

const KONULAR = [
  'Fiyat Teklifi',
  'Sipariş Takibi',
  'Tasarım Desteği',
  'Teknik Sorun',
  'Bayi / İş Birliği',
  'Diğer',
]

export default function IletisimPage() {
  const [form, setForm] = useState({
    adSoyad: '', email: '', telefon: '', konu: 'Fiyat Teklifi', mesaj: '',
  })
  const [loading, setLoading] = useState(false)
  const [gonderildi, setGonderildi] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.adSoyad || !form.email || !form.mesaj) {
      toast.error('Ad soyad, e-posta ve mesaj zorunludur.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/contact', form)
      setGonderildi(true)
      toast.success('Mesajınız iletildi!')
    } catch {
      toast.error('Gönderilemedi, WhatsApp\'tan ulaşabilirsiniz.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    const wa = `Merhaba! Ben ${form.adSoyad || 'bir müşteri'}.${form.konu ? ` Konu: ${form.konu}.` : ''}${form.mesaj ? ` ${form.mesaj}` : ''}`
    window.open(WA_URL(wa), '_blank')
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">İletişim</p>
            <h1 className="text-[38px] md:text-[48px] font-black tracking-[-2px] leading-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Size nasıl yardımcı olabiliriz?
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Formu doldurun, WhatsApp'tan yazın ya da doğrudan arayın — en kısa sürede dönüş yaparız.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-6">

            {/* Sol — İletişim bilgileri + WhatsApp */}
            <div className="space-y-4">

              {/* WhatsApp butonu */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#25D366', border: 'none' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <MessageCircle size={24} color="white" />
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-black text-white">WhatsApp ile Yaz</p>
                  <p className="text-[12px] text-white opacity-80">Anında cevap alın</p>
                </div>
                <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              {/* İletişim kartları */}
              {[
                { icon: Phone, label: 'Telefon', value: '0212 000 00 00', href: 'tel:02120000000' },
                { icon: Mail, label: 'E-posta', value: 'info@baskiurunleri.com', href: 'mailto:info@baskiurunleri.com' },
                { icon: MapPin, label: 'Adres', value: 'İkitelli OSB, Atatürk Blv. No:1, İstanbul', href: undefined },
                { icon: Clock, label: 'Çalışma Saatleri', value: 'Pzt–Cmt: 08:00–18:00', href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label}
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(244,130,31,0.1)' }}>
                    <Icon size={17} color="#F4821F" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[1.5px]"
                      style={{ color: 'var(--text-muted)' }}>{label}</p>
                    {href ? (
                      <a href={href} className="text-[13px] font-semibold hover:text-[#F4821F] transition-colors"
                        style={{ color: 'var(--text-primary)' }}>{value}</a>
                    ) : (
                      <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ — Form */}
            <div className="rounded-3xl p-6 md:p-8"
              style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>

              {gonderildi ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: 'rgba(16,185,129,0.1)' }}>
                    <CheckCircle2 size={36} className="text-emerald-500" />
                  </div>
                  <h2 className="text-[22px] font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                    Mesajınız İletildi!
                  </h2>
                  <p className="text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
                    En kısa sürede size dönüş yapacağız.
                  </p>
                  <button onClick={() => { setGonderildi(false); setForm({ adSoyad: '', email: '', telefon: '', konu: 'Fiyat Teklifi', mesaj: '' }) }}
                    className="px-6 py-2.5 rounded-xl text-[13px] font-bold"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Yeni mesaj gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-[20px] font-black mb-5" style={{ color: 'var(--text-primary)' }}>
                    Mesaj Gönderin
                  </h2>

                  {/* Ad Soyad + Telefon */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                        style={{ color: 'var(--text-muted)' }}>Ad Soyad *</label>
                      <input value={form.adSoyad} onChange={e => set('adSoyad', e.target.value)}
                        placeholder="Ahmet Yılmaz"
                        className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
                        style={{ background: 'var(--bg-secondary)', border: form.adSoyad ? '1.5px solid #F4821F' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                        style={{ color: 'var(--text-muted)' }}>Telefon</label>
                      <input value={form.telefon} onChange={e => set('telefon', e.target.value)}
                        placeholder="0532 000 00 00" type="tel"
                        className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                      style={{ color: 'var(--text-muted)' }}>E-posta *</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="ornek@email.com" type="email"
                      className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
                      style={{ background: 'var(--bg-secondary)', border: form.email ? '1.5px solid #F4821F' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>

                  {/* Konu */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                      style={{ color: 'var(--text-muted)' }}>Konu</label>
                    <select value={form.konu} onChange={e => set('konu', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      {KONULAR.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  {/* Mesaj */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 block"
                      style={{ color: 'var(--text-muted)' }}>Mesajınız *</label>
                    <textarea value={form.mesaj} onChange={e => set('mesaj', e.target.value)}
                      placeholder="Merhaba, kartvizit baskısı için fiyat almak istiyorum..."
                      rows={5}
                      className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
                      style={{ background: 'var(--bg-secondary)', border: form.mesaj ? '1.5px solid #F4821F' : '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>

                  {/* Butonlar */}
                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-white disabled:opacity-60 transition-all"
                      style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)' }}>
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                      {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    </button>
                    <button type="button" onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90"
                      style={{ background: '#25D366' }}>
                      <MessageCircle size={15} />
                      WhatsApp
                    </button>
                  </div>

                  <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
                    Mesajınız e-posta olarak iletilecek. Ortalama yanıt süresi 2 saattir.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
