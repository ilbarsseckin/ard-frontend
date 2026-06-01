import type { Metadata } from 'next'
// @ts-ignore: side-effect import for global CSS (no type declarations)
import './globals.css'

import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import WelcomeDialog from '@/components/ui/WelcomeDialog'

export const metadata: Metadata = {
  title: 'baskıurunleri.com — Türkiye\'nin En Hızlı Online Matbaası',
  description: 'Büyük format, kartvizit, sticker, tabela. Tasarımını yükle, anlık fiyatı gör, 48 saatte kapında.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '8px', fontSize: '13px' },
          }} />
          <WelcomeDialog />
        </ThemeProvider>
      </body>
    </html>
  )
}