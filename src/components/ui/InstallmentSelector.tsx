'use client'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Loader2, CreditCard, Check } from 'lucide-react'

interface InstallmentRow {
  installment: number
  monthlyPrice: number
  totalPrice: number
  bankName: string
  cardAssociation: string
  cardFamilyName: string
}

interface Props {
  binNumber: string       // ilk 6 hane
  totalTl: number
  selected: number        // seçili taksit sayısı
  onChange: (count: number, totalPrice: number) => void
}

export default function InstallmentSelector({ binNumber, totalTl, selected, onChange }: Props) {
  const [rows, setRows] = useState<InstallmentRow[]>([])
  const [loading, setLoading] = useState(false)
  const [bankName, setBankName] = useState('')

  const fetchInstallments = useCallback(async (bin: string) => {
    if (bin.length < 6) { setRows([]); return }
    setLoading(true)
    try {
      const res = await api.get('/api/installment', {
        params: { binNumber: bin, price: totalTl }
      })
      const data: InstallmentRow[] = res.data.data || []
      setRows(data)
      if (data.length > 0 && data[0].bankName) setBankName(data[0].bankName)
      // Varsayılan olarak tek çekim seç
      const single = data.find(r => r.installment === 1)
      if (single) onChange(1, single.totalPrice)
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [totalTl])

  useEffect(() => {
    if (binNumber.length >= 6) {
      fetchInstallments(binNumber)
    } else {
      setRows([])
    }
  }, [binNumber, fetchInstallments])

  if (binNumber.length < 6) return null

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3">
        <Loader2 size={14} className="animate-spin text-[#F4821F]" />
        <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          Taksit seçenekleri yükleniyor...
        </span>
      </div>
    )
  }

  if (rows.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[12px] font-bold uppercase tracking-[1px]"
          style={{ color: 'var(--text-secondary)' }}>
          Taksit Seçeneği
        </label>
        {bankName && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
            style={{ background: 'rgba(244,130,31,0.1)' }}>
            <CreditCard size={11} style={{ color: '#F4821F' }} />
            <span className="text-[10px] font-bold" style={{ color: '#F4821F' }}>
              {bankName}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {rows.map(row => {
          const isSelected = selected === row.installment
          const hasExtra = row.totalPrice > totalTl + 0.01
          return (
            <button
              key={row.installment}
              type="button"
              onClick={() => onChange(row.installment, row.totalPrice)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: isSelected ? 'rgba(244,130,31,0.08)' : 'var(--bg-secondary)',
                border: isSelected ? '1.5px solid #F4821F' : '1px solid var(--border)',
              }}>
              <div>
                <p className="text-[12px] font-bold" style={{ color: isSelected ? '#F4821F' : 'var(--text-primary)' }}>
                  {row.installment === 1 ? 'Tek Çekim' : `${row.installment} Taksit`}
                </p>
                {row.installment > 1 && (
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {hasExtra ? `Toplam ₺${Number(row.totalPrice).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : 'Komisyonsuz'}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[13px] font-black" style={{ color: isSelected ? '#F4821F' : 'var(--text-primary)' }}>
                  ₺{Number(row.monthlyPrice).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </p>
                {row.installment > 1 && (
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>/ay</p>
                )}
              </div>
              {isSelected && (
                <Check size={14} className="ml-2 flex-shrink-0 text-[#F4821F]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
