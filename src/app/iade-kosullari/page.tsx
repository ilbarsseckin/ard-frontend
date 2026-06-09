import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, AlertCircle, CheckCircle, XCircle, Clock, Phone } from 'lucide-react'

export const metadata = {
  title: 'İptal ve İade Koşulları | baskıurunleri.com',
  description: 'baskıurunleri.com iptal, iade ve cayma hakkı koşulları. Kişiye özel üretim ürünlerinde iade politikası.',
}

const sections = [
  {
    icon: ShieldCheck,
    color: '#F4821F',
    title: '1. Genel Bilgi',
    content: `baskıurunleri.com üzerinden satın aldığınız ürünler, Mesafeli Satış Sözleşmesi kapsamında değerlendirilmektedir. Siparişleriniz, tarafınızca onaylanan tasarıma göre özel olarak üretilmektedir.

6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 15. maddesi uyarınca; tüketicinin istekleri veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan, niteliği itibarıyla geri gönderilmeye elverişli olmayan ve çabuk bozulma tehlikesi olan ürünlerde cayma hakkı kullanılamaz.`,
  },
  {
    icon: XCircle,
    color: '#DC2626',
    title: '2. Cayma Hakkı Kullanılamayan Durumlar',
    content: `Aşağıdaki durumlarda cayma hakkı ve iade talepleri kabul edilmez:

• Müşteriye özel tasarım ile üretilen tüm baskı ürünleri (kartvizit, broşür, tabela, bayrak vb.)
• Müşteri tarafından yüklenen tasarımdan kaynaklanan hatalar (düşük çözünürlük, yanlış yazım, renk tercihi)
• Sipariş onaylandıktan sonra tasarım değişikliği talepleri
• Kişisel tercih değişikliği veya fikir değişikliği
• Ekran rengi ile baskı rengi arasındaki doğal farklılıklar (renk profili farklılıkları)
• Ürünün kullanılmış, açılmış veya zarar görmüş olması`,
  },
  {
    icon: CheckCircle,
    color: '#16A34A',
    title: '3. İade Kabul Edilen Durumlar',
    content: `Aşağıdaki durumlarda ücretsiz yeniden üretim veya iade hakkınız bulunmaktadır:

• Tarafımızdan kaynaklanan üretim hatası (baskı kayması, renk bozukluğu, hatalı kesim)
• Sipariş ettiğinizden farklı ürün veya miktar gönderilmesi
• Kargo sırasında meydana gelen fiziksel hasar (kargo firmasından tutanak alınmış olması şartıyla)
• Yanlış ebatta üretim yapılması

Bu durumlarda iade veya yeniden üretim tamamen ücretsizdir.`,
  },
  {
    icon: Clock,
    color: '#2563EB',
    title: '4. Şikayet ve İade Süreci',
    content: `Ürününüzü teslim aldıktan sonra:

1. Ürünü teslim aldığınız gün kontrol edin
2. Sorun tespit etmeniz halinde 3 iş günü içinde bize ulaşın
3. Sorunu gösteren fotoğraf veya video gönderin
4. Sipariş numaranızı bildirin

3 iş günü geçtikten sonra yapılan şikayet talepleri değerlendirilemez.

Bize ulaşmak için:
• WhatsApp: 0552 230 33 33
• E-posta: destek@baskiurunleri.com
• Canlı destek: baskiurunleri.com`,
  },
  {
    icon: AlertCircle,
    color: '#F59E0B',
    title: '5. Tasarım Sorumluluğu',
    content: `Müşteri olarak yüklediğiniz tasarım dosyasından doğan tüm sorumluluk size aittir:

• Tasarımın içeriği ve doğruluğu
• Telif hakkı ve marka ihlalleri
• Baskıya uygunluk (çözünürlük, renk modu, ebat)
• Yazım hataları ve içerik yanlışlıkları

Tasarım desteği hizmetimizde ekibimiz öneriler sunar, ancak nihai onay müşteriden alınır. Onaylanan tasarımdan kaynaklanan hatalar iade kapsamı dışındadır.`,
  },
  {
    icon: ShieldCheck,
    color: '#6366F1',
    title: '6. Renk Politikası',
    content: `Dijital ekranlar ve baskı makineleri farklı renk profillerine (RGB ve CMYK) sahiptir. Bu nedenle:

• Ekranda gördüğünüz renk ile baskı rengi arasında küçük farklılıklar olabilir
• Bu durum teknik bir gereklilik olup iade gerekçesi sayılmaz
• Özel renk (Pantone/spot renk) taleplerinizi sipariş notlarına belirtin
• Renk hassasiyeti gerektiren işler için baskı öncesi renk proofı talep edebilirsiniz`,
  },
]

export default function IadeKosullariPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto">

          {/* Başlık */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-[11px] font-bold uppercase tracking-[2px]"
              style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
              <ShieldCheck size={14} />
              Tüketici Hakları
            </div>
            <h1 className="text-[28px] sm:text-[36px] font-black tracking-[-1px] mb-3"
              style={{ color: 'var(--text-primary)' }}>
              İptal ve İade Koşulları
            </h1>
            <p className="text-[14px] leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Siparişleriniz kişiye özel üretildiğinden, aşağıdaki koşulları dikkatlice incelemenizi rica ederiz.
            </p>
            <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
              Son güncelleme: Haziran 2026
            </p>
          </div>

          {/* Özet kartlar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <XCircle size={24} className="mx-auto mb-2 text-red-600" />
              <p className="text-[13px] font-bold text-red-700">Cayma Hakkı</p>
              <p className="text-[11px] mt-1 text-red-600">Özel üretimde geçersiz</p>
            </div>
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
              <p className="text-[13px] font-bold text-green-700">Üretim Hatası</p>
              <p className="text-[11px] mt-1 text-green-600">Ücretsiz yeniden üretim</p>
            </div>
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <Clock size={24} className="mx-auto mb-2 text-blue-600" />
              <p className="text-[13px] font-bold text-blue-700">Şikayet Süresi</p>
              <p className="text-[11px] mt-1 text-blue-600">Teslimattan 3 iş günü</p>
            </div>
          </div>

          {/* Bölümler */}
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 px-5 py-4"
                  style={{ borderBottom: '1px solid var(--border)', background: `${s.color}08` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.color}15` }}>
                    <s.icon size={18} style={{ color: s.color }} />
                  </div>
                  <h2 className="text-[15px] font-black" style={{ color: 'var(--text-primary)' }}>
                    {s.title}
                  </h2>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[13px] leading-[1.8] whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                    {s.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* İletişim CTA */}
          <div className="mt-8 rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)' }}>
            <Phone size={24} className="mx-auto mb-3 text-white" />
            <h3 className="text-[18px] font-black text-white mb-2">Sorunuz mu var?</h3>
            <p className="text-[13px] text-white/80 mb-4">
              İade ve şikayet süreçleri için 7/24 WhatsApp destek hattımıza ulaşabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/905522303333"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold bg-white text-[#F4821F] hover:opacity-90 transition-all">
                WhatsApp ile Ulaş
              </a>
              <Link href="/iletisim"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                İletişim Formu
              </Link>
            </div>
          </div>

          <p className="text-center text-[11px] mt-6" style={{ color: 'var(--text-muted)' }}>
            Bu sayfa 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili yönetmelikler çerçevesinde hazırlanmıştır.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}