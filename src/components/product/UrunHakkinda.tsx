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
  name: string
  longDesc?: string
  shortDesc?: string
  attributes: AttributeBlock[]
  tiers: Tier[]
}

/** attrKey/label'a gore uygun ikon */
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

const joinVals = (a: AttributeBlock) =>
  a.selectedOptions.map(o => o.value).join(', ') || '—'

const parseGram = (v: string) => {
  const m = v.match(/(\d{2,4})\s*g/i)
  return m ? parseInt(m[1], 10) : null
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[16px] font-bold mb-3.5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
      <span style={{ width: 4, height: 18, borderRadius: 2, background: '#F4821F', display: 'inline-block' }} />
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
    borderRadius: 12, padding: 14,
  } as const

  return (
    <div className="space-y-7">

      {(featureAttrs.length > 0 || minQty) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featureAttrs.map(a => {
            const Icon = iconFor(a.attrKey, a.label)
            return (
              <div key={a.attributeId} style={card}>
                <Icon size={22} style={{ color: '#F4821F' }} />
                <p className="text-[12px] mt-2 mb-0.5" style={{ color: 'var(--text-muted)' }}>{a.label}</p>
                <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{joinVals(a)}</p>
              </div>
            )
          })}
          {minQty != null && (
            <div style={card}>
              <Package size={22} style={{ color: '#F4821F' }} />
              <p className="text-[12px] mt-2 mb-0.5" style={{ color: 'var(--text-muted)' }}>Minimum adet</p>
              <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{minQty.toLocaleString('tr-TR')} adet</p>
            </div>
          )}
        </div>
      )}

      {product.shortDesc && (
        <div className="flex gap-3 items-start rounded-xl p-4"
          style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.25)' }}>
          <Sparkles size={20} style={{ color: '#F4821F', flex: 'none', marginTop: 2 }} />
          <p className="text-[13.5px] leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
            {product.shortDesc}
          </p>
        </div>
      )}

      {paperAttr && (() => {
        const opts = paperAttr.selectedOptions
        const grams = opts.map(o => parseGram(o.value))
        const maxG = Math.max(...grams.map(g => g ?? 0), 1)
        return (
          <div>
            <SectionTitle>{paperAttr.label}</SectionTitle>
            <div className="flex items-end justify-center gap-8 rounded-xl px-3 pt-5"
              style={{ background: 'var(--bg-secondary)', height: 170 }}>
              {opts.map((o, i) => {
                const g = grams[i]
                const h = g ? 50 + (g / maxG) * 90 : 60 + i * 25
                return (
                  <div key={o.id} className="flex flex-col items-center">
                    <div style={{ width: 50, height: h, borderRadius: '6px 6px 0 0', background: '#F4821F' }} />
                    <p className="text-[12px] mt-2 text-center leading-tight" style={{ color: 'var(--text-secondary)' }}>{o.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {lines.length > 0 && (
        <div>
          <SectionTitle>Öne çıkan özellikler</SectionTitle>
          {asChecklist ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {lines.map((l, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span style={{
                    flex: 'none', width: 20, height: 20, borderRadius: '50%', marginTop: 1,
                    background: 'rgba(244,130,31,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={13} style={{ color: '#F4821F' }} />
                  </span>
                  <span className="text-[13.5px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{l}</span>
                </div>
              ))}
            </div>
          ) : (
            lines.map((l, i) => (
              <p key={i} className="text-[14px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{l}</p>
            ))
          )}
        </div>
      )}

      {(attrs.length > 0 || minQty) && (
        <div>
          <SectionTitle>Teknik özellikler</SectionTitle>
          <table className="w-full text-[13px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <tbody>
              {attrs.map((a, i) => (
                <tr key={a.attributeId} style={{ background: i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)', width: '42%', borderRadius: '8px 0 0 8px' }}>{a.label}</td>
                  <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--text-primary)', borderRadius: '0 8px 8px 0' }}>{joinVals(a)}</td>
                </tr>
              ))}
              {minQty != null && (
                <tr style={{ background: attrs.length % 2 === 0 ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td className="py-2.5 px-3" style={{ color: 'var(--text-muted)', borderRadius: '8px 0 0 8px' }}>Minimum adet</td>
                  <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--text-primary)', borderRadius: '0 8px 8px 0' }}>{minQty.toLocaleString('tr-TR')} adet</td>
                </tr>
              )}
            </tbody>
          </table>
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