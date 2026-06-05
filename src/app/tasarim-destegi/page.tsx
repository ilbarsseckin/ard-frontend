'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const services = [
  {
    icon: '🎨',
    title: 'Ücretsiz Tasarım Desteği',
    desc: 'Sipariş verdiğinizde uzman grafiker ekibimiz tasarımınızı ücretsiz olarak hazırlar veya mevcut tasarımınızı baskıya uygun hale getirir.',
    color: '#F4821F',
    badge: 'Ücretsiz'
  },
  {
    icon: '✏️',
    title: 'Tasarım Revizyonu',
    desc: 'Mevcut tasarımınızda renk, yazı, logo gibi değişiklikler yapılmasını istiyorsanız ekibimiz size yardımcı olur.',
    color: '#6366F1',
    badge: null
  },
  {
    icon: '📐',
    title: 'Baskıya Hazırlık',
    desc: 'Tasarım dosyanız baskıya uygun değilse (düşük çözünürlük, yanlış renk modu vb.) ekibimiz dosyayı düzenleyerek hazır hale getirir.',
    color: '#10B981',
    badge: null
  },
  {
    icon: '🖼️',
    title: 'Hazır Şablon',
    desc: 'Ürün bazlı hazır tasarım şablonlarımızı kullanarak kısa sürede kendi tasarımınızı oluşturabilirsiniz.',
    color: '#0EA5E9',
    badge: null
  }
]

const formats = [
  { name: 'PDF', desc: 'Tercih edilen format', recommended: true },
  { name: 'AI', desc: 'Adobe Illustrator', recommended: true },
  { name: 'EPS', desc: 'Vektör format', recommended: false },
  { name: 'PSD', desc: 'Adobe Photoshop', recommended: false },
  { name: 'PNG', desc: 'Min. 300 DPI', recommended: false },
  { name: 'JPEG', desc: 'Min. 300 DPI', recommended: false },
]

const requirements = [
  { icon: '🖨️', title: 'Çözünürlük', desc: 'En az 300 DPI (baskı kalitesi için)' },
  { icon: '🎨', title: 'Renk Modu', desc: 'CMYK (RGB renklerde renk kayması olabilir)' },
  { icon: '✂️', title: 'Taşma Payı', desc: 'Her kenarda 3mm taşma payı bırakın' },
  { icon: '🔤', title: 'Yazı Tipleri', desc: 'Outline/contour yapılmış veya gömülü olmalı' },
  { icon: '📏', title: 'Boyut', desc: 'Ürünün gerçek baskı boyutunda hazırlanmalı' },
  { icon: '📁', title: 'Dosya Boyutu', desc: 'Maksimum 500 MB' },
]

export default function TasarimDestegPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        {/* Hero */}
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Hizmet</p>
            <h1 className="text-[36px] md:text-[48px] font-black tracking-[-1.5px] mb-4" style={{ color: 'var(--text-primary)' }}>
              Ücretsiz Tasarım Desteği
            </h1>
            <p className="text-[16px] max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tasarımınız olmasa da sorun değil. Uzman grafiker ekibimiz siparişinizle birlikte 
              tasarımınızı ücretsiz olarak hazırlar.
            </p>
            <Link href="/iletisim"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-[14px] font-bold text-white"
              style={{ background: '#F4821F' }}>
              Tasarım Desteği Al →
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">

          {/* Hizmetler */}
          <h2 className="text-[22px] font-black tracking-[-0.5px] mb-6" style={{ color: 'var(--text-primary)' }}>
            Neler yapabiliriz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {services.map((s, i) => (
              <div key={i} className="rounded-2xl p-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[28px]">{s.icon}</span>
                  {s.badge && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                      {s.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-[15px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {s.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Desteklenen Formatlar */}
          <h2 className="text-[22px] font-black tracking-[-0.5px] mb-6" style={{ color: 'var(--text-primary)' }}>
            Desteklenen Dosya Formatları
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16">
            {formats.map((f, i) => (
              <div key={i} className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: f.recommended ? 'rgba(244,130,31,0.05)' : 'var(--bg-card)',
                  border: f.recommended ? '1.5px solid rgba(244,130,31,0.3)' : '1px solid var(--border)'
                }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-black"
                  style={{
                    background: f.recommended ? 'rgba(244,130,31,0.15)' : 'var(--bg-secondary)',
                    color: f.recommended ? '#F4821F' : 'var(--text-secondary)'
                  }}>
                  {f.name}
                </div>
                <div>
                  <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
                {f.recommended && (
                  <span className="ml-auto text-[9px] font-bold text-[#F4821F]">✓ Önerilen</span>
                )}
              </div>
            ))}
          </div>

          {/* Gereksinimler */}
          <h2 className="text-[22px] font-black tracking-[-0.5px] mb-6" style={{ color: 'var(--text-primary)' }}>
            Tasarım Gereksinimleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-16">
            {requirements.map((r, i) => (
              <div key={i} className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span className="text-[22px] flex-shrink-0">{r.icon}</span>
                <div>
                  <p className="text-[13px] font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Süreç */}
          <div className="rounded-2xl p-8"
            style={{ background: 'rgba(244,130,31,0.04)', border: '1px solid rgba(244,130,31,0.2)' }}>
            <h2 className="text-[18px] font-black mb-6" style={{ color: '#F4821F' }}>
              Tasarım Desteği Nasıl İşler?
            </h2>
            <div className="space-y-4">
              {[
                { step: '1', text: 'Siparişinizi verin ve ödemeyi tamamlayın.' },
                { step: '2', text: 'Tasarım yükleme adımında "Uzman Grafiker Kontrolü" seçeneğini seçin.' },
                { step: '3', text: 'Nasıl bir tasarım istediğinizi (logo, slogan, renkler) iletişim alanına yazın.' },
                { step: '4', text: 'Grafiker ekibimiz 2-4 saat içinde tasarım önerisini hazırlayarak size iletir.' },
                { step: '5', text: 'Onay verdiğinizde baskı sürecine alınır.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
                    style={{ background: '#F4821F' }}>
                    {item.step}
                  </div>
                  <p className="text-[13px] pt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CTA */}
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <h2 className="text-[20px] font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              Hemen sipariş verin, tasarımı bize bırakın.
            </h2>
            <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
              Profesyonel tasarım ekibimiz sizin için çalışmaya hazır.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/urunler"
                className="px-6 py-3 rounded-xl text-[13px] font-bold text-white"
                style={{ background: '#F4821F' }}>
                Sipariş Ver
              </Link>
              <Link href="/iletisim"
                className="px-6 py-3 rounded-xl text-[13px] font-bold"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}