import { useState, useEffect } from 'react'
import Card from './Card.jsx'
import Button from './Button.jsx'
import * as authService from '../../authService.js'
import '../../pages/UsersPage.css'

export default function RolesPanel() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageTimeout, setMessageTimeout] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchRoles()
  }, [])

  async function fetchRoles() {
    setLoading(true)
    setMessage('')
    try {
      const data = await authService.getRoles()
      const list = data?.data || data || []
      setRoles(list.filter(r => r.isActive))
    } catch (err) {
      setMessage(err?.message || 'No se pudo cargar la lista de roles')
    } finally {
      setLoading(false)
    }
  }

  function showMessage(msg) {
    if (messageTimeout) clearTimeout(messageTimeout)
    setMessage(msg)
    const t = setTimeout(() => setMessage(''), 3000)
    setMessageTimeout(t)
  }

  function openCreateForm() {
    setEditingId(null)
    setForm({ name: '', description: '' })
    setShowForm(true)
  }

  function openEditForm(role) {
    setEditingId(role.id)
    setForm({ name: role.name || '', description: role.description || '' })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', description: '' })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      if (editingId) {
        await authService.updateRole(editingId, form)
        showMessage('Rol actualizado correctamente')
      } else {
        await authService.createRole(form)
        showMessage('Rol creado correctamente')
      }
      cancelForm()
      fetchRoles()
    } catch (err) {
      showMessage(err?.message || 'No se pudo guardar el rol')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(role) {
    if (!window.confirm(`¿Eliminar el rol "${role.name}"?`)) return
    setMessage('')
    try {
      await authService.deleteRole(role.id)
      showMessage('Rol eliminado correctamente')
      fetchRoles()
    } catch (err) {
      showMessage(err?.message || 'No se pudo eliminar el rol')
    }
  }

  return (
    <>
      {message && <div className="users-page__message">{message}</div>}

      <Card
        title="Listado de roles"
        subtitle="Roles activos del sistema"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={openCreateForm}>
              + Nuevo rol
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchRoles}>
              Recargar
            </Button>
          </div>
        }
      >
        {showForm && (
          <form
            onSubmit={handleSave}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 16,
              marginBottom: 16,
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              background: '#f9f9fb',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 15 }}>
              {editingId ? 'Editar rol' : 'Nuevo rol'}
            </h3>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Nombre</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="Ej: admin, vendedor, gerente"
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Descripción</span>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Opcional"
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                {saving ? 'Guardando…' : editingId ? 'Actualizar' : 'Crear'}
              </Button>
              <Button variant="ghost" size="sm" onClick={cancelForm}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="users-table-wrap">
          {loading ? (
            <p>Cargando roles…</p>
          ) : roles.length === 0 ? (
            <p style={{ color: '#888', padding: 16 }}>No hay roles activos</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.description || '—'}</td>
                    <td>
                      <Button variant="secondary" size="sm" onClick={() => openEditForm(r)}>
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(r)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </>
  )
}
