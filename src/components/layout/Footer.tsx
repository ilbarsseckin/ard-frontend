import Link from 'next/link'
import { Instagram, Linkedin, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">

        {/* CTA */}
        <div className="mb-10 md:mb-14 p-6 md:p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(244,130,31,.12), rgba(244,130,31,.03))',
            border: '1px solid rgba(244,130,31,.15)',
          }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Baskı Siparişinizi Dakikalar İçinde Oluşturun
              </h3>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-muted)' }}>
                Kartvizit, Broşür, Sticker, Bayrak, Promosyon Ürünleri ve Kurumsal Baskı Çözümleri.
              </p>
            </div>
            <Link href="/urunler"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#F4821F,#ff9f47)' }}>
              Ürünleri İncele
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Ana Footer — 5 kolon */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">

          {/* Marka */}
          <div className="col-span-2 lg:col-span-1">
            <Logo className="h-9 mb-4" />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Türkiye'nin online matbaa ve promosyon ürünleri platformu.
              Kaliteli baskı, hızlı üretim ve güvenli teslimat.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <Icon size={18} color="#F4821F" />
                </a>
              ))}
            </div>
          </div>

          {/* Ürünler */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              Ürünler
            </h4>
            <ul className="space-y-3">
              {['Kartvizit', 'Broşür', 'Bayrak', 'Sticker', 'Roll-Up', 'Promosyon'].map(item => (
                <li key={item}>
                  <Link href={`/urunler?q=${encodeURIComponent(item.toLowerCase())}`}
                    className="text-sm transition-all hover:text-[#F4821F]"
                    style={{ color: 'var(--text-muted)' }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              Kurumsal
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/hakkimizda', label: 'Hakkımızda' },
                { href: '/tarihce', label: 'Tarihçe' },
                { href: '/bayilik', label: 'Bayimiz Olun' },
                { href: '/insan-kaynaklari', label: 'İnsan Kaynakları' },
                { href: '/blog', label: 'Blog' },
                { href: '/iletisim', label: 'İletişim' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm transition-all hover:text-[#F4821F]"
                    style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              Yasal
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/iade-kosullari', label: 'İptal ve İade Koşulları' },
                { href: '/gizlilik', label: 'Gizlilik Politikası' },
                { href: '/kullanim-sartlari', label: 'Kullanım Şartları' },
                { href: '/kvkk', label: 'KVKK' },
                { href: '/mesafeli-satis', label: 'Mesafeli Satış Sözleşmesi' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm transition-all hover:text-[#F4821F]"
                    style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>İkitelli Organize Sanayi Bölgesi<br />İstanbul</span>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Phone size={18} />
                <a href="tel:+902125555555" className="hover:text-[#F4821F]">+90 212 555 55 55</a>
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Mail size={18} />
                <a href="mailto:info@baskiurunleri.com" className="hover:text-[#F4821F]">
                  info@baskiurunleri.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs text-center md:text-left" style={{ color: 'var(--text-muted)' }}>
            © 2026 baskiurunleri.com — Tüm hakları saklıdır.
          </span>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/iade-kosullari" className="text-xs hover:text-[#F4821F]" style={{ color: 'var(--text-muted)' }}>
              İptal ve İade
            </Link>
            <Link href="/gizlilik" className="text-xs hover:text-[#F4821F]" style={{ color: 'var(--text-muted)' }}>
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="text-xs hover:text-[#F4821F]" style={{ color: 'var(--text-muted)' }}>
              Kullanım Şartları
            </Link>
            <Link href="/kvkk" className="text-xs hover:text-[#F4821F]" style={{ color: 'var(--text-muted)' }}>
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}