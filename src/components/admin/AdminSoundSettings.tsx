'use client'
import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Upload, RotateCcw, Play, Check, Music } from 'lucide-react'
import { setCustomSound, resetSound, testSound } from '@/hooks/useNewOrderAlert'

const CUSTOM_SOUND_KEY = 'admin-notification-sound'

export default function AdminSoundSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hasCustom, setHasCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [testPlaying, setTestPlaying] = useState(false)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const val = localStorage.getItem(CUSTOM_SOUND_KEY)
    const disabled = localStorage.getItem('admin-sound-disabled')
    setEnabled(!disabled)
    if (val) {
      setHasCustom(true)
      setCustomName(localStorage.getItem('admin-sound-name') || 'Özel ses')
    }
  }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('audio/')) {
      alert('Sadece MP3, WAV veya OGG dosyası yükleyebilirsiniz.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Dosya boyutu en fazla 2 MB olmalıdır.')
      return
    }
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setCustomSound(dataUrl)
        localStorage.setItem('admin-sound-name', file.name)
        setHasCustom(true)
        setCustomName(file.name)
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setUploading(false)
    }
    e.target.value = ''
  }

  const handleReset = () => {
    resetSound()
    localStorage.removeItem('admin-sound-name')
    setHasCustom(false)
    setCustomName('')
  }

  const handleTest = () => {
    setTestPlaying(true)
    testSound()
    setTimeout(() => setTestPlaying(false), 2000)
  }

  const toggleEnabled = () => {
    const next = !enabled
    setEnabled(next)
    if (next) localStorage.removeItem('admin-sound-disabled')
    else localStorage.setItem('admin-sound-disabled', '1')
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(244,130,31,0.04)' }}>
        <div className="flex items-center gap-2">
          <Volume2 size={16} style={{ color: '#F4821F' }} />
          <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Yeni Sipariş Ses Bildirimi
          </h3>
        </div>
        {/* Aç/Kapat toggle */}
        <button onClick={toggleEnabled}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all"
          style={{
            background: enabled ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
            color: enabled ? '#16a34a' : '#dc2626',
            border: `1px solid ${enabled ? 'rgba(22,163,74,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
          {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          {enabled ? 'Açık' : 'Kapalı'}
        </button>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Yeni katalog siparişi geldiğinde ses bildirimi çalar. Kendi ses dosyanızı yükleyebilirsiniz.
        </p>

        {/* Mevcut ses */}
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: hasCustom ? 'rgba(244,130,31,0.15)' : 'rgba(107,114,128,0.1)' }}>
            <Music size={16} style={{ color: hasCustom ? '#F4821F' : 'var(--text-muted)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {hasCustom ? customName : 'Varsayılan ses (new-order.mp3)'}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {hasCustom ? 'Özel ses dosyası' : 'Sistem varsayılanı'}
            </p>
          </div>
          <button onClick={handleTest} disabled={testPlaying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
            style={{ background: 'rgba(244,130,31,0.1)', color: '#F4821F', border: '1px solid rgba(244,130,31,0.2)' }}>
            {testPlaying ? <Check size={13} /> : <Play size={13} />}
            {testPlaying ? 'Çalıyor...' : 'Test'}
          </button>
        </div>

        {/* Yükleme alanı */}
        <div>
          <input ref={fileInputRef} type="file" accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,.mp3,.wav,.ogg"
            className="hidden" onChange={handleFile} />

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:opacity-80"
              style={{ background: 'linear-gradient(135deg,#F4821F,#e07010)', color: 'white' }}>
              <Upload size={14} />
              {uploading ? 'Yükleniyor...' : 'Ses Yükle'}
            </button>

            {hasCustom && (
              <button onClick={handleReset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:opacity-80"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                <RotateCcw size={14} />
                Varsayılana Dön
              </button>
            )}
          </div>

          <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
            MP3, WAV veya OGG · Maks 2 MB · Kısa ve net bir ses önerilir
          </p>
        </div>
      </div>
    </div>
  )
}
