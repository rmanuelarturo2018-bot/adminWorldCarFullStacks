import { useState, useEffect } from 'react'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import RolesPanel from '../components/common/RolesPanel.jsx'
import * as authService from '../authService.js'
import './UsersPage.css'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(null) // id del usuario en proceso (restaurar/eliminar)
  const [saving, setSaving] = useState(null) // id en proceso de guardado de edición
  const [message, setMessage] = useState('')
  const [messageTimeout, setMessageTimeout] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', lastName: '', email: '', roleId: '' })
  const [roles, setRoles] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', email: '', password: '', roleId: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  async function fetchUsers() {
    setMessage('')
    try {
      const data = await authService.getUsers()
      // La API puede devolver { data: [...] } o { users: [...] } u array directo
      const list = data?.data || data?.users || data || []
      setUsers(list)
    } catch (err) {
      setMessage(err?.message || 'No se pudo cargar la lista de usuarios')
    }
  }

  async function fetchRoles() {
    try {
      const data = await authService.getRoles()
      const list = data?.data || data || []
      setRoles(list.filter(r => r.isActive))
    } catch (err) {
      console.error('Error cargando roles:', err)
    }
  }

  function startEdit(user) {
    setEditingId(user.id)
    setForm({ name: user.firstName || '', lastName: user.lastName || '', email: user.email || '', roleId: user.roleId ? String(user.roleId) : '' })
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ name: '', lastName: '', email: '', roleId: '' })
  }

  function openCreateForm() {
    setCreateForm({ firstName: '', lastName: '', email: '', password: '', roleId: '' })
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
      const payload = {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        password: createForm.password,
      }
      const res = await authService.register(payload)
      // Asignar rol si se seleccionó
      if (createForm.roleId && res?.data?.id) {
        await authService.updateUser(res.data.id, { roleId: Number(createForm.roleId) })
      }
      showMessage('Usuario creado correctamente')
      cancelCreate()
      fetchUsers()
    } catch (err) {
      showMessage(err?.message || 'No se pudo crear el usuario')
    } finally {
      setCreating(false)
    }
  }

  async function saveEdit(id) {
    setSaving(id)
    setMessage('')
    try {
      const payload = { name: form.name, lastName: form.lastName, email: form.email }
      if (form.roleId) payload.roleId = Number(form.roleId)
      const res = await authService.updateUser(id, payload)
      // Actualizar en UI según la respuesta (data o data.user)
      const updated = res?.data || res?.user || payload
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)))
      showMessage('Usuario actualizado correctamente')
      cancelEdit()
    } catch (err) {
      setMessage(err?.message || 'No se pudo actualizar el usuario')
    } finally {
      setSaving(null)
    }
  }

  function showMessage(msg) {
    if (messageTimeout) clearTimeout(messageTimeout)
    setMessage(msg)
    const t = setTimeout(() => setMessage(''), 3000)
    setMessageTimeout(t)
  }

  async function handleDelete(user) {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar a ${user.name || user.email}?`)) return
    setMessage('')
    setLoading(user.id)
    try {
      await authService.deleteUser(user.id)
      // Eliminar de la lista en UI
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      showMessage('Usuario eliminado correctamente')
    } catch (err) {
      showMessage(err?.message || 'No se pudo eliminar el usuario')
    } finally {
      setLoading(null)
    }
  }

  async function handleRestorePassword(user) {
    setMessage('')
    setLoading(user.id)
    try {
      await authService.resetPassword(user.email)
      showMessage(`Solicitud de restauración enviada a ${user.email}`)
    } catch (err) {
      showMessage(err?.message || `No se pudo solicitar restauración para ${user.email}.`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <main>
      <h2 className="page-title">Administrar usuarios</h2>

      <Card
        title="Listado de usuarios"
        subtitle="Ver, buscar y acciones de administración"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={openCreateForm}>
              + Nuevo usuario
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchUsers}>
              Recargar
            </Button>
          </div>
        }
      >
        <div className="users-table-wrap">
          {message && <div className="users-page__message">{message}</div>}

          {/* Formulario para crear usuario */}
          {showCreate && (
            <form
              onSubmit={handleCreate}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: 16,
                marginBottom: 16,
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                background: '#f9f9fb',
                maxWidth: 400,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15 }}>Nuevo usuario</h3>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Nombre</span>
                <input
                  type="text"
                  required
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm(f => ({ ...f, firstName: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Apellido</span>
                <input
                  type="text"
                  required
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm(f => ({ ...f, lastName: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Email</span>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Contraseña</span>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Rol</span>
                <select
                  value={createForm.roleId}
                  onChange={(e) => setCreateForm(f => ({ ...f, roleId: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
                >
                  <option value="">Sin rol</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Button type="submit" variant="primary" size="sm" disabled={creating}>
                  {creating ? 'Creando…' : 'Crear usuario'}
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelCreate}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {editingId === u.id ? (
                      <input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        style={{ marginBottom: 4 }}
                      />
                    ) : (
                      u.firstName
                    )}
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <>
                        <input
                          value={form.lastName || ''}
                          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                          style={{ marginBottom: 4 }}
                        />
                        <select
                          value={form.roleId}
                          onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))}
                          style={{ padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 6, fontSize: 13 }}
                        >
                          <option value="">Sin rol</option>
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      u.lastName
                    )}
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <input
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <span style={{ color: '#888', fontSize: 13 }}>Se edita arriba</span>
                    ) : (
                      u.roleName || 'Sin rol'
                    )}
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveEdit(u.id)}
                          disabled={saving === u.id}
                        >
                          {saving === u.id ? 'Guardando…' : 'Guardar'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => startEdit(u)}>
                          Editar
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestorePassword(u)}
                          disabled={loading === u.id}
                        >
                          {loading === u.id ? 'Enviando…' : 'Restaurar contraseña'}
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(u)}
                          disabled={loading === u.id}
                        >
                          {loading === u.id ? 'Eliminando…' : 'Eliminar'}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <RolesPanel />
    </main>
  )
}
