'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Calculator, ChevronDown, ArrowRight } from 'lucide-react'

const BASKI_TIPLERI = [
  { label: '280 GR VİNİL BASKI',        slug: 'buyuk-format-vinil', fiyat: 3.2  },
  { label: '440 GR VİNİL BASKI',        slug: 'buyuk-format-vinil', fiyat: 3.8  },
  { label: 'FOLYO',                      slug: 'sticker-genel',      fiyat: 4.5  },
  { label: 'ONE WAY VİSİON',            slug: 'sticker-genel',      fiyat: 6.0  },
  { label: '440 GR AVRUPA VİNİL BASKI', slug: 'buyuk-format-vinil', fiyat: 5.2  },
  { label: 'IŞIKLI AVRUPA VİNİL',       slug: 'buyuk-format-vinil', fiyat: 7.5  },
  { label: 'IŞIKLI ÇİN VİNİL',         slug: 'buyuk-format-vinil', fiyat: 6.8  },
  { label: 'ARKASI SİYAH VİNİL',        slug: 'buyuk-format-vinil', fiyat: 5.8  },
  { label: 'MESH VİNİL',                slug: 'buyuk-format-vinil', fiyat: 4.2  },
  { label: 'MAT FOLYO',                 slug: 'sticker-genel',      fiyat: 4.8  },
  { label: 'ARKASI GRİ FOLYO',         slug: 'sticker-genel',      fiyat: 5.0  },
  { label: 'KUMLU FOLYO',              slug: 'sticker-genel',      fiyat: 5.5  },
  { label: 'CANVAS',                    slug: 'buyuk-format-vinil', fiyat: 5.5  },
  { label: 'RAKET',                     slug: 'tabela-forex',       fiyat: 8.0  },
  { label: 'BİLBOARD',                 slug: 'buyuk-format-branda', fiyat: 3.5  },
  { label: 'BAS-KES',                  slug: 'sticker-genel',      fiyat: 9.0  },
  { label: 'LAMİNASYON',              slug: 'buyuk-format-vinil', fiyat: 2.5  },
  { label: 'ŞEFFAF FOLYO',            slug: 'sticker-genel',      fiyat: 5.2  },
  { label: 'LAMİNASYON ve FOLYO',     slug: 'buyuk-format-vinil', fiyat: 6.5  },
]

const EK_SECENEKLER = {
  kopca:      { label: 'KOPÇA (4 TARAF)', options: ['YOK', 'VAR (+15₺/m²)'],       fiyat: [0, 15] },
  sopalik:    { label: 'SOPALIK DİKİŞ',  options: ['YOK', 'ÜST', 'ALT', 'İKİSİ'], fiyat: [0, 8, 8, 14] },
  kolonDikis: { label: 'KOLON DİKİŞ',   options: ['YOK', 'VAR (+8₺/m²)'],         fiyat: [0, 8] },
  kaynak:     { label: 'KAYNAK',         options: ['YOK', 'VAR (+5₺/m²)'],         fiyat: [0, 5] },
}

