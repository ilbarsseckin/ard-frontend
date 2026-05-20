import type { Metadata } from 'next'
// @ts-expect-error: global CSS side-effect import without explicit type declarations
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'BaskıPro — Türkiye\'nin En Hızlı Online Matbaası',
  description: 'Büyük format, kartvizit, sticker, tabela. Tasarımını yükle, anlık fiyatı gör, 48 saatte kapında.',
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
        </ThemeProvider>
      </body>
    </html>
  )
}