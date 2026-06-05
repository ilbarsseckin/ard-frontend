'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Ürünü Seçin & Sepete Ekleyin',
    desc: 'İhtiyacınıza uygun ürünü seçin. Baskı adedi, kağıt kalınlığı, kaplama gibi özellikleri belirleyerek sepetinize ekleyin. Fiyat anında güncellenir.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(244,130,31,0.1)" />
        <path d="M10 13h2l3 12h12l2-8H15" stroke="#F4821F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="28" r="1.5" fill="#F4821F"/>
        <circle cx="25" cy="28" r="1.5" fill="#F4821F"/>
      </svg>
    ),
    color: '#F4821F',
    action: { label: 'Ürünlere Göz At', href: '/urunler' }
  },
  {
    number: '02',
    title: 'Siparişinizi Tamamlayın',
    desc: 'Teslimat adresinizi girin ve ödeme yöntemini seçin. Kredi kartı, banka havalesi / EFT veya BKM Ekspres ile güvenli ödeme yapabilirsiniz.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(99,102,241,0.1)" />
        <rect x="11" y="15" width="18" height="12" rx="2" stroke="#6366F1" strokeWidth="1.8"/>
        <path d="M11 19h18" stroke="#6366F1" strokeWidth="1.8"/>
        <path d="M15 23h4" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: '#6366F1',
    action: null
  },
  {
    number: '03',
    title: 'Tasarımınızı Yükleyin',
    desc: 'Siparişi verdikten sonra tasarım dosyanızı yükleyin. Tasarımınız yoksa "Kendi Tasarla" seçeneğiyle kolayca oluşturabilirsiniz. Uzman ekibimiz dosyayı kontrol eder.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(16,185,129,0.1)" />
        <path d="M20 26V16M20 16l-4 4M20 16l4 4" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 28h14" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    color: '#10B981',
    action: { label: 'Tasarım Kılavuzu', href: '/tasarim-yukleme' }
  },
  {
    number: '04',
    title: 'Hızlı Kargo ile Kapınıza Gelir',
    desc: 'Baskı tamamlandıktan sonra siparişiniz anlaşmalı kargo firmamızla hızlıca gönderilir. Sipariş takip numaranızla kargonuzu anlık izleyebilirsiniz.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="rgba(14,165,233,0.1)" />
        <path d="M10 22h14v-8H10v8zM24 22h6l-2-6h-4v6z" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="25" r="2" stroke="#0EA5E9" strokeWidth="1.5"/>
        <circle cx="27" cy="25" r="2" stroke="#0EA5E9" strokeWidth="1.5"/>
      </svg>
    ),
    color: '#0EA5E9',
    action: null
  }
]

const faqs = [
  {
    q: 'Minimum sipariş adedi nedir?',
    a: 'Ürüne göre değişmekle birlikte çoğu üründe minimum 25-50 adet ile sipariş verebilirsiniz.'
  },
  {
    q: 'Tasarımım yoksa ne yapabilirim?',
    a: 'Sipariş sonrası tasarım desteği alabilir, ya da hazır şablonlarımızı kullanarak kendi tasarımınızı oluşturabilirsiniz.'
  },
  {
    q: 'Ödeme yöntemleri nelerdir?',
    a: 'Kredi kartı (taksit seçeneğiyle), banka havalesi/EFT ve BKM Ekspres ile ödeme yapabilirsiniz.'
  },
  {
    q: 'Kargo süresi ne kadar?',
    a: 'Baskı süresi ürüne göre 1-5 iş günü, kargo ise 1-2 iş günüdür. Ekspres üretim seçeneği de mevcuttur.'
  },
  {
    q: 'Siparişimi iptal edebilir miyim?',
    a: 'Baskı işlemi başlamadan önce iptal mümkündür. Tasarım onayından sonra iptal kabul edilmemektedir.'
  }
]

export default function NasilSiparisPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Rehber</p>
            <h1 className="text-[36px] md:text-[48px] font-black tracking-[-1.5px] mb-4" style={{ color: 'var(--text-primary)' }}>
              Nasıl Sipariş Verebilirim?
            </h1>
            <p className="text-[16px] max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Baskıurunleri.com'da sipariş vermek çok kolay. 4 basit adımda siparişiniz kapınıza gelir.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i}
                className="rounded-2xl p-8 flex gap-6 items-start transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}>
                {/* Number */}
                <div className="flex-shrink-0 hidden sm:block">
                  <span className="text-[48px] font-black leading-none" style={{ color: 'var(--border-strong)', letterSpacing: '-2px' }}>
                    {step.number}
                  </span>
                </div>

                {/* Icon + Content */}
                <div className="flex gap-4 items-start flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[18px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </h2>
                    <p className="text-[14px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {step.desc}
                    </p>
                    {step.action && (
                      <Link href={step.action.href}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold hover:underline"
                        style={{ color: step.color }}>
                        {step.action.label} →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Step indicator mobile */}
                <div className="sm:hidden flex-shrink-0">
                  <span className="text-[11px] font-bold px-2 py-1 rounded-full"
                    style={{ background: `${step.color}20`, color: step.color }}>
                    {step.number}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-[24px] font-black tracking-[-0.5px] mb-8" style={{ color: 'var(--text-primary)' }}>
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 className="text-[14px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {faq.q}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-[24px] font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            Hâlâ sorunuz mu var?
          </h2>
          <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
            Uzman ekibimiz size yardımcı olmaktan mutluluk duyar.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/iletisim"
              className="px-6 py-3 rounded-xl text-[13px] font-bold text-white"
              style={{ background: '#F4821F' }}>
              İletişime Geç
            </Link>
            <Link href="/urunler"
              className="px-6 py-3 rounded-xl text-[13px] font-bold"
              style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
              Ürünlere Göz At
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}