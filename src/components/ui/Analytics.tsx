'use client'
import { useEffect } from 'react'
import Script from 'next/script'
import { useState } from 'react'
import { getConsent } from './CookieConsent'

// ─── ID'leri buraya yaz ───────────────────────────
const GA_ID  = 'G-XXXXXXXXXX'   // Google Analytics 4 Measurement ID
const PIX_ID = 'XXXXXXXXXXXXXXXXX' // Meta Pixel ID
// ─────────────────────────────────────────────────

export default function Analytics() {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    // Sayfa yüklenince mevcut onayı kontrol et
    setConsent(getConsent())

    // Kullanıcı banner'dan kabul edince tetiklenir
    const handler = () => setConsent('accepted')
    window.addEventListener('cookie-accepted', handler)
    return () => window.removeEventListener('cookie-accepted', handler)
  }, [])

  if (consent !== 'accepted') return null

  return (
    <>
      {/* ── Google Analytics 4 ── */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>

      {/* ── Meta Pixel ── */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIX_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  )
}
