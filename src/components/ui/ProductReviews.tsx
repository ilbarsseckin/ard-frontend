'use client'
import { useState, useEffect } from 'react'
import { Star, MessageSquare, Send, Loader2, EyeOff, AlertCircle } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Review {
  id: string
  productId: string
  rating: number
  comment: string
  displayName: string
  anonymous: boolean
  createdAt: string
}

interface Stats {
  averageRating: number
  totalCount: number
  distribution: Record<string, number>
  canUserReview?: boolean
  userAlreadyReviewed?: boolean
}

interface Props {
  productSlug: string
}

export default function ProductReviews({ productSlug }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formRating, setFormRating] = useState(0)
  const [formHoverRating, setFormHoverRating] = useState(0)
  const [formComment, setFormComment] = useState('')
  const [formAnonymous, setFormAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Auth durumu (localStorage'a göre)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('baski-auth')
      setIsAuthenticated(!!raw && raw !== 'null' && raw !== '{}')
    }
  }, [])

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get(`/api/catalog/products/${productSlug}/reviews`),
      api.get(`/api/catalog/products/${productSlug}/reviews/stats`),
    ]).then(([rRes, sRes]) => {
      setReviews(rRes.data.data || [])
      setStats(sRes.data.data)
    }).catch(() => {
      setReviews([])
      setStats(null)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [productSlug])

  const handleSubmit = async () => {
    if (formRating < 1) { toast.error('Lütfen puan verin'); return }
    if (formComment.trim().length < 10) { toast.error('Yorum en az 10 karakter olmalı'); return }

    setSubmitting(true)
    try {
      await api.post(`/api/catalog/products/${productSlug}/reviews`, {
        rating: formRating, comment: formComment.trim(), anonymous: formAnonymous,
      })
      toast.success('Yorumunuz eklendi!')
      setShowForm(false); setFormRating(0); setFormComment(''); setFormAnonymous(false)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Yorum eklenemedi')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    const diff = (Date.now() - date.getTime()) / 1000
    if (diff < 60) return 'az önce'
    if (diff < 3600) return `${Math.floor(diff/60)} dakika önce`
    if (diff < 86400) return `${Math.floor(diff/3600)} saat önce`
    if (diff < 604800) return `${Math.floor(diff/86400)} gün önce`
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#F4821F]" />
      </div>
    )
  }

  const avg = stats?.averageRating || 0
  const total = stats?.totalCount || 0
  const dist = stats?.distribution || {}

  const canReview = isAuthenticated && stats?.canUserReview === true
  const alreadyReviewed = isAuthenticated && stats?.userAlreadyReviewed === true

  return (
    <div className="space-y-5">

      {/* İstatistik kutusu */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 p-5 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        <div className="text-center md:text-left md:border-r md:pr-6"
          style={{ borderColor: 'var(--border)' }}>
          <div className="text-[42px] font-black tracking-[-1px] leading-none mb-1"
            style={{ color: 'var(--text-primary)' }}>
            {avg.toFixed(1)}
          </div>
          <div className="flex items-center gap-0.5 mb-1.5 justify-center md:justify-start">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={16}
                className={i <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            {total} müşteri yorumu
          </p>
        </div>

        <div className="space-y-1.5">
          {[5,4,3,2,1].map(r => {
            const count = Number(dist[r] || 0)
            const pct = total > 0 ? (count / total) * 100 : 0
            return (
              <div key={r} className="flex items-center gap-3 text-[11px]"
                style={{ color: 'var(--text-secondary)' }}>
                <span className="w-7 flex items-center gap-0.5 flex-shrink-0">
                  {r} <Star size={10} className="text-yellow-400 fill-yellow-400" />
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: '#F4821F' }} />
                </div>
                <span className="w-8 text-right tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Eligibility durumu */}
      {!isAuthenticated && (
        <div className="p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(244,130,31,0.08)', border: '1px solid rgba(244,130,31,0.2)' }}>
          <AlertCircle size={18} className="text-[#F4821F] flex-shrink-0" />
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Yorum yapabilmek için <a href="/giris" className="text-[#F4821F] font-bold underline">giriş yapmanız</a> gerekiyor.
          </p>
        </div>
      )}

      {isAuthenticated && alreadyReviewed && (
        <div className="p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="text-green-600">✓</span>
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Bu ürüne zaten yorum yaptınız. Teşekkürler!
          </p>
        </div>
      )}

      {isAuthenticated && !alreadyReviewed && !canReview && (
        <div className="p-5 rounded-xl text-center"
          style={{ background: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}>
          <MessageSquare size={22} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }}/>
          <p className="text-[13px] mb-1" style={{ color: 'var(--text-secondary)' }}>
            Yorum yapabilmek için bu ürünü <strong>satın almış</strong> olmanız gerekiyor.
          </p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Sadece doğrulanmış müşteriler yorum yapabilir.
          </p>
        </div>
      )}

      {isAuthenticated && canReview && !showForm && (
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 text-[13px] font-bold text-white rounded-xl transition-all"
          style={{
            background: 'linear-gradient(135deg, #F4821F, #e07010)',
            boxShadow: '0 4px 12px rgba(244,130,31,0.25)',
          }}>
          <MessageSquare size={14} />
          Bu ürüne yorum yap
        </button>
      )}

      {/* Form */}
      {showForm && canReview && (
        <div className="p-5 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          <h3 className="text-[15px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Yorumunuz
          </h3>

          {/* Puan */}
          <div className="mb-4">
            <label className="text-[11px] font-bold uppercase tracking-[1px] mb-2 flex items-center gap-1"
              style={{ color: 'var(--text-secondary)' }}>
              Puanınız <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i}
                  onMouseEnter={() => setFormHoverRating(i)}
                  onMouseLeave={() => setFormHoverRating(0)}
                  onClick={() => setFormRating(i)}
                  className="transition-transform hover:scale-110">
                  <Star size={28}
                    className={i <= (formHoverRating || formRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'} />
                </button>
              ))}
              <span className="ml-2 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {formRating > 0 ? `${formRating}/5` : 'Puan seçin'}
              </span>
            </div>
          </div>

          {/* Yorum */}
          <div className="mb-4">
            <label className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5 flex items-center gap-1"
              style={{ color: 'var(--text-secondary)' }}>
              Yorumunuz <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea value={formComment}
              onChange={e => setFormComment(e.target.value)}
              placeholder="Ürün hakkında deneyiminizi paylaşın..."
              maxLength={2000} rows={4}
              className="w-full px-3 py-2.5 text-[13px] rounded-lg outline-none resize-none focus:ring-2"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }} />
            <div className="text-right text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {formComment.length}/2000 <span className={formComment.trim().length < 10 ? 'text-red-500' : ''}>
                (min 10 karakter)
              </span>
            </div>
          </div>

          {/* Anonim toggle */}
          <div className="mb-4 p-3 rounded-lg flex items-start gap-3"
            style={{ background: 'var(--bg-secondary)' }}>
            <button onClick={() => setFormAnonymous(!formAnonymous)}
              className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5"
              style={{ background: formAnonymous ? '#F4821F' : 'var(--border)' }}>
              <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow"
                style={{ transform: formAnonymous ? 'translateX(22px)' : 'translateX(2px)' }} />
            </button>
            <div className="flex-1">
              <p className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                {formAnonymous && <EyeOff size={12} />}
                İsmimi gizle (Anonim olarak yayınla)
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {formAnonymous
                  ? '✓ Yorumunuz "Anonim Kullanıcı" olarak görünür'
                  : 'Yorumunuz isminizin bir kısmıyla görünür (örn. "Ali V.")'}
              </p>
            </div>
          </div>

          {/* Aksiyon */}
          <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setShowForm(false)} disabled={submitting}
              className="px-4 py-2 text-[12px] font-bold rounded-lg transition-colors disabled:opacity-50"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              İptal
            </button>
            <button onClick={handleSubmit}
              disabled={submitting || formRating < 1 || formComment.trim().length < 10}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[12px] font-bold text-white rounded-lg transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #F4821F, #e07010)' }}>
              {submitting ? <Loader2 size={14} className="animate-spin"/> : <Send size={14}/>}
              {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </button>
          </div>
        </div>
      )}

      {/* Yorum listesi */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }}/>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Henüz yorum yapılmamış.
            </p>
            {canReview && (
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                İlk yorumu siz yapın!
              </p>
            )}
          </div>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="p-4 rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                    style={{ background: r.anonymous ? '#6B7280' : 'linear-gradient(135deg, #F4821F, #e07010)' }}>
                    {r.anonymous ? <EyeOff size={13}/> : r.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {r.displayName}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={13}
                      className={i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap pl-[46px]"
                style={{ color: 'var(--text-secondary)' }}>
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}