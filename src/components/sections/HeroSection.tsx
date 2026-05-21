'use client'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

const stats = [
  { n: '12.000+', l: 'Müşteri' },
  { n: '48 saat', l: 'Teslimat' },
  { n: '4.9 ★',  l: 'Google' },
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
    <section className="relative overflow-hidden" style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column' }}>

      {/* Video arka plan */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover object-center"
          style={{ opacity: 0.55 }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Koyu overlay — kurumsal, temiz */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(110deg, rgba(10,12,20,0.88) 40%, rgba(10,12,20,0.55) 65%, rgba(10,12,20,0.25) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(10,12,20,0.95) 0%, transparent 50%)'
        }} />
      </div>

      {/* Sol turuncu çizgi */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #F4821F 25%, #F4821F 75%, transparent)' }} />

      {/* İçerik */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 w-full flex items-center">
        <div className="grid grid-cols-2 gap-20 items-center w-full py-16">

          {/* Sol */}
          <div className="animate-in">

            {/* Durum etiketi */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] tracking-[2.5px] uppercase font-semibold text-white/60">
                  Fabrika aktif
                </span>
              </div>
              <span className="text-white/30">·</span>
              <span className="text-[10px] tracking-[2.5px] uppercase font-semibold text-[#F4821F]">
                Sipariş alınıyor
              </span>
            </div>

            {/* Başlık */}
            <div className="mb-6">
              <p className="text-[12px] tracking-[3px] uppercase mb-4 font-medium text-white/50">
                Türkiye'nin önde gelen matbaası
              </p>
              <h1 className="text-[64px] font-bold text-white leading-[1.0] tracking-[-2px] mb-1">
                Renklerin
              </h1>
              <h1 className="text-[64px] font-bold text-[#F4821F] leading-[1.0] tracking-[-2px] mb-1">
                Gücünü
              </h1>
              <h1 className="text-[64px] font-bold text-white leading-[1.0] tracking-[-2px]">
                Hissettirin.
              </h1>
            </div>

            <p className="text-[15px] leading-[1.7] mb-10 max-w-[400px] text-white/70">
              Büyük format, kartvizit, sticker, tabela.
              Tasarımını yükle, anlık fiyatı gör, 48 saatte kapında.
            </p>

            {/* CTA butonları */}
            <div className="flex gap-3 mb-14">
              <Link href="/siparis"
                className="group flex items-center gap-2.5 bg-[#F4821F] text-white text-[13px] font-bold px-7 py-3.5 rounded-xl hover:bg-[#e07010] transition-colors">
                Hemen sipariş ver
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/urunler"
                className="flex items-center gap-2.5 text-[13px] font-medium px-6 py-3.5 rounded-xl transition-colors text-white/80 hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)' }}>
                <Play size={12} className="text-[#F4821F]" />
                Ürünleri gör
              </Link>
            </div>

            {/* İstatistik bar */}
            <div className="grid grid-cols-4 overflow-hidden rounded-xl"
              style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              {stats.map((s, i) => (
                <div key={i} className="px-5 py-4"
                  style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <div className="text-[20px] font-bold text-white tracking-[-0.5px]">{s.n}</div>
                  <div className="text-[10px] mt-0.5 tracking-[1px] uppercase font-medium text-white/50">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — Canlı üretim paneli */}
          <div className="flex justify-end animate-in-right" style={{ animationDelay: '0.15s' }}>
            <div className="w-[320px] rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>

              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-white">Canlı Üretim</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-semibold">Aktif</span>
                </div>
              </div>

              {[
                { label: 'Sipariş Alındı',   time: '2 dk önce', done: true },
                { label: 'Tasarım Kontrolü', time: '5 dk önce', done: true },
                { label: 'Baskı Hazırlık',   time: '7 dk önce', done: true },
                { label: 'Baskı İşlemi',     time: 'Şu anda',   active: true },
                { label: 'Kesim',            time: 'Sırada',    pending: true },
                { label: 'Paketleme',        time: 'Sırada',    pending: true },
                { label: 'Sevkiyat',         time: 'Bekliyor',  pending: true },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: step.done ? 'rgba(52,211,153,0.2)' : step.active ? 'rgba(244,130,31,0.2)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${step.done ? 'rgba(52,211,153,0.5)' : step.active ? 'rgba(244,130,31,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    {step.done   && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    {step.active && <span className="w-2 h-2 rounded-full bg-[#F4821F] animate-pulse" />}
                    {step.pending && <span className="w-2 h-2 rounded-full bg-white/20" />}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[12px] font-medium"
                      style={{ color: (step.done || step.active) ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}>
                      {step.label}
                    </span>
                    <span className="text-[10px]"
                      style={{ color: step.active ? '#F4821F' : 'rgba(255,255,255,0.3)' }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}

              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-[10px] uppercase tracking-[1px] mb-2 font-semibold text-white/40">
                  Güncel siparişler
                </div>
                {[
                  { city: 'İstanbul', product: 'Mağaza Vinil', size: '3×2m' },
                  { city: 'Ankara',   product: 'Kartvizit',    size: '500 adet' },
                ].map((o, i) => (
                  <div key={i} className="flex items-center justify-between mb-2 last:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-white/60">{o.city} — {o.product}</span>
                    </div>
                    <span className="text-[10px] text-white/30">{o.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt ticker */}
      {ticker.length > 0 && (
        <div className="relative z-10 py-3 overflow-hidden"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-4 px-6">
            <div className="flex-1 overflow-hidden">
              <div className="ticker-track">
                {(() => {
                  const copies = Math.max(2, Math.ceil(20 / (ticker.length || 1)))
                  return Array(copies).fill(ticker).flat()
                })().map((name, i) => (
                  <span key={i} className="flex items-center gap-3 mr-10 text-[11px] font-semibold whitespace-nowrap text-white/50">
                    <span className="w-1 h-3 rounded-full bg-[#F4821F] opacity-60 flex-shrink-0" />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}