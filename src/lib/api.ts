import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('baski-auth')
    if (stored) {
      const { state } = JSON.parse(stored)
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('baski-auth')
      window.location.href = '/giris'
    }
    return Promise.reject(err)
  }
)

export default api

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/api/auth/register', data),
}

export const productApi = {
  list: () => api.get('/api/products'),
  getBySlug: (slug: string) => api.get(`/api/products/${slug}`),
  calculatePrice: (data: {
    productSlug: string; widthCm?: number; heightCm?: number
    quantity: number; options?: Record<string, string>
  }) => api.post('/api/products/calculate-price', data),
}

export const cartApi = {
  get: () => api.get('/api/cart'),
  addItem: (data: {
    productSlug: string; widthCm?: number; heightCm?: number
    quantity: number; declaredPrints?: number; options?: Record<string, string>
  }) => api.post('/api/cart/items', data),
  removeItem: (itemId: string) => api.delete(`/api/cart/items/${itemId}`),
  clear: () => api.delete('/api/cart'),
  uploadFile: (itemId: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/api/cart/items/${itemId}/file`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export const orderApi = {
  checkout: (addressId: string) =>
    api.post(`/api/orders/checkout?addressId=${addressId}`),
  list: () => api.get('/api/orders'),
  get: (id: string) => api.get(`/api/orders/${id}`),
  history: (id: string) => api.get(`/api/orders/${id}/history`),
}

export const addressApi = {
  list: () => api.get('/api/addresses'),
  add: (data: {
    title: string; fullName: string; phone: string
    addressLine: string; district: string; city: string; isDefault?: boolean
  }) => api.post('/api/addresses', data),
  update: (id: string, data: object) => api.put(`/api/addresses/${id}`, data),
  delete: (id: string) => api.delete(`/api/addresses/${id}`),
}

export const paymentApi = {
  initiate: (data: {
    orderId: string; cardHolderName: string; cardNumber: string
    expireMonth: string; expireYear: string; cvc: string; callbackUrl?: string
  }) => api.post('/api/payments/initiate', data),
}

export const userApi = {
  profile: () => api.get('/api/user/profile'),
  updateProfile: (data: { name: string; phone?: string }) =>
    api.put('/api/user/profile', data),
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if ((err.response?.status === 401 || err.response?.status === 400) && typeof window !== 'undefined') {
      // Sadece auth endpoint'leri değilse
      const url = err.config?.url || ''
      if (!url.includes('/api/auth/')) {
        const stored = localStorage.getItem('baski-auth')
        if (!stored) {
          window.location.href = '/giris'
        }
      }
    }
    return Promise.reject(err)
  }
)