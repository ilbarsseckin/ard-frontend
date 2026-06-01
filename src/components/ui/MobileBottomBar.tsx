'use client'
import { ShoppingCart } from 'lucide-react'

interface Props {
  price: number
  kdvDahil: boolean
  canOrder: boolean
  onOrder: () => void
}

export default function MobileBottomBar({ price, kdvDahil, canOrder, onOrder }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 shadow-lg"
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-muted)' }}>
          Toplam {kdvDahil ? '(KDV Dahil)' : '(KDV Hariç)'}
        </p>
        <p className="text-[18px] font-black tracking-[-0.5px] text-[#F4821F] leading-tight">
          ₺{price.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
        </p>
      </div>
      <button onClick={onOrder} disabled={!canOrder}
        className="flex items-center gap-1.5 px-5 py-3 text-[13px] font-bold text-white rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
        style={{
          background: canOrder ? 'linear-gradient(135deg, #F4821F, #e07010)' : '#9CA3AF',
          boxShadow: canOrder ? '0 6px 14px rgba(244,130,31,0.3)' : 'none',
        }}>
        <ShoppingCart size={14} />
        Hemen Al
      </button>
    </div>
  )
}
