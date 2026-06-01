import Link from 'next/link'
import { Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Marka kolonu */}
          <div>
            <Logo className="h-8 mb-4" />
            <p className="text-[11px] leading-relaxed max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
              Türkiye'nin en hızlı online matbaa platformu. Kaliteli baskı, hızlı teslimat.
            </p>
            <div className="flex gap-2 mt-5">
              {[Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:border-[#F4821F]/40"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <Icon size={13} style={{ color: 'var(--text-muted)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Ürün kolonu */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: 'var(--text-primary)' }}>Ürünler</h4>
            <ul className="space-y-2">
              {['Kartvizit', 'Broşür', 'Bayrak', 'Sticker', 'Roll-Up', 'Promosyon'].map(item => (
                <li key={item}>
                  <Link href={`/urunler?q=${encodeURIComponent(item.toLowerCase())}`}
                    className="text-[12px] transition-colors hover:text-[#F4821F]"
                    style={{ color: 'var(--text-muted)' }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal kolonu */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: 'var(--text-primary)' }}>Kurumsal</h4>
            <ul className="space-y-2">
              {[
                { href: '/hakkimizda', label: 'Hakkımızda' },
                { href: '/tarihce', label: 'Tarihçe' },
                { href: '/bayilik', label: 'Bayimiz Olun' },
                { href: '/insan-kaynaklari', label: 'İnsan Kaynakları' },
                { href: '/blog', label: 'Blog' },
                { href: '/iletisim', label: 'İletişim' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-[12px] transition-colors hover:text-[#F4821F]"
                    style={{ color: 'var(--text-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim kolonu */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[1px] mb-3" style={{ color: 'var(--text-primary)' }}>İletişim</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                <span>İkitelli OSB, İstanbul</span>
              </li>
              <li className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <Phone size={13} className="flex-shrink-0" />
                <a href="tel:+902125555555" className="hover:text-[#F4821F] transition-colors">
                  +90 212 555 5555
                </a>
              </li>
              <li className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <Mail size={13} className="flex-shrink-0" />
                <a href="mailto:info@baskıurunleri.com" className="hover:text-[#F4821F] transition-colors">
                  info@baskıurunleri.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt çubuk */}
        <div className="pt-6 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            © 2026 baskıurunleri.com — Tüm hakları saklıdır
          </span>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="text-[11px] transition-colors hover:text-[#F4821F]"
              style={{ color: 'var(--text-muted)' }}>
              Gizlilik
            </Link>
            <Link href="/sartlar" className="text-[11px] transition-colors hover:text-[#F4821F]"
              style={{ color: 'var(--text-muted)' }}>
              Kullanım Şartları
            </Link>
            <Link href="/iade" className="text-[11px] transition-colors hover:text-[#F4821F]"
              style={{ color: 'var(--text-muted)' }}>
              İade Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}