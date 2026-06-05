import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hakkımızda | baskıurunleri.com',
  description: '2010\'dan bu yana Türkiye\'nin önde gelen dijital baskı firmalarından biri. İstanbul İkitelli\'deki 1200 m² fabrikamızda büyük format baskıdan kartvizite geniş yelpazede hizmet.',
  alternates: { canonical: 'https://baskiurunleri.com/hakkimizda' },
  openGraph: {
    title: 'Hakkımızda | baskıurunleri.com',
    description: '2010\'dan bu yana Türkiye\'nin önde gelen dijital baskı firmalarından biri.',
    url: 'https://baskiurunleri.com/hakkimizda',
    siteName: 'baskıurunleri.com',
    locale: 'tr_TR',
    type: 'website',
  },
}

const hizmetler = [
  { baslik: 'Kartvizit Baskı', aciklama: 'Standart, kabartmalı, lak veya özel kesim kartvizit seçenekleriyle profesyonel imajınızı güçlendirin.' },
  { baslik: 'Broşür ve El İlanı', aciklama: 'Kampanyalarınızı ve duyurularınızı potansiyel müşterilerinize ulaştırmanın en etkili yolu.' },
  { baslik: 'Afiş ve Poster', aciklama: 'Etkinlikleriniz için geniş formatlı, dikkat çekici ve canlı renklere sahip baskı çözümleri.' },
  { baslik: 'Etiket ve Sticker', aciklama: 'Ürün ambalajlarında ve promasyonlarda kullanabileceğiniz, markanıza görsel iken yapıştırıcı çözümler.' },
  { baslik: 'Büyük Format', aciklama: 'Tabela, roll-up, branda ve dijital baskı ile dış mekân görünürlüğünüzü artırın.' },
  { baslik: 'Kurumsal Dökümanlar', aciklama: 'Antetli kağıt, diplomat zarf ve sunum dosyaları ile ofis şikişinizi tamamlayın.' },
]

const adimlar = [
  {
    no: '01',
    baslik: 'Ürün ve Özellik Seçimi',
    aciklama: 'İhtiyacınız olan ürünü seçin; kağıt gramajı, ebat, selefon türü ve baskı gibi tüm özellikleri belirleyerek fiyatı anlık olarak görüntüleyin.',
  },
  {
    no: '02',
    baslik: 'Tasarım Yükleme veya Oluşturma',
    aciklama: 'Hazır tasarımınızı sisteme yükleyin ya da ücretsiz Online Tasarım Stüdyomuzu kullanarak şablonlardan kendi tasarımınızı dakikalar içinde hazırlayabilirsiniz.',
  },
  {
    no: '03',
    baslik: 'Güvenli Ödeme ve Takip',
    aciklama: 'Siparişinizi onaylayın ve güvenli ödeme işleminizi tamamlayın. Ürününüz kargoya verilene kadar tüm süreç panelinden adım adım takip edin.',
  },
]

const nedenBiz = [
  { baslik: 'Yüksek Baskı Kalitesi', aciklama: 'Baskı makinelerimiz piyasanın ile canlı renkler ve net detaylar garanti ediyoruz.' },
  { baslik: 'Hızlı Teslimat', aciklama: 'Siparişlerinizi belirlenen sürelerde üretip ve korumakta ambalajlayıp kargoya verilir.' },
  { baslik: 'Şeffaf Fiyat Politikası', aciklama: 'Sürpriz ek ücretler olmadan, sipariş anında ne ödeyeceğinizi net olarak bilirsiniz.' },
  { baslik: 'Güvenli Alışveriş', aciklama: '256-bit SSL sertifikası ile ödeme işlemleriniz her zaman güvence altındadır.' },
]

