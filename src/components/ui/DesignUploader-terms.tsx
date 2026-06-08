'use client'

import { useState, useRef, DragEvent } from 'react'
import {
  Upload, FileText, Image as ImageIcon, X, Loader2,
  Paperclip, Palette, Check, ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export interface UploadedDesignFile {
  id: string
  originalName: string
  fileSize: number
  mimeType?: string
  downloadUrl: string
}

export interface DesignSelection {
  mode: 'upload' | 'support' | null
  files: UploadedDesignFile[]
  supportNotes: string
  termsAccepted?: boolean
}

interface Props {
  value: DesignSelection
  onChange: (next: DesignSelection) => void
  supportPlaceholder?: string
}

const MAX_SIZE = 50 * 1024 * 1024
const ACCEPT = '.pdf,.ai,.eps,.jpg,.jpeg,.png,.webp,application/pdf,image/*'

function formatBytes(b: number): string {
  if (!b) return '0 B'
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB'
  return (b / (1024 * 1024)).toFixed(1) + ' MB'
}

function isImage(mime?: string, name?: string): boolean {
  if (mime && mime.startsWith('image/')) return true
  if (!name) return false
  const ext = name.toLowerCase()
  return ['.jpg', '.jpeg', '.png', '.webp'].some(e => ext.endsWith(e))
}

const TERMS = `Satın alma işleminizi tamamlamadan önce aşağıdaki koşulları okumanızı rica ederiz:

1. KİŞİYE ÖZEL ÜRETİM
Tüm baskı ürünleri sizin tasarımınıza özel üretilmektedir. Bu nedenle Mesafeli Satış Sözleşmesi kapsamındaki standart cayma hakkı bu ürünler için geçerli değildir.

2. İADE KABULEDEBİLECEK DURUMLAR
• Üretim veya baskı hatası (renk kayması, hatalı kesim, fiziksel hasar)
• Sipariş ettiğinizden farklı ürün gönderilmesi
• Kargo sırasında oluşan hasar (tutanak tutulmuş olması şartıyla)

3. İADE KABULEDİLMEYECEK DURUMLAR
• Yüklediğiniz tasarımdan kaynaklanan hatalar (düşük çözünürlük, renk farkı)
• Onayladıktan sonra tasarım değişikliği talepleri
• Kişisel tercih değişikliği
• Ürünün kullanılmış veya açılmış olması

4. TASARIM SORUMLULUĞU
Yüklediğiniz tasarım dosyasının içeriğinden, telif haklarından ve baskıya uygunluğundan tamamen siz sorumlusunuz. Tasarım desteği hizmetimizde ekibimiz öneriler sunar, ancak nihai onay sizden alınır.

5. RENK FARKLILIKLARI
Ekran renkleri ile baskı renkleri arasında küçük farklılıklar olabilir. Bu durum iade gerekçesi sayılmaz. Pantone/spot renk taleplerinizi sipariş notlarına belirtiniz.

6. ŞİKAYET SÜRECİ
Ürün tesliminden itibaren 3 iş günü içinde fotoğraflı şikayetinizi iletişim kanallarımıza iletmelisiniz. Bu süre geçtikten sonra şikayet kabul edilmez.`

export default function DesignUploader({ value, onChange, supportPlaceholder }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  const setMode = (mode: 'upload' | 'support') => onChange({ ...value, mode })

  const uploadFiles = async (fileList: FileList) => {
    const arr = Array.from(fileList)
    setUploadingCount(arr.length)
    const uploaded: UploadedDesignFile[] = []

    for (const file of arr) {
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: 50 MB üstü`)
        setUploadingCount(c => c - 1)
        continue
      }
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await api.post('/api/catalog/pre-order-files/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        uploaded.push(res.data.data)
      } catch (err: any) {
        toast.error(`${file.name}: ${err.response?.data?.message || 'yüklenemedi'}`)
      } finally {
        setUploadingCount(c => c - 1)
      }
    }

    if (uploaded.length > 0) {
      onChange({ ...value, files: [...value.files, ...uploaded] })
      toast.success(`${uploaded.length} dosya yüklendi`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files)
  }

  const handleDelete = async (fileId: string) => {
    try {
      await api.delete(`/api/catalog/pre-order-files/${fileId}`)
      onChange({ ...value, files: value.files.filter(f => f.id !== fileId) })
      toast.success('Silindi')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    }
  }

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Paperclip size={15} className="text-[#F4821F]" />
        <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Tasarım</p>
      </div>
      <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
        Hazır tasarımınız varsa yükleyin, yoksa tasarım desteği isteyin.
      </p>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { mode: 'upload' as const, icon: Upload, label: 'Tasarımı yükle', sub: 'PDF, AI, JPG, PNG' },
          { mode: 'support' as const, icon: Palette, label: 'Tasarım desteği', sub: 'Ekibimiz hazırlasın' },
        ].map(({ mode, icon: Icon, label, sub }) => (
          <button key={mode} type="button" onClick={() => setMode(mode)}
            className="flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg text-left transition-all"
            style={value.mode === mode
              ? { background: 'rgba(244,130,31,0.08)', border: '1.5px solid #F4821F', color: 'var(--text-primary)' }
              : { background: 'var(--bg-secondary)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1.5">
              <Icon size={13} style={{ color: value.mode === mode ? '#F4821F' : 'var(--text-muted)' }} />
              <span className="text-[12px] font-bold">{label}</span>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sub}</span>
          </button>
        ))}
      </div>

      {/* UPLOAD MODE */}
      {value.mode === 'upload' && (
        <>
          {value.files.length > 0 && (
            <div className="space-y-2 mb-3">
              {value.files.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-lg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--bg-card)' }}>
                    {isImage(f.mimeType, f.originalName)
                      ? <ImageIcon size={15} className="text-blue-500" />
                      : <FileText size={15} className="text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {f.originalName}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatBytes(f.fileSize)}</p>
                  </div>
                  <button onClick={() => handleDelete(f.id)} type="button"
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 hover:text-red-500 transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onDragEnter={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={e => { e.preventDefault(); setDragOver(false) }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => uploadingCount === 0 && fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-xl transition-colors py-6"
            style={{
              border: `2px dashed ${dragOver ? '#F4821F' : 'var(--border)'}`,
              background: dragOver ? 'rgba(244,130,31,0.05)' : 'transparent',
            }}>
            {uploadingCount > 0 ? (
              <>
                <Loader2 size={20} className="animate-spin text-[#F4821F]" />
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{uploadingCount} dosya yükleniyor...</p>
              </>
            ) : (
              <>
                <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Tasarım dosyası yükle veya sürükle
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  PDF · AI · JPG · PNG · WEBP — Maks 50 MB
                </p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={handleFileSelect} />
          </div>
        </>
      )}

      {/* SUPPORT MODE */}
      {value.mode === 'support' && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 rounded-lg"
            style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)' }}>
            <Check size={13} className="text-[#F4821F] mt-0.5 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              Tasarım ekibimiz sizinle iletişime geçecek ve tasarımınızı birlikte hazırlayacağız.
            </p>
          </div>
          <textarea value={value.supportNotes}
            onChange={e => onChange({ ...value, supportNotes: e.target.value })}
            placeholder={supportPlaceholder || 'Tasarımda olmasını istediğiniz logo, metin, renk, görsel vb. detayları yazın...'}
            rows={4}
            className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none resize-none"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        </div>
      )}

      {!value.mode && (
        <p className="text-[11px] text-center py-3" style={{ color: 'var(--text-muted)' }}>
          Yukarıdan bir seçenek belirleyin
        </p>
      )}

      {/* ─── ŞARTLAR VE KOŞULLAR ─── */}
      {value.mode && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>

          {/* Açılır şartlar metni */}
          <button type="button" onClick={() => setTermsOpen(o => !o)}
            className="w-full flex items-center justify-between text-left mb-2 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-1.5">
              <AlertCircle size={13} style={{ color: '#F4821F', flexShrink: 0 }} />
              <span className="text-[12px] font-bold">İade Koşulları ve Satış Şartları</span>
            </div>
            {termsOpen
              ? <ChevronUp size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              : <ChevronDown size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
          </button>

          {termsOpen && (
            <div className="mb-3 p-3 rounded-xl text-[11px] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              {TERMS}
            </div>
          )}

          {/* Onay kutusu */}
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ ...value, termsAccepted: !value.termsAccepted })}
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
              style={{
                background: value.termsAccepted ? '#F4821F' : 'var(--bg-secondary)',
                border: value.termsAccepted ? '2px solid #F4821F' : '2px solid var(--border)',
              }}>
              {value.termsAccepted && <Check size={11} className="text-white" />}
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <button type="button" onClick={() => setTermsOpen(true)}
                className="font-bold underline hover:text-[#F4821F] transition-colors"
                style={{ color: 'var(--text-primary)' }}>
                Satış koşullarını ve iade şartlarını
              </button>
              {' '}okudum, anladım ve kabul ediyorum. Kişiye özel üretilen ürünlerde cayma hakkımın bulunmadığını onaylıyorum.
            </p>
          </label>

          {value.mode && !value.termsAccepted && (
            <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#F59E0B' }}>
              <AlertCircle size={10} />
              Devam etmek için şartları kabul etmeniz gerekiyor
            </p>
          )}
        </div>
      )}
    </div>
  )
}
