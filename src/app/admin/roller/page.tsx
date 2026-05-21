'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Plus, Shield, ChevronDown, ChevronUp, Check, X, Edit2 } from 'lucide-react'

interface Permission {
  id: string; code: string; label: string; category: string
}
interface AppRole {
  id: string; name: string; description: string; isActive: boolean; permissions: Permission[]
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Sipariş': { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  'Ödeme': { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  'Ürün': { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
  'Kullanıcı': { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
  'Rapor': { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
}

export default function RollerPage() {
  const [roles, setRoles] = useState<AppRole[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPerms, setEditingPerms] = useState<Set<string>>(new Set())
  const [showCreate, setShowCreate] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', description: '', permissionIds: new Set<string>() })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [r, p] = await Promise.all([
        api.get('/api/admin/roles'),
        api.get('/api/admin/roles/permissions'),
      ])
      setRoles(r.data.data || [])
      setPermissions(p.data.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const groupedPerms = permissions.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Permission[]>)

  const startEdit = (role: AppRole) => {
    setEditingId(role.id)
    setEditingPerms(new Set(role.permissions.map(p => p.id)))
  }

  const saveEdit = async (roleId: string) => {
    setSaving(true)
    try {
      await api.put(`/api/admin/roles/${roleId}/permissions`, Array.from(editingPerms))
      toast.success('İzinler güncellendi')
      setEditingId(null)
      load()
    } catch { toast.error('Güncelleme başarısız') }
    finally { setSaving(false) }
  }

  const togglePerm = (permId: string, set: Set<string>, setFn: (s: Set<string>) => void) => {
    const next = new Set(set)
    if (next.has(permId)) next.delete(permId)
    else next.add(permId)
    setFn(next)
  }

  const handleToggleRole = async (roleId: string) => {
    try {
      await api.patch(`/api/admin/roles/${roleId}/toggle`)
      toast.success('Rol durumu güncellendi')
      load()
    } catch { toast.error('Güncelleme başarısız') }
  }

  const createRole = async () => {
    if (!newRole.name.trim()) { toast.error('Rol adı zorunlu'); return }
    setSaving(true)
    try {
      await api.post('/api/admin/roles', {
        name: newRole.name,
        description: newRole.description,
        permissionIds: Array.from(newRole.permissionIds),
      })
      toast.success('Rol oluşturuldu')
      setShowCreate(false)
      setNewRole({ name: '', description: '', permissionIds: new Set() })
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Oluşturma başarısız')
    } finally { setSaving(false) }
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Rol yönetimi</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">{roles.length} rol tanımlı · {permissions.length} izin mevcut</p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-[#F4821F] text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={14} /> Yeni rol
            </button>
          </div>

          {/* Yeni rol oluştur */}
          {showCreate && (
            <div className="bg-white dark:bg-[#141414] border border-[#F4821F] rounded-xl p-5 mb-4">
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-4">Yeni rol oluştur</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Rol adı</label>
                  <input type="text" placeholder="örn. Müşteri Hizmetleri"
                    value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                    className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Açıklama</label>
                  <input type="text" placeholder="Bu rolün görevi..."
                    value={newRole.description} onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                    className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
                </div>
              </div>

              <p className="text-[11px] font-medium text-gray-500 mb-2">İzinler</p>
              <div className="space-y-3 mb-4">
                {Object.entries(groupedPerms).map(([cat, perms]) => {
                  const c = categoryColors[cat] || { bg: 'bg-gray-50', text: 'text-gray-600' }
                  return (
                    <div key={cat}>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${c.bg} ${c.text} mb-1.5 inline-block`}>{cat}</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {perms.map(p => (
                          <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${newRole.permissionIds.has(p.id) ? 'border-[#F4821F] bg-orange-50 dark:bg-orange-500/10' : 'border-black/[0.06] dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.03]'}`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${newRole.permissionIds.has(p.id) ? 'bg-[#F4821F] border-[#F4821F]' : 'border-gray-300 dark:border-gray-600'}`}>
                              {newRole.permissionIds.has(p.id) && <Check size={10} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden"
                              checked={newRole.permissionIds.has(p.id)}
                              onChange={() => togglePerm(p.id, newRole.permissionIds, s => setNewRole({ ...newRole, permissionIds: s }))} />
                            <span className="text-[11px] text-gray-700 dark:text-gray-300">{p.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowCreate(false)}
                  className="text-[12px] text-gray-500 px-4 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                  İptal
                </button>
                <button onClick={createRole} disabled={saving}
                  className="text-[12px] font-medium bg-[#F4821F] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          )}

          {/* Rol listesi */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 h-20 animate-pulse" />
              ))
            ) : roles.map(role => {
              const isExpanded = expandedId === role.id
              const isEditing = editingId === role.id

              return (
                <div key={role.id} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden">
                  {/* Başlık */}
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield size={16} className="text-[#F4821F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100">{role.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${role.isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-gray-100 dark:bg-white/[0.06] text-gray-400'}`}>
                          {role.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{role.description} · {role.permissions.length} izin</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { startEdit(role); setExpandedId(role.id) }}
                        className="w-7 h-7 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-[#F4821F] hover:border-[#F4821F] transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => handleToggleRole(role.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${role.isActive ? 'border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}>
                        {role.isActive ? 'Pasif yap' : 'Aktif yap'}
                      </button>
                      <button onClick={() => setExpandedId(isExpanded ? null : role.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Genişletilmiş izin listesi */}
                  {isExpanded && (
                    <div className="border-t border-black/[0.07] dark:border-white/[0.07] p-4 bg-gray-50 dark:bg-white/[0.02]">
                      <div className="space-y-3 mb-4">
                        {Object.entries(groupedPerms).map(([cat, perms]) => {
                          const c = categoryColors[cat] || { bg: 'bg-gray-50', text: 'text-gray-600' }
                          return (
                            <div key={cat}>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${c.bg} ${c.text} mb-1.5 inline-block`}>{cat}</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                {perms.map(p => {
                                  const checked = isEditing ? editingPerms.has(p.id) : role.permissions.some(rp => rp.id === p.id)
                                  return (
                                    <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${isEditing ? 'cursor-pointer' : 'cursor-default'} ${checked ? 'border-[#F4821F] bg-orange-50 dark:bg-orange-500/10' : 'border-black/[0.06] dark:border-white/[0.06]'} ${isEditing && !checked ? 'hover:bg-gray-100 dark:hover:bg-white/[0.04]' : ''}`}>
                                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${checked ? 'bg-[#F4821F] border-[#F4821F]' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {checked && <Check size={10} className="text-white" />}
                                      </div>
                                      {isEditing && (
                                        <input type="checkbox" className="hidden" checked={checked}
                                          onChange={() => togglePerm(p.id, editingPerms, setEditingPerms)} />
                                      )}
                                      <span className="text-[11px] text-gray-700 dark:text-gray-300">{p.label}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {isEditing && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingId(null)}
                            className="text-[12px] text-gray-500 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors">
                            İptal
                          </button>
                          <button onClick={() => saveEdit(role.id)} disabled={saving}
                            className="text-[12px] font-medium bg-[#F4821F] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </AdminGuard>
  )
}
