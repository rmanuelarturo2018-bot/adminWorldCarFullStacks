import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import * as authService from '../authService.js'
import './UsersPage.css'

export default function UpdateProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    try {
      const data = await authService.getProfile()
      const p = data?.data || data
      setForm({
        firstName: p?.firstName || '',
        lastName: p?.lastName || '',
        email: p?.email || ''
      })
    } catch (err) {
      setMessage(err?.message || 'No se pudo cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await authService.updateProfile(form)
      setMessage('Perfil actualizado correctamente')
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      setMessage(err?.message || 'No se pudo actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main><p>Cargando perfil…</p></main>

  return (
    <main>
      <h2 className="page-title">Actualizar Perfil</h2>

      {message && <div className="users-page__message">{message}</div>}

      <Card title="Editar información personal">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Nombre</span>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
              required
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Apellido</span>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))}
              required
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              required
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </main>
  )
}
