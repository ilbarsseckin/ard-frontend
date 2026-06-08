'use client'
import { Zap, ShieldCheck, Truck, Sparkles, CreditCard, HeadphonesIcon, type LucideIcon } from 'lucide-react'

interface USP {
  icon: LucideIcon
  title: string
  desc: string
  color: string
}

const USPS: USP[] = [
  { icon: Zap,             title: '48 Saatte Kapında',      desc: 'Onay sonrası hızlı üretim ve kargo. Acil işlerde 24 saat içinde teslim.',         color: '#F4821F' },
  { icon: Sparkles,        title: 'Yüksek Kalite Baskı',    desc: 'Profesyonel makineler, premium kağıt, renk hassasiyeti.',                          color: '#8B5CF6' },
  { icon: CreditCard,      title: 'Güvenli Online Ödeme',   desc: 'Iyzico altyapısı, 3D Secure. Tüm kartlar ve havale ile ödeme.',                    color: '#16A34A' },
  { icon: Truck,           title: 'Türkiye\'nin Her Yerine', desc: 'Anlaşmalı kargo. 500₺ üstü siparişlerde kargo ücretsiz.',                          color: '#2563EB' },
  { icon: HeadphonesIcon,  title: '7/24 WhatsApp Destek',   desc: 'Sorunda anında yanıt. Tasarım yardımı ve teknik destek.',                          color: '#0891B2' },
  { icon: ShieldCheck,     title: 'Memnuniyet Garantisi',   desc: 'Baskı hatasında ücretsiz yeniden baskı veya tam para iadesi.',                     color: '#DC2626' },
]

const doubled = [...USPS, ...USPS]

export default function NedenBiz() {
  return (
    <section className="py-12 md:py-20 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <style>{`
        @keyframes neden-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .neden-track {
          display: flex;
          width: max-content;
          animation: neden-scroll 32s linear infinite;
        }
        .neden-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-[1.5px] uppercase mb-3"
            style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
            <ShieldCheck size={12} />
            NEDEN BİZ
          </span>
          <h2 className="text-[26px] md:text-[36px] font-black tracking-[-1px] leading-tight"
            style={{ color: 'var(--text-primary)' }}>
            Binlerce işletmenin tercihi
          </h2>
          <p className="text-[13px] md:text-[15px] mt-2" style={{ color: 'var(--text-muted)' }}>
            Online matbaada aradığınız her şey tek bir adreste
          </p>
        </div>
      </div>

      {/* Kayan kartlar */}
      <div className="relative">
        {/* Kenar gölgeleri */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }} />

        <div className="neden-track px-4 gap-4">
          {doubled.map((u, i) => {
            const Icon = u.icon
            return (
              <div key={i}
                className="flex-shrink-0 w-[280px] rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${u.color}1A` }}>
                    <Icon size={20} style={{ color: u.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold tracking-[-0.3px] mb-1"
                      style={{ color: 'var(--text-primary)' }}>
                      {u.title}
                    </h3>
                    <p className="text-[12px] leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}>
                      {u.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}