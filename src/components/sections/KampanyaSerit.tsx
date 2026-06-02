'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Megaphone, ArrowRight } from 'lucide-react'

interface Campaign {
  id: string
  label?: string
  title: string
  description?: string
  badgeText?: string
  badgeColor?: string
  imageUrl: string
  mobileImageUrl?: string
  backgroundColor?: string
  ctaText?: string
  ctaLink?: string
}

export default function KampanyaSerit() {
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/campaigns')
      .then(r => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Boşsa hiç gösterme
  if (loading || items.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone size={18} style={{ color: '#F4821F' }} />
          <h2 className="text-[18px] sm:text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Kampanyalar
          </h2>
        </div>
        <Link href="/kampanyalar"
          className="flex items-center gap-1 text-[12px] font-semibold"
          style={{ color: '#F4821F' }}>
          Tümünü gör <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x"
        style={{ scrollbarWidth: 'thin' }}>
        {items.map(c => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  )
}

function CampaignCard({ c }: { c: Campaign }) {
  const card = (
    <div className="relative w-[300px] sm:w-[340px] shrink-0 snap-start rounded-2xl overflow-hidden group"
      style={{ background: c.backgroundColor || 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="relative h-[150px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.imageUrl} alt={c.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {c.badgeText && (
          <span className="absolute top-2.5 left-2.5 text-[11px] font-bold px-2 py-1 rounded-lg text-white shadow"
            style={{ background: c.badgeColor || '#F4821F' }}>
            {c.badgeText}
          </span>
        )}
      </div>
      <div className="p-4">
        {c.label && (
          <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#F4821F' }}>
            {c.label}
          </p>
        )}
        <h3 className="text-[15px] font-bold leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>
          {c.title}
        </h3>
        {c.description && (
          <p className="text-[12px] line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {c.description}
          </p>
        )}
        {c.ctaText && (
          <span className="inline-flex items-center gap-1 mt-3 text-[12px] font-semibold"
            style={{ color: '#F4821F' }}>
            {c.ctaText} <ArrowRight size={13} />
          </span>
        )}
      </div>
    </div>
  )

  return c.ctaLink ? <Link href={c.ctaLink}>{card}</Link> : card
}
