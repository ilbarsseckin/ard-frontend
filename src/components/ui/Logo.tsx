'use client'

interface LogoProps {
  className?: string
  /** Tek renk versiyonu (footer veya watermark için) */
  mono?: boolean
}

/**
 * baskıurunleri.com — Wordmark Logo
 * Stil: "baskıurunleri" siyah/koyu + ".com" turuncu kutuda
 *
 * Dark mode için: parent'tan text rengi gelir (currentColor)
 *   <Logo className="h-9" />  ← dark/light mode otomatik
 *   <Logo className="h-9 text-white" />  ← her zaman beyaz
 */
export default function Logo({ className = '', mono = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 240 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMinYMid meet"
    >
      {/* baskıurunleri — koyu wordmark */}
      <text
        x="0"
        y="29"
        fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="26"
        fontWeight="900"
        fill="currentColor"
        letterSpacing="-0.5"
        textLength="170"
        lengthAdjust="spacingAndGlyphs"
      >
        baskıurunleri
      </text>

      {mono ? (
        // Mono: tek renkli ".com"
        <text
          x="174"
          y="29"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="-0.3"
        >
          .com
        </text>
      ) : (
        // Renkli: turuncu kutu içinde beyaz ".com"
        <>
          <rect
            x="174"
            y="13"
            width="58"
            height="24"
            fill="#F4821F"
            rx="3"
          />
          <text
            x="203"
            y="31"
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            fontSize="15"
            fontWeight="800"
            fill="white"
            textAnchor="middle"
            letterSpacing="0.3"
          >
            .com
          </text>
        </>
      )}
    </svg>
  )
}