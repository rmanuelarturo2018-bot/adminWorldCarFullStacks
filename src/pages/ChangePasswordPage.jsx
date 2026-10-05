import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import * as authService from '../authService.js'
import './UsersPage.css'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setMessage('')

    if (form.newPassword !== form.confirmPassword) {
      setMessage('Las contraseñas nuevas no coinciden')
      return
    }

    if (form.newPassword.length < 4) {
      setMessage('La contraseña debe tener al menos 4 caracteres')
      return
    }

    setSaving(true)
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      setMessage('Contraseña actualizada correctamente')
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      setMessage(err?.message || 'No se pudo cambiar la contraseña')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <h2 className="page-title">Cambiar Contraseña</h2>

      {message && <div className="users-page__message">{message}</div>}

      <Card title="Actualizar contraseña">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Contraseña actual</span>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm(f => ({ ...f, currentPassword: e.target.value }))}
              required
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Nueva contraseña</span>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm(f => ({ ...f, newPassword: e.target.value }))}
              required
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Confirmar nueva contraseña</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? 'Guardando…' : 'Cambiar contraseña'}
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
