'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useCartStore } from '@/lib/store/cart'
import { ShoppingCart, ArrowRight, Clock, Shield, Truck, Star, Check, ChevronDown, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface LandingSection {
  type: 'hero' | 'benefits' | 'products' | 'howto' | 'testimonial' | 'faq' | 'cta'
  data: any
}

interface Campaign {
  id: string
  slug: string
  title: string
  label?: string
  description?: string
  landingContent?: string
  badgeText?: string
  badgeColor?: string
  imageUrl: string
  mobileImageUrl?: string
  backgroundColor?: string
  ctaText?: string
  ctaLink?: string
  endsAt?: string
}

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) return setTime({ h: 0, m: 0, s: 0 })
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [endsAt])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2 justify-center">
      <Clock size={14} className="text-red-400" />
      <span className="text-[13px] font-bold text-red-400">Kampanya bitiyor:</span>
      <div className="flex gap-1">
        {[{ v: time.h, l: 'SA' }, { v: time.m, l: 'DK' }, { v: time.s, l: 'SN' }].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[16px] font-black text-white"
              style={{ background: 'rgba(239,68,68,0.9)' }}>
              {pad(v)}
            </div>
            <span className="text-[8px] font-bold text-red-400 mt-0.5">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function parseLandingContent(content: string): LandingSection[] {
  if (!content) return []
  try {
    return JSON.parse(content)
  } catch {
    return []
  }
}

export default function LandingPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    api.get(`/api/campaigns/lp/${slug}`)
      .then(r => setCampaign(r.data.data))
      .catch(() => router.push('/kampanyalar'))
      .finally(() => setLoading(false))
  }, [slug])

  // Sticky CTA — scroll'da görün
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setCtaVisible(!e.isIntersecting),
      { threshold: 0 }
    )
    if (ctaRef.current) obs.observe(ctaRef.current)
    return () => obs.disconnect()
  }, [campaign])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#F4821F] border-t-transparent animate-spin" />
        </div>
      </>
    )
  }

  if (!campaign) return null

  const sections = parseLandingContent(campaign.landingContent || '')
  const accentColor = campaign.badgeColor || '#F4821F'
  const ctaLink = campaign.ctaLink || '/urunler'
  const ctaText = campaign.ctaText || 'Hemen Sipariş Ver'

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="relative overflow-hidden"
          style={{ background: campaign.backgroundColor || 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' }}>

          {/* Dekoratif arka plan daireleri */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
              style={{ background: accentColor }} />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-5"
              style={{ background: accentColor }} />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-0">

            {/* Badge + Label */}
            <div className="flex flex-col items-center gap-2 mb-5">
              {campaign.label && (
                <span className="text-[10px] tracking-[3px] uppercase font-black"
                  style={{ color: accentColor }}>
                  {campaign.label}
                </span>
              )}
              {campaign.badgeText && (
                <div className="px-4 py-1.5 rounded-full text-white text-[13px] font-black shadow-lg animate-pulse"
                  style={{ background: accentColor }}>
                  🎯 {campaign.badgeText}
                </div>
              )}
            </div>

            {/* Başlık */}
            <h1 className="text-[28px] sm:text-[40px] md:text-[52px] font-black text-center leading-tight tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              {campaign.title}
            </h1>

            {/* Açıklama */}
            {campaign.description && (
              <p className="text-[15px] sm:text-[17px] text-center leading-relaxed max-w-2xl mx-auto mb-6"
                style={{ color: 'var(--text-secondary)' }}>
                {campaign.description}
              </p>
            )}

            {/* Countdown */}
            {campaign.endsAt && (
              <div className="mb-6 flex justify-center">
                <CountdownTimer endsAt={campaign.endsAt} />
              </div>
            )}

            {/* CTA buton */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link href={ctaLink}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white text-[15px] font-black shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}>
                <Zap size={18} />
                {ctaText}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/urunler"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[14px] font-bold transition-all hover:scale-105"
                style={{ border: `2px solid ${accentColor}30`, color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
                Tüm Ürünler
              </Link>
            </div>

            {/* Güven satırı */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-[12px]"
              style={{ color: 'var(--text-muted)' }}>
              {[
                { icon: Shield, text: 'Güvenli Ödeme' },
                { icon: Truck, text: '48 Saat Teslimat' },
                { icon: Star, text: '4.9 Google Puanı' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={13} style={{ color: accentColor }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Görsel */}
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="rounded-t-3xl overflow-hidden shadow-2xl"
              style={{ border: `1px solid ${accentColor}20` }}>
              <img
                src={campaign.mobileImageUrl || campaign.imageUrl}
                alt={campaign.title}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectPosition: 'center top' }}
              />
            </div>
          </div>
        </section>

        {/* ── LANDING SECTIONS ─────────────────────────── */}
        {sections.map((section, idx) => {
          if (section.type === 'benefits') {
            return (
              <section key={idx} className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-[24px] sm:text-[32px] font-black text-center mb-3 tracking-tight"
                    style={{ color: 'var(--text-primary)' }}>
                    {section.data.title || 'Neden Bu Kampanya?'}
                  </h2>
                  {section.data.subtitle && (
                    <p className="text-center text-[14px] mb-10" style={{ color: 'var(--text-secondary)' }}>
                      {section.data.subtitle}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(section.data.items || []).map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div className="text-[32px] mb-3">{item.icon || '✨'}</div>
                        <h3 className="text-[15px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'howto') {
            return (
              <section key={idx} className="py-16 px-4"
                style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-[24px] sm:text-[32px] font-black text-center mb-10 tracking-tight"
                    style={{ color: 'var(--text-primary)' }}>
                    {section.data.title || 'Nasıl Sipariş Verilir?'}
                  </h2>
                  <div className="space-y-4">
                    {(section.data.steps || []).map((step: any, i: number) => (
                      <div key={i} className="flex items-start gap-4 rounded-2xl p-5"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-[15px] flex-shrink-0"
                          style={{ background: accentColor }}>
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="text-[14px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                            {step.title}
                          </h3>
                          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'testimonial') {
            return (
              <section key={idx} className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-[24px] sm:text-[32px] font-black text-center mb-10"
                    style={{ color: 'var(--text-primary)' }}>
                    {section.data.title || 'Müşteriler Ne Diyor?'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(section.data.items || []).map((t: any, i: number) => (
                      <div key={i} className="rounded-2xl p-6"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div className="flex gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} size={14} fill={accentColor} style={{ color: accentColor }} />
                          ))}
                        </div>
                        <p className="text-[13px] leading-relaxed italic mb-4" style={{ color: 'var(--text-secondary)' }}>
                          "{t.text}"
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                            style={{ background: accentColor }}>
                            {t.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'faq') {
            return (
              <section key={idx} className="py-16 px-4"
                style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-[24px] sm:text-[32px] font-black text-center mb-10"
                    style={{ color: 'var(--text-primary)' }}>
                    {section.data.title || 'Sık Sorulan Sorular'}
                  </h2>
                  <div className="space-y-2">
                    {(section.data.items || []).map((faq: any, i: number) => (
                      <div key={i} className="rounded-xl overflow-hidden"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <button
                          className="w-full flex items-center justify-between p-4 text-left"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                          <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                            {faq.q}
                          </span>
                          <ChevronDown size={16}
                            className={`flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                            style={{ color: accentColor }} />
                        </button>
                        {openFaq === i && (
                          <div className="px-4 pb-4 text-[13px] leading-relaxed"
                            style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                            <p className="pt-3">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'cta') {
            return (
              <section key={idx} className="py-16 px-4">
                <div className="max-w-2xl mx-auto text-center rounded-3xl p-10"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
                    border: `1px solid ${accentColor}25`
                  }}>
                  <h2 className="text-[24px] sm:text-[32px] font-black mb-3"
                    style={{ color: 'var(--text-primary)' }}>
                    {section.data.title || 'Fırsatı Kaçırma!'}
                  </h2>
                  <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {section.data.desc || 'Kampanya sınırlı süre geçerlidir.'}
                  </p>
                  <Link href={ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white text-[15px] font-black shadow-xl hover:scale-105 transition-all"
                    style={{ background: accentColor }}>
                    <Zap size={16} />
                    {section.data.buttonText || ctaText}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </section>
            )
          }

          return null
        })}

        {/* ── DEFAULT CTA (sections yoksa) ─────────────── */}
        {sections.length === 0 && (
          <section className="py-16 px-4">
            <div className="max-w-2xl mx-auto">

              {/* Kampanya özellikleri */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '⚡', title: 'Hızlı Üretim', desc: '48 saat içinde hazır' },
                  { icon: '🎨', title: 'Ücretsiz Tasarım', desc: 'Grafiker desteği dahil' },
                  { icon: '🚚', title: 'Hızlı Kargo', desc: 'Kapınıza kadar teslimat' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl p-5 text-center"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="text-[28px] mb-2">{item.icon}</div>
                    <h3 className="text-[13px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA kutu */}
              <div className="rounded-3xl p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
                  border: `2px solid ${accentColor}30`
                }}>
                <h2 className="text-[22px] font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                  Fırsatı Kaçırma!
                </h2>
                <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Kampanya sınırlı süre geçerlidir.
                </p>
                <Link href={ctaLink}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white text-[15px] font-black shadow-xl hover:scale-105 transition-all"
                  style={{ background: accentColor }}>
                  <Zap size={16} /> {ctaText} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ── STICKY BOTTOM CTA (mobil için) ──────────────── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 md:hidden ${ctaVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="p-3">
          <Link href={ctaLink}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-[14px] font-black"
            style={{ background: accentColor }}>
            <Zap size={15} /> {ctaText} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}
