import { useState, useEffect } from 'react'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import * as authService from '../authService.js'
import './UsersPage.css'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(null)
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setMessage('')
    try {
      const data = await authService.getProductTypes()
      setCategories(data?.data || data || [])
    } catch (err) {
      setMessage(err?.message || 'No se pudieron cargar las categorías')
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setForm({ name: cat.name, description: cat.description || '' })
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ name: '', description: '' })
  }

  function openCreateForm() {
    setCreateForm({ name: '', description: '' })
    setShowCreate(true)
  }

  function cancelCreate() {
    setShowCreate(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setMessage('')
    try {
      await authService.createProductType({
        name: createForm.name,
        description: createForm.description,
      })
      showMessage('Categoría creada correctamente')
      cancelCreate()
      fetchCategories()
    } catch (err) {
      showMessage(err?.message || 'No se pudo crear la categoría')
    } finally {
      setCreating(false)
    }
  }

  async function saveEdit(id) {
    setSaving(id)
    setMessage('')
    try {
      await authService.updateProductType(id, {
        name: form.name,
        description: form.description,
      })
      showMessage('Categoría actualizada correctamente')
      cancelEdit()
      fetchCategories()
    } catch (err) {
      setMessage(err?.message || 'No se pudo actualizar la categoría')
    } finally {
      setSaving(null)
    }
  }

  function showMessage(msg) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(cat) {
    if (!window.confirm(`¿Eliminar categoría "${cat.name}"?`)) return
    setMessage('')
    setLoading(cat.id)
    try {
      await authService.deleteProductType(cat.id)
      setCategories(prev => prev.filter(c => c.id !== cat.id))
      showMessage('Categoría eliminada correctamente')
    } catch (err) {
      showMessage(err?.message || 'No se pudo eliminar la categoría')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main>
      <h2 className="page-title">Categorías</h2>

      <Card
        title="Listado de categorías"
        subtitle="Administrar categorías de productos"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={openCreateForm}>
              + Nueva categoría
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchCategories}>
              Recargar
            </Button>
          </div>
        }
      >
        <div className="users-table-wrap">
          {message && <div className="users-page__message">{message}</div>}

          {showCreate && (
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, marginBottom: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: '#f9f9fb', maxWidth: 400 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Nueva categoría</h3>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Nombre</span>
                <input type="text" required value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Descripción</span>
                <input type="text" required value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }} />
              </label>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Button type="submit" variant="primary" size="sm" disabled={creating}>{creating ? 'Creando…' : 'Crear categoría'}</Button>
                <Button variant="ghost" size="sm" onClick={cancelCreate}>Cancelar</Button>
              </div>
            </form>
          )}

          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {editingId === cat.id
                      ? <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ marginBottom: 4 }} />
                      : cat.name}
                  </td>
                  <td>
                    {editingId === cat.id
                      ? <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ marginBottom: 4 }} />
                      : cat.description || '—'}
                  </td>
                  <td>
                    {editingId === cat.id ? (
                      <>
                        <Button variant="primary" size="sm" onClick={() => saveEdit(cat.id)} disabled={saving === cat.id}>{saving === cat.id ? 'Guardando…' : 'Guardar'}</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => startEdit(cat)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(cat)} disabled={loading === cat.id}>{loading === cat.id ? 'Eliminando…' : 'Eliminar'}</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20, color: '#888' }}>No hay categorías registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
