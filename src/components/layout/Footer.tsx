import Link from 'next/link'
import { Printer, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-[8px] bg-[#F4821F] flex items-center justify-center">
                <Printer size={13} className="text-white" />
              </div>
              <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                Baskı<span className="text-[#F4821F]">Pro</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
              Türkiye'nin en hızlı online matbaa platformu. Kaliteli baskı, hızlı teslimat.
            </p>
            <div className="flex gap-2 mt-5">
              {[Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:border-[#F4821F]/40"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <Icon size={13} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>

          {[
            { title: 'Ürünler', items: ['Vinil baskı', 'Kartvizit', 'Tabela', 'Sticker', 'Broşür', 'Promosyon'] },
            { title: 'Kurumsal', items: ['Hakkımızda', 'Referanslar', 'Blog', 'Kariyer'] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-[10px] font-bold tracking-[1.5px] mb-4 uppercase" style={{ color: 'var(--text-muted)' }}>
                {col.title}
              </p>
              {col.items.map(l => (
                <span key={l} className="block text-[12px] mb-2 cursor-pointer transition-colors hover:text-[#F4821F]"
                  style={{ color: 'var(--text-secondary)' }}>{l}</span>
              ))}
            </div>
          ))}

          <div>
            <p className="text-[10px] font-bold tracking-[1.5px] mb-4 uppercase" style={{ color: 'var(--text-muted)' }}>
              İletişim
            </p>
            {[
              { Icon: Phone, text: '0212 000 00 00' },
              { Icon: Mail, text: 'info@baskipro.com' },
              { Icon: MapPin, text: 'İkitelli OSB, İstanbul' },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 mb-3">
                <Icon size={11} className="text-[#F4821F] flex-shrink-0" />
                <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-between items-center" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>© 2025 BaskıPro — Tüm hakları saklıdır</span>
          <div className="flex gap-5">
            {['Gizlilik', 'KVKK', 'Kullanım koşulları'].map(l => (
              <span key={l} className="text-[11px] cursor-pointer transition-colors hover:text-[#F4821F]"
                style={{ color: 'var(--text-muted)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
