'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Printer } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/auth'
import Logo from '@/components/ui/Logo'
type Form = { name: string; email: string; password: string; phone?: string }

export default function KayitPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>()
  const setAuth = useAuthStore(s => s.setAuth)
  const router = useRouter()

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.register(data)
      const { token, email, name, role } = res.data.data
      setAuth({ id: '', name, email, role }, token)
      toast.success('Kayıt başarılı!')
      router.push('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
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
          <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Hesap oluşturun</h1>
          <p className="text-[13px] text-gray-400 mt-1.5">Ücretsiz kayıt, hemen sipariş verin</p>
        </div>

        <div className="bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { key: 'name', label: 'Ad Soyad', type: 'text', placeholder: 'Ahmet Yılmaz', required: true },
              { key: 'email', label: 'E-posta', type: 'email', placeholder: 'ornek@mail.com', required: true },
              { key: 'password', label: 'Şifre', type: 'password', placeholder: 'En az 6 karakter', required: true, minLength: 6 },
              { key: 'phone', label: 'Telefon (opsiyonel)', type: 'tel', placeholder: '05001234567', required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  {...register(f.key as keyof Form, {
                    required: f.required ? `${f.label} zorunlu` : false,
                    ...(f.minLength ? { minLength: { value: f.minLength, message: `En az ${f.minLength} karakter` } } : {})
                  })}
                  className="w-full px-3.5 py-2.5 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F] transition-colors" />
                {errors[f.key as keyof Form] && <p className="text-[11px] text-red-500 mt-1">{errors[f.key as keyof Form]?.message as string}</p>}
              </div>
            ))}

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-[#F4821F] text-white text-[14px] font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
              {isSubmitting ? 'Kayıt olunuyor...' : 'Kayıt ol'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-4">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-[#F4821F] hover:underline">Giriş yapın</Link>
        </p>
      </div>
    </div>
  )
}
