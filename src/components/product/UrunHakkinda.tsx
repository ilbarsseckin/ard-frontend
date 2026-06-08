'use client'
import {
  Layers, Ruler, Printer, Droplets, Package, Sparkles,
  Gem, Scissors, Palette, LayoutGrid, Check,
} from 'lucide-react'

interface AttrOption { id: string; value: string; colorHex?: string; priceModifier?: number }
interface AttributeBlock {
  attributeId: string; attrKey: string; label: string
  inputType: string; required: boolean; sortOrder: number
  selectedOptions: AttrOption[]
}
interface Tier { id: string; qty: number; priceUsd: number; sortOrder: number }
interface ProductLike {
  name: string; longDesc?: string; shortDesc?: string
  attributes: AttributeBlock[]; tiers: Tier[]
}

function iconFor(key: string, label: string) {
  const s = (key + ' ' + label).toLowerCase()
  if (/(kagit|kağıt|kalinlik|kalınlık|kuşe|kuse)/.test(s)) return Layers
  if (/(malzeme|materyal|pvc|kumaş|kumas)/.test(s)) return Gem
  if (/(ebat|boyut|ölçü|olcu|ölcü)/.test(s)) return Ruler
  if (/(kesim)/.test(s)) return Scissors
  if (/(renk|cmyk|rengi)/.test(s)) return Palette
  if (/(tasarım|tasarim)/.test(s) && /(yön|yon)/.test(s)) return LayoutGrid
  if (/(bask)/.test(s)) return Printer
  if (/(selefon|lamin|kaplama|lak|mat|parlak)/.test(s)) return Droplets
  return Sparkles
}

const joinVals = (a: AttributeBlock) => a.selectedOptions.map(o => o.value).join(', ') || '—'
const parseGram = (v: string) => { const m = v.match(/(\d{2,4})\s*g/i); return m ? parseInt(m[1], 10) : null }

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
      <span style={{ width: 4, height: 16, borderRadius: 2, background: '#F4821F', display: 'inline-block', flexShrink: 0 }} />
      {children}
    </h3>
  )
}

export default function UrunHakkinda({ product }: { product: ProductLike }) {
  const attrs = (product.attributes || []).filter(a => a.selectedOptions.length > 0)
  const tiers = product.tiers || []
  const minQty = tiers.length ? Math.min(...tiers.map(t => t.qty)) : null
  const featureAttrs = attrs.slice(0, 3)

  const paperAttr = attrs.find(a => {
    const s = (a.attrKey + ' ' + a.label).toLowerCase()
    return /(kagit|kağıt|kalinlik|kalınlık)/.test(s) && a.selectedOptions.length >= 2
  })

  const lines = (product.longDesc || '').split(/\n+/).map(l => l.trim()).filter(Boolean)
  const avgLen = lines.length ? lines.reduce((s, l) => s + l.length, 0) / lines.length : 0
  const asChecklist = lines.length >= 4 && avgLen < 90

  const card = {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 12,
  } as const

  return (
    <div className="space-y-6">

      {/* Özellik kartları — mobilde 2 kolon, masaüstünde 4 */}
      {(featureAttrs.length > 0 || minQty) && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3"
          style={{ gridTemplateColumns: `repeat(${Math.min(featureAttrs.length + (minQty != null ? 1 : 0), 4)}, 1fr)` }}>
          {featureAttrs.map(a => {
            const Icon = iconFor(a.attrKey, a.label)
            return (
              <div key={a.attributeId} style={card}>
                <Icon size={18} style={{ color: '#F4821F' }} />
                <p className="text-[10px] sm:text-[11px] mt-1.5 mb-0.5" style={{ color: 'var(--text-muted)' }}>{a.label}</p>
                <p className="text-[12px] sm:text-[13px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{joinVals(a)}</p>
              </div>
            )
          })}
          {minQty != null && (
            <div style={card}>
              <Package size={18} style={{ color: '#F4821F' }} />
              <p className="text-[10px] sm:text-[11px] mt-1.5 mb-0.5" style={{ color: 'var(--text-muted)' }}>Minimum adet</p>
              <p className="text-[12px] sm:text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{minQty.toLocaleString('tr-TR')} adet</p>
            </div>
          )}
        </div>
      )}

      {/* Kısa açıklama */}
      {product.shortDesc && (
        <div className="flex gap-2.5 items-start rounded-xl p-3 sm:p-4"
          style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.25)' }}>
          <Sparkles size={16} style={{ color: '#F4821F', flexShrink: 0, marginTop: 2 }} />
          <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
            {product.shortDesc}
          </p>
        </div>
      )}

      {/* Kağıt grafiği — mobilde yatay scroll */}
      {paperAttr && (() => {
        const opts = paperAttr.selectedOptions
        const grams = opts.map(o => parseGram(o.value))
        const maxG = Math.max(...grams.map(g => g ?? 0), 1)
        return (
          <div>
            <SectionTitle>{paperAttr.label}</SectionTitle>
            <div className="overflow-x-auto scrollbar-hide rounded-xl"
              style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-end gap-4 sm:gap-6 px-4 pt-5 pb-3"
                style={{ minWidth: opts.length * 70 }}>
                {opts.map((o, i) => {
                  const g = grams[i]
                  const h = g ? 40 + (g / maxG) * 80 : 50 + i * 20
                  return (
                    <div key={o.id} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 52 }}>
                      <div style={{ width: 44, height: h, borderRadius: '5px 5px 0 0', background: '#F4821F' }} />
                      <p className="text-[10px] sm:text-[11px] mt-1.5 text-center leading-tight"
                        style={{ color: 'var(--text-secondary)' }}>{o.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Özellikler listesi */}
      {lines.length > 0 && (
        <div>
          <SectionTitle>Öne çıkan özellikler</SectionTitle>
          {asChecklist ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {lines.map((l, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%', marginTop: 2,
                    background: 'rgba(244,130,31,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={11} style={{ color: '#F4821F' }} />
                  </span>
                  <span className="text-[12px] sm:text-[13px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{l}</span>
                </div>
              ))}
            </div>
          ) : (
            lines.map((l, i) => (
              <p key={i} className="text-[13px] leading-relaxed mb-2.5" style={{ color: 'var(--text-secondary)' }}>{l}</p>
            ))
          )}
        </div>
      )}

      {/* Teknik özellikler tablosu */}
      {(attrs.length > 0 || minQty) && (
        <div>
          <SectionTitle>Teknik özellikler</SectionTitle>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-[12px] sm:text-[13px]">
              <tbody>
                {attrs.map((a, i) => (
                  <tr key={a.attributeId}
                    style={{ background: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-card)' }}>
                    <td className="py-2.5 px-3 sm:px-4" style={{ color: 'var(--text-muted)', width: '42%' }}>{a.label}</td>
                    <td className="py-2.5 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{joinVals(a)}</td>
                  </tr>
                ))}
                {minQty != null && (
                  <tr style={{ background: attrs.length % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-card)' }}>
                    <td className="py-2.5 px-3 sm:px-4" style={{ color: 'var(--text-muted)' }}>Minimum adet</td>
                    <td className="py-2.5 px-3 sm:px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{minQty.toLocaleString('tr-TR')} adet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lines.length === 0 && attrs.length === 0 && !product.shortDesc && (
        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Ürün hakkında detaylı bilgi yakında eklenecek.
        </p>
      )}
    </div>
  )
}