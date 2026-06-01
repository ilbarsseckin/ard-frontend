'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Printer, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/auth'
import Logo from '@/components/ui/Logo'

export default function GirisPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>()
  const [showPass, setShowPass] = useState(false)
  const setAuth = useAuthStore(s => s.setAuth)
  const router = useRouter()

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const res = await authApi.login(data.email, data.password)
      const { token, email, name, role, id } = res.data.data
      setAuth({ id: id || '', name, email, role }, token)
      toast.success('Giriş başarılı!')
      if (role === 'ADMIN' || role === 'OPERATOR') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Giriş başarısız')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
              <Printer size={18} className="text-[#F4821F]" />
            </div>
            <Logo className="h-7" />
          </Link>
          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Hesabınıza giriş yapın</h1>
          <p className="text-[13px] text-gray-400 mt-1.5">Siparişlerinizi takip edin</p>
        </div>

        <div className="bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-posta</label>
              <input type="email" placeholder="ornek@mail.com"
                {...register('email', { required: 'E-posta zorunlu' })}
                className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors" />
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Şifre</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  {...register('password', { required: 'Şifre zorunlu' })}
                  className="w-full px-3.5 py-2.5 pr-10 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
              {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-4">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-[#F4821F] hover:underline">Kayıt olun</Link>
        </p>
      </div>
    </div>
  )
}
