'use client'
import { useState, useEffect } from 'react'
import AdminNavbar from '@/components/layout/AdminNavbar'
import AdminGuard from '@/components/layout/AdminGuard'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Shield, X, ChevronDown, ChevronUp, Search, Plus, Edit2, Trash2, Check } from 'lucide-react'

interface AppRole { id: string; name: string; isActive: boolean }
interface UserItem { id: string; name: string; email: string; role: string; phone?: string; createdAt?: string }
interface UserRole { id: string; name: string }

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-50 dark:bg-red-500/10 text-red-600',
  OPERATOR: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
  CUSTOMER: 'bg-gray-100 dark:bg-white/[0.06] text-gray-500',
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin', OPERATOR: 'Operatör', CUSTOMER: 'Müşteri'
}

export default function KullanicilarPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [roles, setRoles] = useState<AppRole[]>([])
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({})
  const [showCreate, setShowCreate] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' })
  const [editForm, setEditForm] = useState({ name: '', phone: '', role: '' })

  const load = async () => {
    setLoading(true)
    try {
      const [u, r] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/roles'),
      ])
      setUsers(u.data.data || [])
      setRoles(r.data.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const loadUserRoles = async (userId: string) => {
    try {
      const res = await api.get(`/api/admin/roles/users/${userId}/roles`)
      setUserRoles(prev => ({ ...prev, [userId]: res.data.data || [] }))
    } catch {}
  }

  const toggleExpand = async (userId: string) => {
    if (expandedId === userId) { setExpandedId(null); return }
    setExpandedId(userId)
    await loadUserRoles(userId)
  }

  const assignRole = async (userId: string) => {
    const roleId = selectedRole[userId]
    if (!roleId) { toast.error('Rol seçin'); return }
    setAssigning(userId)
    try {
      await api.post('/api/admin/roles/assign', { userId, appRoleId: roleId })
      toast.success('Rol atandı')
      await loadUserRoles(userId)
      setSelectedRole(prev => ({ ...prev, [userId]: '' }))
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rol atanamadı')
    } finally { setAssigning(null) }
  }

  const removeRole = async (userId: string, appRoleId: string) => {
    try {
      await api.delete(`/api/admin/roles/users/${userId}/roles/${appRoleId}`)
      toast.success('Rol kaldırıldı')
      await loadUserRoles(userId)
    } catch { toast.error('Rol kaldırılamadı') }
  }

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Ad, e-posta ve şifre zorunlu'); return
    }
    setSaving(true)
    try {
      await api.post('/api/admin/users', newUser)
      toast.success('Kullanıcı oluşturuldu')
      setShowCreate(false)
      setNewUser({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' })
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Oluşturma başarısız')
    } finally { setSaving(false) }
  }

  const startEdit = (u: UserItem) => {
    setEditingUser(u)
    setEditForm({ name: u.name, phone: u.phone || '', role: u.role })
  }

  const saveEdit = async () => {
    if (!editingUser) return
    setSaving(true)
    try {
      await api.put(`/api/admin/users/${editingUser.id}`, editForm)
      toast.success('Kullanıcı güncellendi')
      setEditingUser(null)
      load()
    } catch { toast.error('Güncelleme başarısız') }
    finally { setSaving(false) }
  }

  const deleteUser = async (userId: string, name: string) => {
    if (!confirm(`${name} kullanıcısını silmek istediğinize emin misiniz?`)) return
    try {
      await api.delete(`/api/admin/users/${userId}`)
      toast.success('Kullanıcı silindi')
      load()
    } catch { toast.error('Silme başarısız') }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-medium tracking-[-0.5px] text-gray-900 dark:text-gray-100">Kullanıcı yönetimi</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">{users.length} kullanıcı kayıtlı</p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-[#F4821F] text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={14} /> Yeni kullanıcı
            </button>
          </div>

          {/* Yeni kullanıcı formu */}
          {showCreate && (
            <div className="bg-white dark:bg-[#141414] border border-[#F4821F] rounded-xl p-5 mb-4">
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-4">Yeni kullanıcı oluştur</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { key: 'name', label: 'Ad Soyad', type: 'text', placeholder: 'Ahmet Yılmaz' },
                  { key: 'email', label: 'E-posta', type: 'email', placeholder: 'ahmet@firma.com' },
                  { key: 'password', label: 'Şifre', type: 'password', placeholder: 'En az 6 karakter' },
                  { key: 'phone', label: 'Telefon (opsiyonel)', type: 'tel', placeholder: '05001234567' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={(newUser as any)[f.key]}
                      onChange={e => setNewUser({ ...newUser, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Sistem rolü</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]">
                  <option value="CUSTOMER">Müşteri</option>
                  <option value="OPERATOR">Operatör</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowCreate(false)}
                  className="text-[12px] text-gray-500 px-4 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                  İptal
                </button>
                <button onClick={createUser} disabled={saving}
                  className="text-[12px] font-medium bg-[#F4821F] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          )}

          {/* Düzenle modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 w-full max-w-md">
                <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100 mb-4">Kullanıcı düzenle</p>
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Ad Soyad</label>
                    <input type="text" value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Telefon</label>
                    <input type="tel" value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Sistem rolü</label>
                    <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]">
                      <option value="CUSTOMER">Müşteri</option>
                      <option value="OPERATOR">Operatör</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingUser(null)}
                    className="text-[12px] text-gray-500 px-4 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                    İptal
                  </button>
                  <button onClick={saveEdit} disabled={saving}
                    className="text-[12px] font-medium bg-[#F4821F] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Arama */}
          <div className="relative mb-4 max-w-[320px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="İsim veya e-posta ara..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#141414] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]" />
          </div>

          {/* Kullanıcı listesi */}
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-4 h-16 animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl p-8 text-center">
                <p className="text-[13px] text-gray-400">Kullanıcı bulunamadı</p>
              </div>
            ) : filtered.map(u => {
              const isExpanded = expandedId === u.id
              const uRoles = userRoles[u.id] || []

              return (
                <div key={u.id} className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0 cursor-pointer"
                      onClick={() => toggleExpand(u.id)}>
                      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(u.id)}>
                      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">{u.name}</p>
                      <p className="text-[11px] text-gray-400">{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${roleColors[u.role] || 'bg-gray-100 text-gray-500'}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                      <button onClick={() => startEdit(u)}
                        className="w-7 h-7 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-[#F4821F] hover:border-[#F4821F] transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => deleteUser(u.id, u.name)}
                        className="w-7 h-7 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                        <Trash2 size={12} />
                      </button>
                      <button onClick={() => toggleExpand(u.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-black/[0.07] dark:border-white/[0.07] p-4 bg-gray-50 dark:bg-white/[0.02]">
                      {uRoles.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[11px] font-medium text-gray-500 mb-2">Atanmış özel roller</p>
                          <div className="flex flex-wrap gap-2">
                            {uRoles.map(r => (
                              <div key={r.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/[0.07]">
                                <Shield size={11} className="text-[#F4821F]" />
                                <span className="text-[12px] text-gray-700 dark:text-gray-300">{r.name}</span>
                                <button onClick={() => removeRole(u.id, r.id)}
                                  className="ml-1 text-gray-300 hover:text-red-500 transition-colors">
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-[11px] font-medium text-gray-500 mb-2">Özel rol ata</p>
                        <div className="flex gap-2">
                          <select value={selectedRole[u.id] || ''}
                            onChange={e => setSelectedRole(prev => ({ ...prev, [u.id]: e.target.value }))}
                            className="flex-1 px-3 py-2 text-[13px] border border-black/[0.08] dark:border-white/[0.08] rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 outline-none focus:border-[#F4821F]">
                            <option value="">Rol seçin...</option>
                            {roles.filter(r => r.isActive && !uRoles.some(ur => ur.id === r.id)).map(r => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                          <button onClick={() => assignRole(u.id)}
                            disabled={assigning === u.id || !selectedRole[u.id]}
                            className="bg-[#F4821F] text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            {assigning === u.id ? 'Atanıyor...' : 'Ata'}
                          </button>
                        </div>
                      </div>
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
