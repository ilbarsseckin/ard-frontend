'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { Megaphone } from 'lucide-react'

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
  ctaLink?: string
}

export default function KampanyaSerit() {
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/campaigns')
      .then((r) => setItems(r.data?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading || items.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-8 md:my-10">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone size={18} className="text-[#F4821F]" />
        <h2 className="text-[18px] sm:text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
          Kampanyalar
        </h2>
      </div>

      {/* Mobilde tam genişlik scroll, masaüstünde grid */}
      <div
        className="flex gap-4 overflow-x-auto pb-2 snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </section>
  )
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const card = (
    <div
      className="relative w-[280px] sm:w-[340px] md:w-auto shrink-0 md:shrink snap-start rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
      style={{
        background: campaign.backgroundColor || 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Resim */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <picture>
          {campaign.mobileImageUrl && (
            <source media="(max-width: 640px)" srcSet={campaign.mobileImageUrl} />
          )}
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </picture>

        {campaign.badgeText && (
          <span
            className="absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full text-white shadow"
            style={{ background: campaign.badgeColor || '#F4821F' }}
          >
            {campaign.badgeText}
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="p-4">
        {campaign.label && (
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] mb-1 text-[#F4821F]">
            {campaign.label}
          </p>
        )}
        <h3 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {campaign.title}
        </h3>
        {campaign.description && (
          <p className="mt-1.5 text-[12px] line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {campaign.description}
          </p>
        )}
      </div>
    </div>
  )

  if (campaign.ctaLink) {
    return <Link href={campaign.ctaLink} className="block">{card}</Link>
  }

  return card
}