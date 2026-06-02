'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Megaphone, ArrowRight, Loader2 } from 'lucide-react'

interface Campaign {
  id: string
  label?: string
  title: string
  description?: string
  badgeText?: string
  badgeColor?: string
  imageUrl: string
  backgroundColor?: string
  ctaText?: string
  ctaLink?: string
}

export default function KampanyalarPage() {
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/campaigns')
      .then(r => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2.5 mb-2">
          <Megaphone size={26} style={{ color: '#F4821F' }} />
          <h1 className="text-[26px] sm:text-[30px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Kampanyalar
          </h1>
        </div>
        <p className="text-[14px] mb-8" style={{ color: 'var(--text-secondary)' }}>
          Güncel fırsatlar ve paket kampanyaları.
        </p>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={30} className="animate-spin" style={{ color: '#F4821F' }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 rounded-2xl"
            style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
            <Megaphone size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-[15px]">Şu anda aktif bir kampanya yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(c => (
              <CampaignCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function CampaignCard({ c }: { c: Campaign }) {
  const card = (
    <div className="relative rounded-2xl overflow-hidden h-full group"
      style={{ background: c.backgroundColor || 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="relative h-[180px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.imageUrl} alt={c.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {c.badgeText && (
          <span className="absolute top-3 left-3 text-[12px] font-bold px-2.5 py-1 rounded-lg text-white shadow"
            style={{ background: c.badgeColor || '#F4821F' }}>
            {c.badgeText}
          </span>
        )}
      </div>
      <div className="p-5">
        {c.label && (
          <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: '#F4821F' }}>
            {c.label}
          </p>
        )}
        <h3 className="text-[17px] font-bold leading-snug mb-1.5" style={{ color: 'var(--text-primary)' }}>
          {c.title}
        </h3>
        {c.description && (
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            {c.description}
          </p>
        )}
        {c.ctaText && (
          <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold"
            style={{ color: '#F4821F' }}>
            {c.ctaText} <ArrowRight size={14} />
          </span>
        )}
      </div>
    </div>
  )

  return c.ctaLink ? <Link href={c.ctaLink} className="block h-full">{card}</Link> : card
}
