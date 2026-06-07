'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ShoppingBag, Palette, UserCircle, CreditCard, XCircle, Package,
  Tag, Sparkles, MessageCircle, Phone, ChevronDown, HelpCircle, Search,
} from 'lucide-react'

const quickCards = [
  { icon: ShoppingBag, title: 'Sipariş Süreçleri', desc: 'Nasıl sipariş verilir?', color: '#F4821F', href: '/nasil-siparis' },
  { icon: Palette, title: 'Tasarım & İade', desc: 'Tasarım yükleme süreci', color: '#16a34a', href: '/tasarim-yukleme' },
  { icon: UserCircle, title: 'Üyelik & Hesap', desc: 'Hesap işlemleri', color: '#2563eb', href: '/hesabim' },
  { icon: CreditCard, title: 'Ödeme & Fatura', desc: 'Ödeme yöntemleri', color: '#9333ea', href: '#odeme' },
  { icon: XCircle, title: 'İptal & İade', desc: 'İade koşulları', color: '#db2777', href: '#iade' },
  { icon: Package, title: 'Ürün Bilgileri', desc: 'Ürün özellikleri', color: '#0891b2', href: '/urunler' },
  { icon: Tag, title: 'Fiyat & Teklif', desc: 'Fiyat hesaplama', color: '#D97706', href: '#fiyat' },
  { icon: Sparkles, title: 'Ücretsiz Tasarım', desc: 'Tasarım desteği', color: '#059669', href: '/tasarim-destegi' },
]

const faqs = [
  { q: 'Adreslerimi nasıl yönetebilirim?', a: 'Hesabım sayfasındaki "Adreslerim" sekmesinden yeni adres ekleyebilir, mevcut adreslerinizi düzenleyebilir veya silebilirsiniz. Varsayılan adres belirleyerek siparişlerinizde otomatik dolmasını sağlayabilirsiniz.' },
  { q: 'Sipariş numaramı nereden öğrenebilirim?', a: 'Siparişinizi tamamladığınızda size bir sipariş numarası verilir. Bu numarayı Hesabım > Siparişlerim sayfasından veya size gönderilen e-postadan bulabilirsiniz.' },
  { q: 'Siparişimi nasıl takip edebilirim?', a: 'Hesabım > Siparişlerim sayfasından siparişinizin güncel durumunu görebilirsiniz. Kargoya verildiğinde takip numarası eklenir ve doğrudan kargo firmasının sayfasından takip edebilirsiniz.' },
  { q: 'Siparişim ne zaman elime ulaşır?', a: 'Tasarım onayından sonra ürünleriniz genellikle 48 saat içinde hazırlanır ve kargoya verilir. Kargo süresi bulunduğunuz şehre göre 1-3 iş günü arasında değişir.' },
  { q: 'Siparişimin durumunu nasıl öğrenebilirim?', a: 'Siparişiniz şu aşamalardan geçer: Ödeme Bekliyor → Onaylandı → Üretimde → Hazır → Kargoda → Teslim Edildi. Her aşamayı Hesabım sayfasından takip edebilirsiniz.' },
  { q: 'Siparişimi iptal edebilir miyim?', a: 'Üretime başlanmamış siparişlerinizi iptal edebilirsiniz. Üretime geçen veya kişiye özel tasarım içeren siparişlerde iptal mümkün olmayabilir. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçin.' },
  { q: 'Tasarımı onayladıktan sonra değişiklik yapabilir miyim?', a: 'Tasarım onayından sonra üretim başladığı için değişiklik yapılamaz. Bu yüzden onay vermeden önce tasarımınızı dikkatlice kontrol etmenizi öneririz.' },
  { q: 'Ödeme yöntemleri nelerdir?', a: 'iyzico altyapısı ile güvenli kredi kartı ve banka kartı ödemesi kabul ediyoruz. Tüm kartlara taksit imkânı sunulmaktadır.' },
  { q: 'Faturamı nasıl alabilirim?', a: 'Siparişiniz tamamlandığında e-faturanız kayıtlı e-posta adresinize gönderilir. Kurumsal fatura için sipariş sırasında firma bilgilerinizi girmeniz yeterlidir.' },
  { q: 'Neden üye olmalıyım?', a: 'Üye olarak siparişlerinizi takip edebilir, adreslerinizi kaydedebilir, geçmiş siparişlerinize ulaşabilir ve kampanyalardan haberdar olabilirsiniz.' },
  { q: 'Tasarım yüklerken nelere dikkat etmeliyim?', a: 'Tasarımınız en az 300 DPI çözünürlükte, CMYK renk modunda ve baskı boyutuna uygun olmalıdır. Yazı tiplerini outline yapmayı ve kenarlarda taşma payı bırakmayı unutmayın.' },
]

export default function YardimPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filteredFaqs = faqs.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>

        {/* Hero */}
        <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-6 py-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'rgba(244,130,31,0.1)' }}>
              <HelpCircle size={28} style={{ color: '#F4821F' }} />
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-black tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Size nasıl yardımcı olabiliriz?
            </h1>
            <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
              Aradığınız cevabı bulamadıysanız bizimle iletişime geçin.
            </p>
            {/* Arama */}
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Yardım konusu ara..."
                className="w-full pl-11 pr-4 py-3 text-[14px] rounded-xl outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Hızlı erişim kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {quickCards.map((card, i) => (
              <Link key={i} href={card.href}
                className="rounded-2xl p-5 text-center transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${card.color}15` }}>
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <h3 className="text-[13px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>

          {/* Popüler Yardım Konuları */}
          <h2 className="text-[20px] font-black mb-5" style={{ color: 'var(--text-primary)' }}>
            Popüler Yardım Konuları
          </h2>
          <div className="space-y-2 mb-12">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
                <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
                  "{search}" ile ilgili sonuç bulunamadı
                </p>
              </div>
            ) : filteredFaqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-[14px] font-semibold pr-4" style={{ color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown size={16}
                    className={`flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    style={{ color: '#F4821F' }} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-[13px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* İletişim kutuları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/iletisim"
              className="rounded-2xl p-6 transition-all hover:shadow-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(244,130,31,0.1)' }}>
                <MessageCircle size={20} style={{ color: '#F4821F' }} />
              </div>
              <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                İletişim Formu
              </h3>
              <p className="text-[12px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Sorularınızı bize iletin, en kısa sürede dönüş yapalım.
              </p>
              <span className="text-[12px] font-bold" style={{ color: '#F4821F' }}>
                BİZE YAZIN →
              </span>
            </Link>

            <a href="https://wa.me/905550000000" target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-6 transition-all hover:shadow-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(37,211,102,0.1)' }}>
                <Phone size={20} style={{ color: '#25D366' }} />
              </div>
              <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                WhatsApp Destek
              </h3>
              <p className="text-[12px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Hızlı yanıt için WhatsApp üzerinden bize ulaşın.
              </p>
              <span className="text-[12px] font-bold" style={{ color: '#25D366' }}>
                BİZE ARAYIN →
              </span>
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}