export default function HakkimizdaPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-4">
              baskıurunleri.com Hakkında
            </p>
            <h1 className="text-[36px] md:text-[52px] font-black tracking-[-2px] leading-[1.1] mb-6"
              style={{ color: 'var(--text-primary)' }}>
              Tüm Baskı İhtiyaçlarınız İçin<br />
              <span className="text-[#F4821F]">Yeni Nesil Matbaa</span> Çözümleri
            </h1>
            <p className="text-[16px] leading-[1.8] max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Kurumsal kimliğinizi yansıtan profesyonel materyallerden, kişisel projelerinize kadar tüm baskı süreçlerini tek bir platformda yönetmeye hazır mısınız? <strong style={{ color: 'var(--text-primary)' }}>baskıurunleri.com</strong>, gelişmiş online baskı teknolojisi ile kartvizit, broşür, afiş ve etiket gibi yüzlerce ürünü kapınıza taşıyor.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                { sayi: '15+', label: 'Yıllık Deneyim' },
                { sayi: '50K+', label: 'Mutlu Müşteri' },
                { sayi: '1200m²', label: 'Üretim Alanı' },
                { sayi: '48 Sa.', label: 'Hızlı Teslimat' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-4 text-center"
                  style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
                  <p className="text-[28px] font-black text-[#F4821F] leading-tight">{s.sayi}</p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hizmetler */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-[28px] md:text-[36px] font-black tracking-[-1px] mb-2"
            style={{ color: 'var(--text-primary)' }}>
            Dijital Baskı ve Kurumsal Çözümlerimiz Neleri Kapsar?
          </h2>
          <p className="text-[14px] mb-8 leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>
            Markanızın ihtiyaç duyduğu tüm tanıtım materyalleri, yüksek çözünürlüklü dijital baskı makinelerimizde, hassas renk yönetimi ile üretilmektedir. baskıurunleri.com olarak sunduğumuz popüler hizmetler:
          </p>
          <div className="space-y-3">
            {hizmetler.map((h) => (
              <div key={h.baslik} className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ background: '#F4821F' }}>✓</span>
                <div>
                  <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{h.baslik}: </span>
                  <span className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{h.aciklama}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sipariş adımları */}
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-[28px] md:text-[36px] font-black tracking-[-1px] mb-2"
              style={{ color: 'var(--text-primary)' }}>
              Online Baskı Siparişi Nasıl Verilir?
            </h2>
            <p className="text-[14px] mb-10 leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>
              Matbaa kapılarını aşındırmaya gerek kalmadan, oturduğunuz yerden profesyonel baskı hizmeti alabilirsiniz. baskıurunleri.com'un kullanıcı dostu arayüzü ile sipariş süreci sadece 3 adımda tamamlanır:
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {adimlar.map((a) => (
                <div key={a.no} className="rounded-2xl p-6"
                  style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[13px] text-white mb-4"
                    style={{ background: '#F4821F' }}>
                    {a.no}
                  </div>
                  <h3 className="text-[15px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{a.baslik}</h3>
                  <p className="text-[13px] leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>{a.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasarım yok */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-[28px] md:text-[36px] font-black tracking-[-1px] mb-4"
            style={{ color: 'var(--text-primary)' }}>
            Tasarım Bilgin Yok, Yine de Sipariş Verebilirsin!
          </h2>
          <p className="text-[14px] leading-[1.8] mb-4" style={{ color: 'var(--text-secondary)' }}>
            Kesinlikle! baskıurunleri.com, sadece profesyonel tasarımcılar için değil, herkese hitap eder. Web sitemizde yer alan <strong style={{ color: '#F4821F' }}>ücretsiz online tasarım araçları</strong> sayesinde, binlerce hazır şablon arasından sektörünüze uygun alanı seçebilir; logo, metin ve görsellerinizi düzenleyebilirsiniz. Ayrıca dilerseniz, uzman grafik ekibimizden profesyonel tasarım desteği talep edebilirsiniz.
          </p>
        </div>

        {/* Neden biz */}
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-[28px] md:text-[36px] font-black tracking-[-1px] mb-2"
              style={{ color: 'var(--text-primary)' }}>
              Neden baskıurunleri.com'u Tercih Etmelisiniz?
            </h2>
            <p className="text-[14px] mb-8 leading-[1.7]" style={{ color: 'var(--text-secondary)' }}>
              Türkiye'nin her yerine kargo avantajı ve müşteri memnuniyeti odaklı yaklaşımımızla fark yaratıyoruz.
            </p>
            <div className="space-y-3">
              {nedenBiz.map((n) => (
                <div key={n.baslik} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: '#F4821F' }}>✓</span>
                  <div>
                    <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{n.baslik}: </span>
                    <span className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{n.aciklama}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kapanış CTA */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="rounded-3xl p-10 md:p-14"
            style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
            <p className="text-[14px] leading-[1.8] mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              baskıurunleri.com; kartvizitlerden broşüre, afişten kurumsal evraklara kadar tüm baskı materyal ihtiyaçlarınızda, hız ve kaliteyi bir araya getiren güvenilir çözüm ortağınızdır.
            </p>
            <Link href="/urunler"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[14px] text-white transition-colors"
              style={{ background: '#F4821F' }}>
              Ürünlere Göz At →
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
