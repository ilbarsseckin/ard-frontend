'use client'
import { useState, useRef } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { X, Loader2, Plus, ArrowLeft, ArrowRight } from 'lucide-react'

interface Props {
  values: string[]                       // mevcut URL listesi (sıralı)
  onChange: (urls: string[]) => void
  type?: 'product' | 'general'
  label?: string
  maxItems?: number
  className?: string
}

export default function MultiImageUpload({
  values,
  onChange,
  type = 'product',
  label,
  maxItems = 8,
  className = '',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addFromUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      toast.error('URL http:// veya https:// ile başlamalı')
      return
    }
    if (values.length >= maxItems) {
      toast.error(`En fazla ${maxItems} resim`)
      return
    }
    if (values.includes(url)) {
      toast.error('Bu URL zaten ekli')
      return
    }
    onChange([...values, url])
    setUrlInput('')
    toast.success('URL eklendi')
  }

  const uploadFiles = async (files: FileList) => {
    if (uploading) return
    const fileArr = Array.from(files)
    const remaining = maxItems - values.length
    if (remaining <= 0) {
      toast.error(`En fazla ${maxItems} resim`)
      return
    }
    const toUpload = fileArr.slice(0, remaining)
    if (toUpload.length < fileArr.length) {
      toast(`Sadece ${remaining} tane yüklendi — limit ${maxItems}`)
    }

    setUploading(true)
    try {
      const tasks = toUpload.map(async (file) => {
        if (!file.type.startsWith('image/')) return null
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: 5 MB üstü, atlandı`)
          return null
        }
        const fd = new FormData()
        fd.append('file', file)
        fd.append('type', type)
        const res = await api.post('/api/admin/files/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data.data.url as string
      })
      const results = (await Promise.all(tasks)).filter(Boolean) as string[]
      if (results.length > 0) {
        onChange([...values, ...results])
        toast.success(`${results.length} resim yüklendi`)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  const removeAt = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx))
  }

  const moveLeft = (idx: number) => {
    if (idx === 0) return
    const next = [...values]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  const moveRight = (idx: number) => {
    if (idx === values.length - 1) return
    const next = [...values]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onChange(next)
  }

  const canAddMore = values.length < maxItems

  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5 text-gray-500 dark:text-gray-400">
          {label}{' '}
          <span className="text-gray-400 font-normal normal-case tracking-normal">
            ({values.length}/{maxItems})
          </span>
        </label>
      )}

      <div className="grid grid-cols-4 gap-2">
        {values.map((url, idx) => (
          <div key={`${idx}-${url}`}
            className="relative aspect-square rounded-lg overflow-hidden border border-black/[0.08] dark:border-white/[0.08] group">
            <img src={url} alt="" className="w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3' }} />

            {/* sıra göstergesi */}
            <div className="absolute top-1 left-1 min-w-[20px] h-5 px-1 rounded text-[10px] font-bold text-white bg-black/60 flex items-center justify-center">
              {idx === 0 ? '★1' : idx + 1}
            </div>

            {/* aksiyonlar — hover'da */}
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => removeAt(idx)}
                className="w-5 h-5 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                type="button" title="Kaldır">
                <X size={10} />
              </button>
            </div>

            {/* sıralama — alt */}
            <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveLeft(idx)} disabled={idx === 0}
                className="w-5 h-5 rounded bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center disabled:opacity-30"
                type="button" title="Sola">
                <ArrowLeft size={10} />
              </button>
              <button onClick={() => moveRight(idx)} disabled={idx === values.length - 1}
                className="w-5 h-5 rounded bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center disabled:opacity-30"
                type="button" title="Sağa">
                <ArrowRight size={10} />
              </button>
            </div>
          </div>
        ))}

        {canAddMore && (
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-black/[0.1] dark:border-white/[0.1] hover:border-[#F4821F] flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
            type="button">
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-[#F4821F]" />
            ) : (
              <>
                <Plus size={20} className="text-gray-400" />
                <p className="text-[10px] text-gray-400">Ekle</p>
              </>
            )}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => e.target.files && uploadFiles(e.target.files)} />

      {/* URL ile ekleme — dosya yüklemenin alternatifi */}
      {canAddMore && (
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFromUrl(); } }}
            placeholder="https://... (resim URL'si yapıştır)"
            className="flex-1 px-3 py-2 text-[12px] rounded-lg outline-none"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button type="button" onClick={addFromUrl} disabled={!urlInput.trim()}
            className="px-3 py-2 text-[12px] font-semibold rounded-lg text-white disabled:opacity-40 transition-colors"
            style={{ background: '#F4821F' }}>
            URL ekle
          </button>
        </div>
      )}

      <p className="text-[10px] text-gray-400 mt-2">
        İlk resim ★ ana resimdir. Sıralamayı hover'daki oklarla değiştir.
      </p>
    </div>
  )
}
