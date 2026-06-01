import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartApi } from '@/lib/api'

// ─── Eski statik ürünler için (backend-driven) ───
export interface CartItem {
  id: string
  productSlug: string
  productName: string
  widthCm?: number
  heightCm?: number
  quantity: number
  unitPrice: number
  totalPrice: number
  priceBreakdown: string
  fileOriginalName?: string
  filePagesCount?: number
  declaredPrints: number
  hasFile?: boolean
  pageWarning?: boolean
}

// ─── Yeni katalog ürünleri için (local-only, zustand persist) ───
export interface CatalogCartAttribute {
  attributeId: string
  attrKey: string
  label: string
  optionId: string
  optionValue: string
}

export interface CatalogCartItem {
  id: string  // local UUID
  productId: string
  productSlug: string
  productName: string
  mainImageUrl?: string
  categoryName: string
  categorySlug: string
  tierId: string
  tierQty: number

  // ─── FİYAT ALANLARI ───
  priceUsd: number      // base × modifier (USD) — referans için
  priceTl: number       // ✅ DONMUŞ FİNAL TL (KDV dahil) — bu fiyat değişmez
  kurAtAdd: number      // o anki kur (transparency)

  attributes: CatalogCartAttribute[]
  addedAt: number

  // ─── Tasarım ───
  designFileIds?: string[]
  designSupport?: {
    requested: boolean
    notes: string
  }
}

interface CartStore {
  // ─ Eski ─
  items: CartItem[]
  cartId?: string
  subtotal: number
  loading: boolean

  // ─ Yeni katalog ─
  catalogItems: CatalogCartItem[]

  applyCartResponse: (cart: any) => string | undefined
  removeItem: (id: string) => Promise<void>
  clear: () => Promise<void>
  syncFromBackend: () => Promise<void>
  computedSubtotal: () => number

  // ─ Katalog methodları ─
  addCatalogItem: (item: Omit<CatalogCartItem, 'id' | 'addedAt'>) => string
  removeCatalogItem: (id: string) => void
  clearCatalog: () => void
  catalogSubtotalTl: () => number  // ✅ YENİ: TL bazlı (frozen)
}

function mapItems(raw: any[]): CartItem[] {
  return (raw || []).map((i: any) => ({
    id: String(i.id),
    productSlug: i.productSlug || '',
    productName: i.productName || '',
    widthCm: i.widthCm,
    heightCm: i.heightCm,
    quantity: i.quantity,
    unitPrice: Number(i.unitPrice),
    totalPrice: Number(i.totalPrice),
    priceBreakdown: i.priceBreakdown || '',
    fileOriginalName: i.fileOriginalName,
    filePagesCount: i.filePagesCount,
    declaredPrints: i.declaredPrints ?? 1,
    hasFile: i.hasFile,
    pageWarning: i.pageWarning,
  }))
}

function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: undefined,
      subtotal: 0,
      loading: false,
      catalogItems: [],

      applyCartResponse: (cart) => {
        if (!cart) return undefined
        set({
          items: mapItems(cart.items),
          cartId: cart.cartId ? String(cart.cartId) : undefined,
          subtotal: Number(cart.subtotal ?? 0),
        })
        return cart.addedItemId ? String(cart.addedItemId) : undefined
      },

      removeItem: async (id: string) => {
        const prev = get().items
        const prevSubtotal = get().subtotal
        set({
          items: prev.filter(i => i.id !== id),
          subtotal: prev.filter(i => i.id !== id).reduce((a, x) => a + x.totalPrice, 0),
        })
        try {
          const res = await cartApi.removeItem(id)
          get().applyCartResponse(res.data?.data)
        } catch (err) {
          set({ items: prev, subtotal: prevSubtotal })
          console.error('Sepetten silme hatası', err)
          throw err
        }
      },

      clear: async () => {
        set({ items: [], cartId: undefined, subtotal: 0 })
        try {
          await cartApi.clear()
        } catch (err) {
          console.warn('Sepet temizleme backend hatası', err)
        }
      },

      syncFromBackend: async () => {
        set({ loading: true })
        try {
          const res = await cartApi.get()
          get().applyCartResponse(res.data?.data)
        } catch (err) {
          console.warn('Backend sepet senkronizasyonu yapılamadı', err)
        } finally {
          set({ loading: false })
        }
      },

      computedSubtotal: () => get().items.reduce((a, i) => a + i.totalPrice, 0),

      // ─── Katalog methodları ───

      addCatalogItem: (item) => {
        const id = genId()
        const newItem: CatalogCartItem = { ...item, id, addedAt: Date.now() }
        set(state => ({ catalogItems: [...state.catalogItems, newItem] }))
        return id
      },

      removeCatalogItem: (id) => {
        set(state => ({ catalogItems: state.catalogItems.filter(i => i.id !== id) }))
      },

      clearCatalog: () => {
        set({ catalogItems: [] })
      },

      // ✅ Donmuş TL fiyatları topla (recalc yok)
      catalogSubtotalTl: () =>
        get().catalogItems.reduce((a, i) => a + Number(i.priceTl || 0), 0),
    }),
    { name: 'baski-cart' }
  )
)