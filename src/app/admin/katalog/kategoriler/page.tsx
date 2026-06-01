'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/layout/AdminGuard'
import AdminNavbar from '@/components/layout/AdminNavbar'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, ChevronDown, ChevronRight,
  ToggleLeft, ToggleRight, X, Save, Loader2, RefreshCw, FolderTree, Sliders,
} from 'lucide-react'

interface Category {
  id: string
  parentId?: string
  parentName?: string
  slug: string
  name: string
  icon?: string
  tagline?: string
  sortOrder: number
  active: boolean
  childCount?: number
  productCount?: number
  children?: Category[]
}

interface FormData {
  name: string
  slug: string
  icon: string
  tagline: string
  parentId: string
  sortOrder: number
  active: boolean
}

const EMPTY_FORM: FormData = {
  name: '', slug: '', icon: '', tagline: '', parentId: '', sortOrder: 0, active: true,
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

// Düzleştir — recursive ağacı flat liste yapar (parent dropdown için)
function flatten(nodes: Category[], depth = 0): Array<Category & { depth: number }> {
  const result: Array<Category & { depth: number }> = []
  for (const n of nodes) {
    result.push({ ...n, depth })
    if (n.children && n.children.length > 0) {
      result.push(...flatten(n.children, depth + 1))
    }
  }
  return result
}

// Bir node'un altındaki tüm descendant ID'lerini bul
function collectDescendantIds(node: Category): string[] {
  const ids: string[] = []
  if (node.children) {
    for (const c of node.children) {
      ids.push(c.id, ...collectDescendantIds(c))
    }
  }
  return ids
}

interface TreeNodeProps {
  category: Category
  level: number
  expanded: Set<string>
  onToggleExpand: (id: string) => void
  onAddChild: (parent: Category) => void
  onEdit: (cat: Category) => void
  onToggleActive: (cat: Category) => void
  onDelete: (cat: Category) => void
  togglingId: string | null
  deletingId: string | null
}

function TreeNode({
  category, level, expanded, onToggleExpand,
  onAddChild, onEdit, onToggleActive, onDelete,
  togglingId, deletingId,
}: TreeNodeProps) {
  const hasChildren = category.children && category.children.length > 0
  const isExp = expanded.has(category.id)

  return (
    <div>
      <div className="group flex items-center gap-2 py-2 px-3 rounded-lg transition-colors hover:bg-white/50"
        style={{ marginLeft: level * 24 }}>

        {/* Expand toggle */}
        {hasChildren ? (
          <button onClick={() => onToggleExpand(category.id)}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200/50"
            style={{ color: 'var(--text-muted)' }}>
            {isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-6 h-6" />
        )}

        {/* Icon */}
        <span className="text-[18px] flex-shrink-0 w-6 text-center">
          {category.icon || '📁'}
        </span>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {category.name}
            </span>
            <code className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              /{category.slug}
            </code>
            {!category.active && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase"
                style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280' }}>
                PASİF
              </span>
            )}
            {(category.productCount || 0) > 0 && (
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                · {category.productCount} ürün
              </span>
            )}
          </div>
          {category.tagline && (
            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {category.tagline}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
          <Link href={`/admin/katalog/kategoriler/${category.id}/oznitelikler`}
            title="Öznitelikleri yönet"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-[#F4821F]"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            <Sliders size={12} />
          </Link>
          <button onClick={() => onAddChild(category)} title="Alt kategori ekle"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-[#F4821F]"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            <Plus size={12} />
          </button>
          <button onClick={() => onEdit(category)} title="Düzenle"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-[#F4821F]"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            <Edit2 size={12} />
          </button>
          <button onClick={() => onToggleActive(category)} disabled={togglingId === category.id}
            title={category.active ? 'Pasife al' : 'Aktife al'}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            {togglingId === category.id
              ? <Loader2 size={12} className="animate-spin" />
              : category.active ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
          </button>
          <button onClick={() => onDelete(category)} disabled={deletingId === category.id}
            title="Sil"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-red-500"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            {deletingId === category.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>

      {/* Recursive children */}
      {hasChildren && isExp && (
        <div>
          {category.children!.map(child => (
            <TreeNode key={child.id} category={child} level={level + 1}
              expanded={expanded} onToggleExpand={onToggleExpand}
              onAddChild={onAddChild} onEdit={onEdit}
              onToggleActive={onToggleActive} onDelete={onDelete}
              togglingId={togglingId} deletingId={deletingId} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminKategorilerPage() {
  const [tree, setTree] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/api/admin/catalog/categories/tree')
      .then(r => {
        const data = r.data.data || []
        setTree(data)
        // İlk seviye otomatik açık
        const initialExpanded = new Set<string>()
        for (const node of data) initialExpanded.add(node.id)
        setExpanded(initialExpanded)
      })
      .catch(() => toast.error('Kategoriler yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const setName = (name: string) => {
    setForm(f => ({
      ...f, name,
      slug: editId ? f.slug : slugify(name)
    }))
  }

  const openNew = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openAddChild = (parent: Category) => {
    setEditId(null)
    setForm({ ...EMPTY_FORM, parentId: parent.id })
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '',
      tagline: cat.tagline || '',
      parentId: cat.parentId || '',
      sortOrder: cat.sortOrder,
      active: cat.active,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Ad ve slug zorunlu')
      return
    }
    if (!form.slug.match(/^[a-z0-9-]+$/)) {
      toast.error('Slug sadece küçük harf, rakam ve tire içerebilir')
      return
    }
    setSaving(true)
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      icon: form.icon.trim() || null,
      tagline: form.tagline.trim() || null,
      parentId: form.parentId || null,
      sortOrder: form.sortOrder,
      active: form.active,
    }
    try {
      if (editId) {
        await api.put(`/api/admin/catalog/categories/${editId}`, body)
        toast.success('Kategori güncellendi')
      } else {
        await api.post('/api/admin/catalog/categories', body)
        toast.success('Kategori oluşturuldu')
      }
      closeModal()
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
    } finally { setSaving(false) }
  }

  const handleToggle = async (cat: Category) => {
    setTogglingId(cat.id)
    try {
      await api.patch(`/api/admin/catalog/categories/${cat.id}/toggle`)
      load()
    } catch {
      toast.error('Değiştirilemedi')
    } finally { setTogglingId(null) }
  }

  const handleDelete = async (cat: Category) => {
    if ((cat.childCount || 0) > 0) {
      toast.error(`Bu kategorinin ${cat.childCount} alt kategorisi var, önce onları taşı veya sil`)
      return
    }
    if ((cat.productCount || 0) > 0) {
      toast.error(`Bu kategoride ${cat.productCount} ürün var, önce onları taşı`)
      return
    }
    if (!confirm(`"${cat.name}" kategorisini silmek istediğine emin misin?`)) return
    setDeletingId(cat.id)
    try {
      await api.delete(`/api/admin/catalog/categories/${cat.id}`)
      toast.success('Kategori silindi')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Silinemedi')
    } finally { setDeletingId(null) }
  }

  // Parent dropdown için: düzenlerken kendini ve descendant'ları hariç tut
  const parentOptions = flatten(tree).filter(c => {
    if (!editId) return true
    if (c.id === editId) return false
    // descendant kontrolü için tree'de bul
    const findInTree = (nodes: Category[]): Category | null => {
      for (const n of nodes) {
        if (n.id === editId) return n
        if (n.children) {
          const found = findInTree(n.children)
          if (found) return found
        }
      }
      return null
    }
    const editingNode = findInTree(tree)
    if (!editingNode) return true
    const descendants = collectDescendantIds(editingNode)
    return !descendants.includes(c.id)
  })

  const counts = {
    total: flatten(tree).length,
    root: tree.length,
  }

  return (
    <AdminGuard>
      <AdminNavbar />
      <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FolderTree size={18} className="text-[#F4821F]" />
                <h1 className="text-[22px] font-bold tracking-[-0.5px]" style={{ color: 'var(--text-primary)' }}>
                  Kategori Yönetimi
                </h1>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                Toplam {counts.total} kategori · {counts.root} ana kategori
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={openNew}
                className="flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-lg bg-[#F4821F] text-white hover:bg-[#e07010] transition-colors">
                <Plus size={14} />
                Yeni Kategori
              </button>
              <button onClick={load}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Tree */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#F4821F]" />
            </div>
          ) : tree.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px dashed var(--border)' }}>
              <FolderTree size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                Henüz kategori yok
              </p>
              <p className="text-[12px] mb-4 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                Önce ürünleri gruplayabileceğin kategoriler oluştur (Kartvizit, Kaşe, Sticker vb.). Sonra her birine öznitelik ve ürün eklersin.
              </p>
              <button onClick={openNew}
                className="text-[12px] font-bold text-[#F4821F] hover:underline">
                + İlk kategoriyi oluştur
              </button>
            </div>
          ) : (
            <div className="rounded-2xl p-3"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {tree.map(cat => (
                <TreeNode key={cat.id} category={cat} level={0}
                  expanded={expanded} onToggleExpand={toggleExpand}
                  onAddChild={openAddChild} onEdit={openEdit}
                  onToggleActive={handleToggle} onDelete={handleDelete}
                  togglingId={togglingId} deletingId={deletingId} />
              ))}
            </div>
          )}

          <div className="mt-6 p-4 rounded-xl text-[12px]"
            style={{ background: 'rgba(244,130,31,0.05)', border: '1px solid rgba(244,130,31,0.2)', color: 'var(--text-secondary)' }}>
            💡 <strong>İpucu:</strong> Sliders ikonuyla kategorinin <strong>özniteliklerini</strong> (Kağıt, Ebat, Renk vb.) yönetebilirsin. <strong>+</strong> ikonuyla alt kategori eklersin.
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}>
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
                </h3>
                <button onClick={closeModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Kategori Adı *</label>
                  <input value={form.name} onChange={e => setName(e.target.value)}
                    placeholder="Kartvizitler"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Slug (URL) *</label>
                  <input value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase() }))}
                    placeholder="kartvizit"
                    className="w-full px-3.5 py-2.5 text-[12px] rounded-lg outline-none font-mono"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }} />
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Sadece küçük harf, rakam ve tire.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>İkon (emoji)</label>
                    <input value={form.icon}
                      onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                      placeholder="📇"
                      className="w-full px-3.5 py-2.5 text-[18px] text-center rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                      style={{ color: 'var(--text-muted)' }}>Sıra</label>
                    <input type="number" value={form.sortOrder}
                      onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Üst Kategori</label>
                  <select value={form.parentId}
                    onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">— Ana kategori —</option>
                    {parentOptions.map(c => (
                      <option key={c.id} value={c.id}>
                        {'— '.repeat(c.depth)}{c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[1px] mb-2"
                    style={{ color: 'var(--text-muted)' }}>Açıklama (Tagline)</label>
                  <input value={form.tagline}
                    onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                    placeholder="Kısa açıklama (kart altında görünür)"
                    className="w-full px-3.5 py-2.5 text-[13px] rounded-lg outline-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                      className="w-10 h-6 rounded-full transition-colors relative flex-shrink-0"
                      style={{ background: form.active ? '#10B981' : '#6B7280' }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{ left: form.active ? 'calc(100% - 22px)' : '2px' }} />
                    </button>
                    <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                      {form.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button onClick={closeModal}
                  className="px-5 py-2.5 text-[13px] rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                  İptal
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-lg bg-[#F4821F] hover:bg-[#e07010] transition-colors disabled:opacity-50">
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</>
                    : <><Save size={14} /> {editId ? 'Güncelle' : 'Kaydet'}</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminGuard>
  )
}
