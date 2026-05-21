'use client'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

const stats = [
  { n: '12.000+', l: 'Müşteri' },
  { n: '48 saat', l: 'Teslimat' },
  { n: '4.9 ★', l: 'Google' },
  { n: '1.200 m²', l: 'Fabrika' },
]

export default function HeroSection() {
  const [ticker, setTicker] = useState<string[]>([])

  useEffect(() => {
    api.get('/api/references')
      .then(r => {
        const names = (r.data.data || []).map((ref: any) => ref.name)
        setTicker(names.length > 0 ? names : [])
      })
      .catch(() => setTicker([]))
  }, [])

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '91vh', display: 'flex', flexDirection: 'column' }}>

      {/* Tam ekran arka plan görseli */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
          style={{ opacity: 0.32 }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Sanatsal renk overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, var(--bg-primary) 42%, color-mix(in srgb, var(--bg-primary) 60%, transparent) 65%, transparent 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 45%)' }} />
      </div>

      {/* Dekoratif turuncu çizgi - sol kenar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #F4821F 30%, #F4821F 70%, transparent)' }} />

      {/* İçerik */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 w-full flex items-center">
        <div className="grid grid-cols-2 gap-16 items-center w-full py-20">

          {/* Sol */}
          <div className="animate-in">

            {/* Üst etiket */}
            <div className="flex items-center gap-3 mb-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] tracking-[2.5px] uppercase font-semibold"
                  style={{ color: 'var(--text-muted)' }}>
                  Fabrika aktif
                </span>
              </div>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span className="text-[10px] tracking-[2.5px] uppercase font-semibold text-[#F4821F]">
                Sipariş alınıyor
              </span>
            </div>

            {/* Ana başlık — sanatsal tipografi */}
            <div className="mb-8">
              <p className="text-[13px] tracking-[3px] uppercase mb-4 font-semibold"
                style={{ color: 'var(--text-muted)', fontFamily: 'Georgia, serif' }}>
                Türkiye'nin önde gelen matbaası
              </p>
              <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)', lineHeight: 1.02, letterSpacing: '-2.5px' }}
                className="text-[68px] font-bold">
                Renklerin
              </h1>
              <h1 style={{ fontFamily: 'Georgia, serif', lineHeight: 1.02, letterSpacing: '-2.5px' }}
                className="text-[68px] font-bold text-[#F4821F]">
                Gücünü
              </h1>
              <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)', lineHeight: 1.02, letterSpacing: '-2.5px' }}
                className="text-[68px] font-bold">
                Hissettirin.
              </h1>
            </div>

            <p className="text-[15px] leading-[1.7] mb-10 max-w-[420px]"
              style={{ color: 'var(--text-secondary)', fontFamily: 'Georgia, serif' }}>
              Büyük format, kartvizit, sticker, tabela. Tasarımını yükle,
              anlık fiyatı gör, 48 saatte kapında.
            </p>

            {/* CTA */}
            <div className="flex gap-4 mb-14">
              <Link href="/siparis"
                className="group flex items-center gap-3 bg-[#F4821F] text-white text-[13px] font-bold px-7 py-4 rounded-xl hover:bg-[#e07010] transition-all duration-200 shadow-md">
                Hemen sipariş ver
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/#fabrika"
                className="flex items-center gap-3 text-[13px] font-medium px-6 py-4 rounded-xl transition-all duration-200"
                style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
                <Play size={13} className="text-[#F4821F]" />
                Fabrika turu
              </Link>
            </div>

            {/* İstatistik bar */}
            <div className="grid grid-cols-4 overflow-hidden rounded-2xl"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              {stats.map((s, i) => (
                <div key={i} className="px-5 py-4"
                  style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div className="text-[20px] font-bold tracking-[-0.5px]"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>{s.n}</div>
                  <div className="text-[10px] mt-0.5 tracking-[0.8px] uppercase font-medium"
                    style={{ color: 'var(--text-muted)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — canlı üretim paneli */}
          <div className="flex justify-end animate-in-right" style={{ animationDelay: '0.2s' }}>
            <div className="w-[340px] rounded-2xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase"
                  style={{ color: 'var(--text-primary)' }}>Canlı Üretim</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-semibold">Aktif</span>
                </div>
              </div>

              {[
                { label: 'Sipariş Alındı', time: '2 dk önce', done: true },
                { label: 'Tasarım Kontrolü', time: '5 dk önce', done: true },
                { label: 'Baskı Hazırlık', time: '7 dk önce', done: true },
                { label: 'Baskı İşlemi', time: 'Şu anda', active: true },
                { label: 'Kesim', time: 'Sırada', pending: true },
                { label: 'Paketleme', time: 'Sırada', pending: true },
                { label: 'Sevkiyat', time: 'Bekliyor', pending: true },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0`}
                    style={{
                      background: step.done ? 'rgba(52,211,153,0.15)' : step.active ? 'rgba(244,130,31,0.15)' : 'var(--surface)',
                      border: `1px solid ${step.done ? 'rgba(52,211,153,0.4)' : step.active ? 'rgba(244,130,31,0.5)' : 'var(--border)'}`,
                    }}>
                    {step.done && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    {step.active && <span className="w-2 h-2 rounded-full bg-[#F4821F] animate-pulse" />}
                    {step.pending && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--border-strong)' }} />}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[12px] font-medium"
                      style={{ color: (step.done || step.active) ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {step.label}
                    </span>
                    <span className="text-[10px]"
                      style={{ color: step.active ? '#F4821F' : 'var(--text-muted)' }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}

              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="text-[10px] uppercase tracking-[1px] mb-2 font-semibold"
                  style={{ color: 'var(--text-muted)' }}>Güncel siparişler</div>
                {[
                  { city: 'İstanbul', product: 'Mağaza Vinil', size: '3×2m' },
                  { city: 'Ankara', product: 'Kartvizit', size: '500 adet' },
                ].map((o, i) => (
                  <div key={i} className="flex items-center justify-between mb-2 last:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{o.city} — {o.product}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{o.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt ticker — referanslar kayar */}
      <div className="relative z-10 py-3 overflow-hidden"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-4 px-6">
          <div className="flex-1 overflow-hidden">
            <div className="ticker-track">
              {(() => { const copies = Math.max(2, Math.ceil(20 / (ticker.length || 1))); return Array(copies).fill(ticker).flat(); })().map((name, i) => (
                <span key={i} className="flex items-center gap-3 mr-10 text-[12px] font-semibold whitespace-nowrap"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'Georgia, serif' }}>
                  <span className="w-1 h-4 rounded-full bg-[#F4821F] opacity-60 flex-shrink-0" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}