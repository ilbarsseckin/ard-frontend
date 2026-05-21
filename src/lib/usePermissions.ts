import { useState, useEffect } from 'react'
import api from './api'
import { useAuthStore } from './store/auth'

let cachedPerms: Set<string> | null = null
let cacheUserId: string | null = null

export function usePermissions() {
  const { user } = useAuthStore()
  const [permissions, setPermissions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    if (user.role === 'ADMIN') {
      setPermissions(new Set(['*']))
      setLoading(false)
      return
    }

    if (cachedPerms && cacheUserId === user.id) {
      setPermissions(cachedPerms)
      setLoading(false)
      return
    }

    api.get(`/api/admin/roles/users/${user.id}/permissions`)
      .then(res => {
        const perms = new Set<string>(res.data.data || [])
        cachedPerms = perms
        cacheUserId = user.id || null
        setPermissions(perms)
      })
      .catch(() => setPermissions(new Set()))
      .finally(() => setLoading(false))
  }, [user])

  const has = (code: string) => {
    if (permissions.has('*')) return true
    return permissions.has(code)
  }

  const hasAny = (...codes: string[]) => codes.some(c => has(c))

  return { permissions, loading, has, hasAny }
}
