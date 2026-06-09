import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FileText, ShieldCheck, Package, CreditCard, Truck, Phone } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | baskiurunleri.com',
  description: 'baskiurunleri.com mesafeli satış sözleşmesi. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında hazırlanmıştır.',
}

export default function MesafeliSatisPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto">

          {/* Başlık */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-[11px] font-bold uppercase tracking-[2px]"
              style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
              <FileText size={14} />
              Yasal Belge
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-black tracking-[-1px] mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Mesafeli Satış Sözleşmesi
            </h1>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.
            </p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>Son güncelleme: Haziran 2026</p>
          </div>

          <div className="space-y-4 text-[13px] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>

            {/* Madde 1 */}
            <Section title="MADDE 1 – TARAFLAR" icon={ShieldCheck}>
              <p><strong>SATICI:</strong></p>
              <p>Ünvanı: baskiurunleri.com</p>
              <p>Adresi: İkitelli Organize Sanayi Bölgesi, İstanbul</p>
              <p>E-posta: info@baskiurunleri.com</p>
              <p>Telefon: +90 212 555 55 55</p>
              <br />
              <p><strong>ALICI:</strong></p>
              <p>Sipariş formunda belirtilen ad, adres ve iletişim bilgilerine sahip kişi.</p>
            </Section>

            {/* Madde 2 */}
            <Section title="MADDE 2 – KONU" icon={Package}>
              <p>
                İşbu sözleşme, ALICI'nın SATICI'ya ait baskiurunleri.com internet sitesi üzerinden elektronik ortamda siparişini
                verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı
                Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların
                hak ve yükümlülüklerini kapsar.
              </p>
            </Section>

            {/* Madde 3 */}
            <Section title="MADDE 3 – ÜRÜN BİLGİLERİ" icon={Package}>
              <p>
                Sözleşme konusu ürün/ürünler, sipariş özetinde belirtilen ve ALICI tarafından seçilen katalog ürünleridir.
                Ürünlerin temel özellikleri (tür, miktar, marka/model, renk, ebat vb.) ürün sayfasında ve sipariş özetinde
                yer almaktadır. Ürünler, ALICI'nın yüklediği veya onayladığı tasarıma göre özel olarak üretilmektedir.
              </p>
            </Section>

            {/* Madde 4 */}
            <Section title="MADDE 4 – SATIŞ FİYATI VE ÖDEME" icon={CreditCard}>
              <p>
                Ürünün KDV dahil satış fiyatı sipariş özetinde gösterilmektedir. Ödeme; kredi kartı, banka kartı veya
                diğer elektronik ödeme yöntemleriyle yapılabilir. Ödeme işlemi iyzico altyapısı üzerinden 256-bit SSL
                şifreleme ile güvenli şekilde gerçekleştirilir. Kart bilgileri SATICI tarafından saklanmaz.
              </p>
              <p className="mt-2">
                Taksitli alımlarda ilgili banka taksit koşulları geçerlidir. Sipariş toplamı, seçilen taksit sayısına
                bölünerek banka tarafından tahsil edilir.
              </p>
            </Section>

            {/* Madde 5 */}
            <Section title="MADDE 5 – TESLİMAT" icon={Truck}>
              <p>
                Ürünler, ödeme onayının ardından tasarım onay sürecinin tamamlanmasını takiben üretilir ve kargo firması
                aracılığıyla ALICI'nın belirttiği adrese teslim edilir. Teslimat süresi ortalama 3-7 iş günüdür;
                bu süre sipariş yoğunluğuna ve kargo firmasına göre değişebilir.
              </p>
              <p className="mt-2">
                Teslimat adresi ALICI tarafından sipariş formunda beyan edilmiş olup hatalı veya eksik adres bilgisinden
                kaynaklanan gecikmeler SATICI'nın sorumluluğunda değildir.
              </p>
            </Section>

            {/* Madde 6 */}
            <Section title="MADDE 6 – CAYMA HAKKI" icon={ShieldCheck}>
              <p>
                6502 sayılı Kanun'un 15. maddesi ve Mesafeli Sözleşmeler Yönetmeliği'nin 16. maddesi uyarınca;
                tüketicinin istekleri veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan, niteliği
                itibarıyla geri gönderilmeye elverişli olmayan ve çabuk bozulma tehlikesi olan mallarda cayma
                hakkı kullanılamaz.
              </p>
              <p className="mt-2">
                Baskiurunleri.com'da satılan tüm ürünler, ALICI'nın sağladığı veya onayladığı tasarıma göre
                özel üretim olduğundan <strong>cayma hakkı kullanılamaz.</strong>
              </p>
              <p className="mt-2">
                Ancak aşağıdaki durumlarda ALICI, ürünü teslim aldığı tarihten itibaren <strong>3 iş günü</strong> içinde
                şikâyetini bildirerek yeniden üretim veya iade talep edebilir:
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>SATICI'dan kaynaklanan üretim veya baskı hatası</li>
                <li>Sipariş edilenden farklı ürün gönderilmesi</li>
                <li>Kargo sırasında oluşan ve tutanakla belgelenen hasar</li>
              </ul>
            </Section>

            {/* Madde 7 */}
            <Section title="MADDE 7 – GİZLİLİK" icon={ShieldCheck}>
              <p>
                ALICI'ya ait kişisel bilgiler, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında işlenir
                ve üçüncü şahıslarla paylaşılmaz. Ayrıntılı bilgi için{' '}
                <Link href="/gizlilik" className="underline hover:text-[#F4821F]">Gizlilik Politikamızı</Link>
                {' '}inceleyebilirsiniz.
              </p>
            </Section>

            {/* Madde 8 */}
            <Section title="MADDE 8 – UYUŞMAZLIKLARIN ÇÖZÜMÜ" icon={ShieldCheck}>
              <p>
                İşbu sözleşmeden doğabilecek uyuşmazlıklarda, ALICI'nın ikametgahındaki veya satın alma işleminin
                yapıldığı yerdeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Başvuru sınırları
                her yıl Gümrük ve Ticaret Bakanlığı tarafından güncellenmektedir.
              </p>
            </Section>

            {/* Madde 9 */}
            <Section title="MADDE 9 – YÜRÜRLÜK" icon={ShieldCheck}>
              <p>
                ALICI, sipariş işlemini tamamlayarak bu sözleşmeyi okuduğunu, anladığını ve tüm hükümlerini
                kabul ettiğini beyan eder. Sözleşme, siparişin SATICI tarafından onaylanmasıyla yürürlüğe girer.
              </p>
            </Section>

          </div>

          {/* İletişim */}
          <div className="mt-8 rounded-2xl p-6 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Phone size={20} className="mx-auto mb-2" style={{ color: '#F4821F' }} />
            <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Sorularınız mı var?</p>
            <p className="text-[12px] mb-3" style={{ color: 'var(--text-muted)' }}>
              Sözleşme hakkında bilgi almak için bize ulaşın.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a href="mailto:info@baskiurunleri.com"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ background: '#F4821F' }}>
                info@baskiurunleri.com
              </a>
              <Link href="/iletisim"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                İletişim Formu
              </Link>
            </div>
          </div>

          <p className="text-center text-[11px] mt-6" style={{ color: 'var(--text-muted)' }}>
            Bu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(244,130,31,0.04)' }}>
        <Icon size={15} style={{ color: '#F4821F', flexShrink: 0 }} />
        <h2 className="text-[13px] font-black" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      <div className="px-5 py-4 text-[13px] leading-[1.8]" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  )
}