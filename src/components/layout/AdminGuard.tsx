'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('baski-auth')
      if (!stored) { router.push('/giris'); return }
      const { state } = JSON.parse(stored)
      if (!state?.token) { router.push('/giris'); return }
      if (state?.user?.role !== 'OPERATOR' && state?.user?.role !== 'ADMIN') {
        router.push('/'); return
      }
      setReady(true)
    } catch {
      router.push('/giris')
    }
  }, [])

  if (!ready) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-[13px] text-gray-400">Yükleniyor...</div>
    </div>
  )

  return <>{children}</>
}
