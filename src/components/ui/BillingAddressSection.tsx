'use client'
// Bu bileşen SepetPage içindeki katalog sipariş modalına fatura adresi ekler.
// Aşağıdaki state'leri SepetPage'e ekle:

/*
  const [sameBillingAddress, setSameBillingAddress] = useState(true)
  const [corporateInvoice, setCorporateInvoice] = useState(false)
  const [billingForm, setBillingForm] = useState({
    companyName: '',
    taxNumber: '',
    taxOffice: '',
    billingAddress: '',
    billingCity: '',
    billingDistrict: '',
  })
*/

// SepetPage'deki sipariş formuna şu alanları ekle (submitCatalogOrder içinde):
/*
  const body = {
    ...orderForm,
    items: orderItems,
    // Fatura bilgileri
    sameBillingAddress,
    corporateInvoice,
    ...(corporateInvoice ? {
      invoiceCompanyName: billingForm.companyName,
      invoiceTaxNumber: billingForm.taxNumber,
      invoiceTaxOffice: billingForm.taxOffice,
    } : {}),
    ...(!sameBillingAddress ? {
      billingAddress: billingForm.billingAddress,
      billingCity: billingForm.billingCity,
      billingDistrict: billingForm.billingDistrict,
    } : {}),
  }
*/

// Modal içinde, "Not" alanından sonra şu JSX'i ekle:
import { Building2, Receipt } from 'lucide-react'

interface BillingFormData {
  companyName: string
  taxNumber: string
  taxOffice: string
  billingAddress: string
  billingCity: string
  billingDistrict: string
}

interface BillingAddressSectionProps {
  orderForm: { customerAddress: string; city: string; district: string; customerName: string }
  sameBilling: boolean
  onSameBillingChange: (v: boolean) => void
  corporate: boolean
  onCorporateChange: (v: boolean) => void
  billingForm: BillingFormData
  onBillingFormChange: (f: BillingFormData) => void
}

export default function BillingAddressSection({
  orderForm, sameBilling, onSameBillingChange,
  corporate, onCorporateChange, billingForm, onBillingFormChange,
}: BillingAddressSectionProps) {
  return (
    <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>

      {/* Başlık */}
      <div className="flex items-center gap-2 mb-3">
        <Receipt size={14} style={{ color: '#F4821F' }} />
        <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Fatura Bilgileri</p>
      </div>

      {/* Aynı adres toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer mb-3 p-3 rounded-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <input type="checkbox" checked={sameBilling}
          onChange={e => onSameBillingChange(e.target.checked)}
          className="accent-[#F4821F]" />
        <div>
          <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Teslimat adresi fatura adresi olarak kullanılsın
          </p>
          {sameBilling && orderForm.customerAddress && (
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {orderForm.customerAddress}{orderForm.city ? `, ${orderForm.district}/${orderForm.city}` : ''}
            </p>
          )}
        </div>
      </label>

      {/* Farklı fatura adresi */}
      {!sameBilling && (
        <div className="space-y-3 mb-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
              style={{ color: 'var(--text-muted)' }}>
              Fatura Adresi <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea value={billingForm.billingAddress}
              onChange={e => onBillingFormChange({ ...billingForm, billingAddress: e.target.value })}
              rows={2} placeholder="Fatura adresi..."
              className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none resize-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                style={{ color: 'var(--text-muted)' }}>Şehir</label>
              <input value={billingForm.billingCity}
                onChange={e => onBillingFormChange({ ...billingForm, billingCity: e.target.value })}
                placeholder="İstanbul"
                className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                style={{ color: 'var(--text-muted)' }}>İlçe</label>
              <input value={billingForm.billingDistrict}
                onChange={e => onBillingFormChange({ ...billingForm, billingDistrict: e.target.value })}
                placeholder="Kadıköy"
                className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Kurumsal fatura toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <input type="checkbox" checked={corporate}
          onChange={e => onCorporateChange(e.target.checked)}
          className="accent-[#F4821F]" />
        <div className="flex items-center gap-1.5">
          <Building2 size={13} style={{ color: corporate ? '#F4821F' : 'var(--text-muted)' }} />
          <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Kurumsal fatura istiyorum
          </p>
        </div>
      </label>

      {/* Kurumsal fatura formu */}
      {corporate && (
        <div className="space-y-3 mt-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
              style={{ color: 'var(--text-muted)' }}>
              Firma Adı <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input value={billingForm.companyName}
              onChange={e => onBillingFormChange({ ...billingForm, companyName: e.target.value })}
              placeholder="Örnek A.Ş."
              className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                style={{ color: 'var(--text-muted)' }}>
                Vergi No <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={billingForm.taxNumber}
                onChange={e => onBillingFormChange({ ...billingForm, taxNumber: e.target.value.replace(/\D/g, '') })}
                placeholder="1234567890"
                maxLength={11}
                className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none font-mono"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                style={{ color: 'var(--text-muted)' }}>
                Vergi Dairesi <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input value={billingForm.taxOffice}
                onChange={e => onBillingFormChange({ ...billingForm, taxOffice: e.target.value })}
                placeholder="Kadıköy V.D."
                className="w-full px-3.5 py-2.5 text-[13px] rounded-xl outline-none"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div className="p-3 rounded-xl text-[11px] leading-relaxed"
            style={{ background: 'rgba(244,130,31,0.06)', border: '1px solid rgba(244,130,31,0.2)', color: 'var(--text-secondary)' }}>
            ℹ️ Kurumsal faturanız, sipariş teslim edildikten sonra e-posta ile iletilecektir.
          </div>
        </div>
      )}
    </div>
  )
}