export default function HesaplamaSection() {
  const router = useRouter()
  const [kur, setKur] = useState(45)
  const [baskiTipi, setBaskiTipi] = useState(0)
  const [yukseklik, setYukseklik] = useState('')
  const [genislik, setGenislik] = useState('')
  const [adet, setAdet] = useState('1')
  const [ekUcret, setEkUcret] = useState('0')
  const [secenekler, setSecenekler] = useState({ kopca: 0, sopalik: 0, kolonDikis: 0, kaynak: 0 })
  const [sonuc, setSonuc] = useState<{ m2: number; usd: number; tl: number } | null>(null)

  useEffect(() => {
    api.get('/api/settings/public')
      .then(r => setKur(parseFloat(r.data.data?.usd_kur || '45')))
      .catch(() => {})
  }, [])

  const hesapla = () => {
    const h = parseFloat(yukseklik)
    const w = parseFloat(genislik)
    const a = parseInt(adet) || 1
    const ek = parseFloat(ekUcret) || 0
    if (!h || !w) return

    const m2 = h * w * a
    const birimFiyatUSD = BASKI_TIPLERI[baskiTipi].fiyat
    const ekTL = (
      EK_SECENEKLER.kopca.fiyat[secenekler.kopca] +
      EK_SECENEKLER.sopalik.fiyat[secenekler.sopalik] +
      EK_SECENEKLER.kolonDikis.fiyat[secenekler.kolonDikis] +
      EK_SECENEKLER.kaynak.fiyat[secenekler.kaynak]
    ) * m2
    const usd = birimFiyatUSD * m2
    const tl = (usd * kur) + ekTL + ek
    setSonuc({ m2: Math.round(m2 * 100) / 100, usd: Math.round(usd * 100) / 100, tl: Math.round(tl) })
  }

  const siparisVer = () => {
    const seciliUrun = BASKI_TIPLERI[baskiTipi]
    const params = new URLSearchParams()
    params.set('urun', seciliUrun.slug)
    if (yukseklik) params.set('boy', String(Math.round(parseFloat(yukseklik) * 100)))
    if (genislik)  params.set('en',  String(Math.round(parseFloat(genislik)  * 100)))
    if (adet)      params.set('adet', adet)
    router.push(`/siparis?${params.toString()}`)
  }

  return (
    <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[2.5px] uppercase font-bold text-[#F4821F] mb-3">Fiyat Hesaplama</p>
            <h2 className="text-[32px] font-bold tracking-[-1px]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              Anlık fiyat hesaplayın
            </h2>
            <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              Ölçülerinizi girin, saniyeler içinde fiyatı görün
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-[11px] font-bold uppercase tracking-[1px]"
              style={{ color: 'var(--text-muted)' }}>USD Kur</span>
            <span className="text-[14px] font-bold text-[#F4821F]">{kur.toFixed(2)} ₺</span>
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Baskı tipi */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Baskı Tipi</label>
              <div className="relative">
                <select value={baskiTipi} onChange={e => { setBaskiTipi(+e.target.value); setSonuc(null) }}
                  className="w-full px-4 py-3 rounded-xl text-[13px] font-semibold outline-none appearance-none cursor-pointer"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  {BASKI_TIPLERI.map((b, i) => (
                    <option key={i} value={i}>{b.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div className="flex items-end">
              <div className="px-4 py-3 rounded-xl w-full"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span className="text-[10px] uppercase tracking-[1px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  Birim Fiyat
                </span>
                <p className="text-[16px] font-bold text-[#F4821F] mt-0.5">
                  ${BASKI_TIPLERI[baskiTipi].fiyat.toFixed(2)} / m²
                </p>
              </div>
            </div>
          </div>

          {/* Ölçüler */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Yükseklik (m)', val: yukseklik, set: setYukseklik, placeholder: '2.00' },
              { label: 'Genişlik (m)',  val: genislik,  set: setGenislik,  placeholder: '3.00' },
              { label: 'Adet',          val: adet,      set: setAdet,      placeholder: '1'    },
              { label: 'Ek Ücret (₺)', val: ekUcret,   set: setEkUcret,   placeholder: '0'    },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                  style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                <input type="number" value={f.val} onChange={e => { f.set(e.target.value); setSonuc(null) }}
                  placeholder={f.placeholder} min="0" step="0.01"
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Toplam (m²)</label>
              <div className="px-4 py-3 rounded-xl text-[13px] font-semibold"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {sonuc ? sonuc.m2 : '—'}
              </div>
            </div>
          </div>

          {/* Ek seçenekler */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(EK_SECENEKLER).map(([key, opt]) => (
              <div key={key}>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                  style={{ color: 'var(--text-muted)' }}>{opt.label}</label>
                <div className="relative">
                  <select
                    value={secenekler[key as keyof typeof secenekler]}
                    onChange={e => { setSecenekler(s => ({ ...s, [key]: +e.target.value })); setSonuc(null) }}
                    className="w-full px-4 py-3 rounded-xl text-[13px] outline-none appearance-none cursor-pointer"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {opt.options.map((o, i) => <option key={i} value={i}>{o}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Hesapla + Sonuç */}
          <div className="flex items-center gap-6 flex-wrap">
            <button onClick={hesapla}
              className="flex items-center gap-2 bg-[#F4821F] text-white text-[14px] font-bold px-10 py-4 rounded-xl hover:bg-[#e07010] transition-colors shadow-sm">
              <Calculator size={16} />
              HESAPLA
            </button>

            {sonuc && (
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="px-5 py-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold" style={{ color: 'var(--text-muted)' }}>Toplam m²</p>
                  <p className="text-[22px] font-bold mt-1" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                    {sonuc.m2} m²
                  </p>
                </div>
                <div className="px-5 py-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold" style={{ color: 'var(--text-muted)' }}>Toplam (USD)</p>
                  <p className="text-[22px] font-bold mt-1" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                    ${sonuc.usd}
                  </p>
                </div>
                <div className="px-5 py-4 rounded-xl border-2 border-[#F4821F]/40"
                  style={{ background: 'rgba(244,130,31,0.06)' }}>
                  <p className="text-[10px] uppercase tracking-[1px] font-bold text-[#F4821F]">Toplam (₺)</p>
                  <p className="text-[28px] font-bold mt-1 text-[#F4821F]" style={{ fontFamily: 'Georgia, serif' }}>
                    ₺{sonuc.tl.toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sipariş ver butonu — sonuç hesaplandıktan sonra çıkar */}
          {sonuc && (
            <div className="mt-5 flex items-center gap-4 pt-5 border-t"
              style={{ borderColor: 'var(--border)' }}>
              <div className="flex-1">
                <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  Bu fiyatla sipariş vermek ister misiniz?
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Seçtiğiniz ürün ve ölçüler otomatik aktarılır.
                </p>
              </div>
              <button
                onClick={siparisVer}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[13px] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Sipariş ver
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
            * Fiyatlar KDV hariçtir. Kesin fiyat teklifi için sipariş oluşturun.
          </p>
        </div>
      </div>
    </section>
  )
}