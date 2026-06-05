'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface InstallmentPrice {
  installmentNumber: number
  installmentPrice: number
  totalPrice: number
}

interface BankDetail {
  bankName: string
  bankCode: string
  installmentPrices: InstallmentPrice[]
}

const BANKA_RENK: Record<string, string> = {
  'Garanti':       '#00863A',
  'Ziraat':        '#E30613',
  'Akbank':        '#E20714',
  'İş Bankası':    '#005CA9',
  'Yapı Kredi':    '#00529B',
  'Halkbank':      '#009639',
  'Vakıfbank':     '#FDB913',
  'Finansbank':    '#FF6600',
  'QNB':           '#FF6600',
  'Denizbank':     '#003DA5',
  'TEB':           '#0066B3',
  'ING':           '#FF6200',
  'HSBC':          '#DB0011',
}

function getBankaRenk(isim: string): string {
  for (const [key, renk] of Object.entries(BANKA_RENK)) {
    if (isim.toLowerCase().includes(key.toLowerCase())) return renk
  }
  return '#F4821F'
}

function getBankaHarf(isim: string): string {
  const temiz = isim.replace(/bank|a\.ş\.|bankası/gi, '').trim()
  return temiz.substring(0, 2).toUpperCase()
}

interface Props {
  fiyat: number
}

export default function TaksitTablosu({ fiyat }: Props) {
  const [bankalar, setBankalar] = useState<BankDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [hata, setHata] = useState(false)
  const [secilenBanka, setSecilenBanka] = useState(0)

  useEffect(() => {
    const tutar = Math.max(fiyat, 100)
    api.get(`/api/installment?price=${tutar}`)
      .then(r => {
        if (r.data.success && r.data.data?.length > 0) {
          setBankalar(r.data.data)
        } else {
          setHata(true)
        }
      })
      .catch(() => setHata(true))
      .finally(() => setLoading(false))
  }, [fiyat])

  if (hata) return null

  if (loading) return (
    <div className="rounded-2xl p-6 animate-pulse"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', height: '180px' }} />
  )

  if (!bankalar.length) return null

  const aktifBanka = bankalar[secilenBanka]
  const taksitler = aktifBanka?.installmentPrices?.filter(t => t.installmentNumber > 1) || []

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>

      {/* Başlık */}
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Taksit Seçenekleri
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            ₺{fiyat.toLocaleString('tr-TR')} için taksit bilgileri
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full font-bold"
          style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F' }}>
          iyzico güvencesi
        </span>
      </div>

      {/* Banka seçici */}
      <div className="flex gap-2 p-3 overflow-x-auto"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        {bankalar.map((b, i) => (
          <button
            key={b.bankCode}
            onClick={() => setSecilenBanka(i)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold transition-all"
            style={{
              background: secilenBanka === i ? getBankaRenk(b.bankName) : 'var(--bg-card)',
              color: secilenBanka === i ? 'white' : 'var(--text-secondary)',
              border: secilenBanka === i ? 'none' : '1px solid var(--border)',
            }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{
                background: secilenBanka === i ? 'rgba(255,255,255,0.25)' : getBankaRenk(b.bankName),
                color: 'white',
              }}>
              {getBankaHarf(b.bankName)}
            </span>
            {b.bankName.replace(/\s*(Bankası|Bank|A\.Ş\.)\s*/gi, '').trim()}
          </button>
        ))}
      </div>

      {/* Taksit tablosu */}
      <div style={{ background: 'var(--bg-card)' }}>
        {taksitler.length === 0 ? (
          <div className="p-5 text-center">
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Bu banka için taksit seçeneği bulunmamaktadır.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-[1px]"
                  style={{ color: 'var(--text-muted)' }}>Taksit</th>
                <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-[1px]"
                  style={{ color: 'var(--text-muted)' }}>Aylık</th>
                <th className="text-right px-5 py-3 text-[11px] font-bold uppercase tracking-[1px]"
                  style={{ color: 'var(--text-muted)' }}>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {taksitler.map((t, i) => (
                <tr key={t.installmentNumber}
                  style={{ borderBottom: i < taksitler.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[12px] font-black text-white"
                      style={{ background: getBankaRenk(aktifBanka.bankName) }}>
                      {t.installmentNumber}
                    </span>
                    <span className="ml-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      taksit
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-[15px] font-black" style={{ color: 'var(--text-primary)' }}>
                      ₺{Number(t.installmentPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                      ₺{Number(t.totalPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
