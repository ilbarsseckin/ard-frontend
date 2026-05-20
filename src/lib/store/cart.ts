import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  declaredPrints: number
}

interface CartStore {
  items: CartItem[]
  cartId?: string
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clear: () => void
  setCartId: (id: string) => void
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: undefined,
      addItem: (item) => set(s => ({ items: [...s.items, item] })),
      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      clear: () => set({ items: [], cartId: undefined }),
      setCartId: (id) => set({ cartId: id }),
      subtotal: () => get().items.reduce((acc, i) => acc + i.totalPrice, 0),
    }),
    { name: 'baski-cart' }
  )
)
