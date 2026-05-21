'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Calculator, ChevronDown } from 'lucide-react'

const BASKI_TIPLERI = [
  { label: '280 GR VİNİL BASKI',        fiyat: 3.2  },
  { label: '440 GR VİNİL BASKI',        fiyat: 3.8  },
  { label: 'FOLYO',                      fiyat: 4.5  },
  { label: 'ONE WAY VİSİON',            fiyat: 6.0  },
  { label: '440 GR AVRUPA VİNİL BASKI', fiyat: 5.2  },
  { label: 'IŞIKLI AVRUPA VİNİL',       fiyat: 7.5  },
  { label: 'IŞIKLI ÇİN VİNİL',         fiyat: 6.8  },
  { label: 'ARKASI SİYAH AVRUPA VİNİL', fiyat: 5.8  },
  { label: 'MESH VİNİL',                fiyat: 4.2  },
  { label: 'MAT FOLYO',                 fiyat: 4.8  },
  { label: 'ARKASI GRİ FOLYO',         fiyat: 5.0  },
  { label: 'KUMLU FOLYO',              fiyat: 5.5  },
  { label: 'CANVAS',                    fiyat: 5.5  },
  { label: 'RAKET',                     fiyat: 8.0  },
  { label: 'BİLBOARD',                 fiyat: 3.5  },
  { label: 'BAS-KES',                  fiyat: 9.0  },
  { label: 'LAMİNASYON',              fiyat: 2.5  },
  { label: 'ŞEFFAF FOLYO',            fiyat: 5.2  },
  { label: 'LAMİNASYON ve FOLYO',     fiyat: 6.5  },
]

const EK_SECENEKLER = {
  kopca:        { label: 'KOPÇA (4 TARAF)', options: ['YOK', 'VAR (+15₺/m²)'],         fiyat: [0, 15] },
  sopalik:      { label: 'SOPALIK DİKİŞ',  options: ['YOK', 'ÜST', 'ALT', 'İKİSİ'],   fiyat: [0, 8, 8, 14] },
  kolonDikis:   { label: 'KOLON DİKİŞ',   options: ['YOK', 'VAR (+8₺/m²)'],           fiyat: [0, 8] },
  kaynak:       { label: 'KAYNAK',         options: ['YOK', 'VAR (+5₺/m²)'],           fiyat: [0, 5] },
}

export default function HesaplamaSection() {
  const [kur, setKur] = useState(45)
  const [basKiTipi, setBaskiTipi] = useState(0)
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
    const birimFiyatUSD = BASKI_TIPLERI[basKiTipi].fiyat

    // Ek seçenek fiyatları (TL/m²)
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

  return (
    <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Başlık */}
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

          {/* Satır 1 — Baskı tipi */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Baskı Tipi</label>
              <div className="relative">
                <select value={basKiTipi} onChange={e => setBaskiTipi(+e.target.value)}
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
                  ${BASKI_TIPLERI[basKiTipi].fiyat.toFixed(2)} / m²
                </p>
              </div>
            </div>
          </div>

          {/* Satır 2 — Ölçüler */}
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
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder} min="0" step="0.01"
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}

            {/* Toplam m² */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                style={{ color: 'var(--text-muted)' }}>Toplam (m²)</label>
              <div className="px-4 py-3 rounded-xl text-[13px] font-semibold"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {sonuc ? sonuc.m2 : '—'}
              </div>
            </div>
          </div>

          {/* Satır 3 — Ek seçenekler */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(EK_SECENEKLER).map(([key, opt]) => (
              <div key={key}>
                <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                  style={{ color: 'var(--text-muted)' }}>{opt.label}</label>
                <div className="relative">
                  <select
                    value={secenekler[key as keyof typeof secenekler]}
                    onChange={e => setSecenekler(s => ({ ...s, [key]: +e.target.value }))}
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
          <div className="flex items-center gap-6">
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

          <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
            * Fiyatlar KDV hariçtir. Kesin fiyat teklifi için sipariş oluşturun.
          </p>
        </div>
      </div>
    </section>
  )
}
