'use client'
import {
  Sparkles, Gift, Heart, User, Star, TrendingUp, Tag, Clock, Award, Zap,
} from 'lucide-react'
import Link from 'next/link'

const ICONS = {
  sparkles: Sparkles,   // ÖNE ÇIKAN
  gift:     Gift,       // KAMPANYALAR
  heart:    Heart,      // FAVORİLERİM
  user:     User,       // SİZE ÖZEL
  star:     Star,       // POPÜLER
  trending: TrendingUp, // EN ÇOK SATAN
  tag:      Tag,        // İNDİRİMDE
  clock:    Clock,      // SON BAKTIKLARIN
  award:    Award,      // SEÇKİN
  zap:      Zap,        // HIZLI BASKI
}

type IconKey = keyof typeof ICONS

interface Props {
  /** Badge metni (örn. "ÖNE ÇIKAN", "KAMPANYALAR") */
  badge?: string
  /** Badge ikonu — sparkles, gift, heart, user, star, trending, tag, clock, award, zap */
  badgeIcon?: IconKey
  /** Büyük başlık */
  title: string
  /** Alt metin (opsiyonel) */
  subtitle?: string
  /** Sağ üst köşede "Tümünü gör →" linki (opsiyonel) */
  seeAllHref?: string
  seeAllText?: string
  /** Hizalama — center (default) veya left */
  align?: 'center' | 'left'
  className?: string
}

export default function SectionHeader({
  badge, badgeIcon = 'sparkles', title, subtitle,
  seeAllHref, seeAllText = 'Tümünü gör',
  align = 'center', className = '',
}: Props) {
  const Icon = ICONS[badgeIcon]
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'text-center' : 'flex items-end justify-between gap-3 flex-wrap'} mb-6 md:mb-10 ${className}`}>
      <div className={centered ? '' : 'flex-1 min-w-0'}>
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-[1.5px] uppercase mb-3"
            style={{ background: 'rgba(244,130,31,0.12)', color: '#F4821F' }}>
            <Icon size={12} />
            {badge}
          </span>
        )}
        <h2 className="text-[26px] md:text-[36px] font-black tracking-[-1px] leading-tight"
          style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] md:text-[15px] mt-2"
            style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {seeAllHref && !centered && (
        <Link href={seeAllHref}
          className="text-[12px] font-bold text-[#F4821F] hover:underline whitespace-nowrap">
          {seeAllText} →
        </Link>
      )}

      {seeAllHref && centered && (
        <div className="mt-3">
          <Link href={seeAllHref}
            className="text-[12px] font-bold text-[#F4821F] hover:underline">
            {seeAllText} →
          </Link>
        </div>
      )}
    </div>
  )
}
