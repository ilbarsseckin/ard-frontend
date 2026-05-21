import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartApi } from '@/lib/api'

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

interface CartStore {
  items: CartItem[]
  cartId?: string
  loading: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => Promise<void>
  clear: () => Promise<void>
  setCartId: (id: string) => void
  syncFromBackend: () => Promise<void>
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: undefined,
      loading: false,

      addItem: (item) => set(s => ({ items: [...s.items, item] })),

      removeItem: async (id: string) => {
        // Optimistic update — önce UI'dan kaldır
        set(s => ({ items: s.items.filter(i => i.id !== id) }))
        try {
          await cartApi.removeItem(id)
        } catch (err) {
          // Backend hatası: backend'den taze veriyi çek
          console.error('Sepetten silme hatası, yeniden senkronize ediliyor', err)
          get().syncFromBackend()
        }
      },

      clear: async () => {
        set({ items: [], cartId: undefined })
        try {
          await cartApi.clear()
        } catch (err) {
          console.error('Sepet temizleme hatası', err)
        }
      },

      setCartId: (id) => set({ cartId: id }),

      syncFromBackend: async () => {
        set({ loading: true })
        try {
          const res = await cartApi.get()
          const cart = res.data.data
          if (!cart) return
          const mappedItems: CartItem[] = (cart.items || []).map((i: any) => ({
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
          set({ items: mappedItems, cartId: String(cart.cartId) })
        } catch (err) {
          // 401 → kullanıcı giriş yapmamış, local state yeterli
          console.warn('Backend sepet senkronizasyonu yapılamadı', err)
        } finally {
          set({ loading: false })
        }
      },

      subtotal: () => get().items.reduce((acc, i) => acc + i.totalPrice, 0),
    }),
    { name: 'baski-cart' }
  )
)