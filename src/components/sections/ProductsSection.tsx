'use client'
import Link from 'next/link'
import { ArrowRight, Image, CreditCard, Star, SignpostBig, FileText, Gift } from 'lucide-react'

const products = [
  {
    icon: Image, name: 'Büyük format baskı', slug: 'buyuk-format-vinil',
    desc: 'Vinil, branda, poster, araç giydirme. UV ve solvent mürekkep.',
    price: '₺185/m²\'den', badge: 'En çok tercih',
    color: '#378ADD', bg: 'rgba(55,138,221,0.1)', big: true,
    tags: ['Vinil', 'Branda', 'Araç giydirme'],
  },
  {
    icon: CreditCard, name: 'Kartvizit', slug: 'kartvizit-350g',
    desc: '350g mat/parlak, selofan, kabartma seçeneği',
    price: '₺180 / 250 adet', color: '#1D9E75', bg: 'rgba(29,158,117,0.1)',
  },
  {
    icon: Star, name: 'Sticker & etiket', slug: 'sticker-genel',
    desc: 'Özel kesim, şeffaf, mat, parlak seçenekleri',
    price: '₺2.5 / adetten', color: '#BA7517', bg: 'rgba(186,117,23,0.1)',
  },
  {
    icon: SignpostBig, name: 'Tabela & levha', slug: 'tabela-forex',
    desc: 'Forex, alüminyum, pleksi, ışıklı kutu',
    price: '₺120 / m²\'den', color: '#534AB7', bg: 'rgba(83,74,183,0.1)',
  },
  {
    icon: FileText, name: 'Broşür & flyer', slug: 'brosur-a5',
    desc: 'A4, A5, DL, üçlü katlama seçeneği',
    price: '₺95 / 100 adetten', color: '#D4537E', bg: 'rgba(212,83,126,0.1)',
  },
  {
    icon: Gift, name: 'Promosyon', slug: 'promosyon-kupa',
    desc: 'Kupa, kalem, bez çanta ve daha fazlası',
    price: '₺35\'ten', color: '#F4821F', bg: 'rgba(244,130,31,0.1)',
  },
]

export default function ProductsSection() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">

      {/* Başlık */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Ürünler</p>
          <h2 className="text-[32px] font-bold tracking-[-1px]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
            Ne basmak istiyorsun?
          </h2>
          <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>
            Ürünü seç, anlık fiyat hesapla
          </p>
        </div>
        <Link href="/urunler"
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#F4821F] hover:gap-3 transition-all duration-200">
          Tüm ürünler <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {products.map((p) => (
          <Link key={p.slug} href={`/siparis?urun=${p.slug}`}
            className={`group card-hover block rounded-2xl p-5 cursor-pointer ${p.big ? 'col-span-2 flex items-center gap-5' : ''}`}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            <div className={`${p.big ? 'w-16 h-16 flex-shrink-0' : 'w-11 h-11 mb-4'} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}
              style={{ background: p.bg }}>
              <p.icon size={p.big ? 26 : 20} style={{ color: p.color }} />
            </div>

            <div className="flex-1 min-w-0">
              {p.badge && (
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg mb-2"
                  style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
                  {p.badge}
                </span>
              )}
              <div className={`font-bold mb-1.5 ${p.big ? 'text-[16px]' : 'text-[14px]'}`}
                style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                {p.name}
              </div>
              <div className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                {p.desc}
              </div>
              {p.big && p.tags && (
                <div className="flex gap-1.5 mb-3">
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
                      style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{p.price}</span>
                <ArrowRight size={13} className="text-[#F4821F] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
