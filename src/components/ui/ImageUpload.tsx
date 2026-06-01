'use client'
import { useState, useRef, DragEvent } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'

interface Props {
  value?: string | null
  onChange: (url: string | null) => void
  type?: 'brand' | 'product' | 'category' | 'general'
  label?: string
  square?: boolean
  className?: string
  disabled?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  type = 'general',
  label,
  square = false,
  className = '',
  disabled = false,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları (JPG, PNG, WEBP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Maksimum 5 MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const res = await api.post('/api/admin/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onChange(res.data.data.url)
      toast.success('Yüklendi')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const aspectClass = square ? 'aspect-square' : 'aspect-video'

  if (value) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 text-gray-500 dark:text-gray-400">
            {label}
          </label>
        )}
        <div className={`relative rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] ${aspectClass}`}>
          <img src={value} alt="" className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3' }} />
          <div className="absolute top-2 right-2 flex gap-2">
            <button onClick={() => !uploading && inputRef.current?.click()}
              disabled={disabled || uploading}
              className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-md disabled:opacity-50"
              title="Değiştir" type="button">
              <Upload size={12} />
            </button>
            <button onClick={() => !disabled && onChange(null)}
              disabled={disabled || uploading}
              className="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md disabled:opacity-50"
              title="Kaldır" type="button">
              <X size={12} />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-white" />
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      <div
        onDragEnter={e => { e.preventDefault(); if (!disabled) setDragOver(true) }}
        onDragLeave={e => { e.preventDefault(); setDragOver(false) }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && !disabled && inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2
          rounded-xl border-2 border-dashed transition-colors
          ${aspectClass}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${dragOver
            ? 'border-[#F4821F] bg-orange-50 dark:bg-orange-500/10'
            : 'border-black/[0.1] dark:border-white/[0.1] hover:border-[#F4821F]'}
        `}>
        {uploading ? (
          <>
            <Loader2 size={24} className="animate-spin text-[#F4821F]" />
            <p className="text-[11px] text-gray-400">Yükleniyor...</p>
          </>
        ) : (
          <>
            <ImageIcon size={28} className="text-gray-300 dark:text-gray-600" />
            <p className="text-[12px] text-gray-500 dark:text-gray-400">Resim sürükle veya tıkla</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">JPG · PNG · WEBP · maks 5 MB</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>
    </div>
  )
}
