import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import * as authService from '../authService.js'
import './UsersPage.css'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    setMessage('')
    try {
      const data = await authService.getProfile()
      setProfile(data?.data || data)
    } catch (err) {
      setMessage(err?.message || 'No se pudo cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <main><p>Cargando perfil…</p></main>

  return (
    <main>
      <h2 className="page-title">Mi Perfil</h2>

      {message && <div className="users-page__message">{message}</div>}

      <Card title="Información personal">
        <table className="users-table">
          <tbody>
            <tr>
              <td><strong>Nombre</strong></td>
              <td>{profile?.name || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>{profile?.email}</td>
            </tr>
            <tr>
              <td><strong>ID</strong></td>
              <td>{profile?.id}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" onClick={() => window.location.href = '/profile/edit'}>
            Editar perfil
          </Button>
          <Button variant="secondary" size="sm" onClick={() => window.location.href = '/profile/change-password'}>
            Cambiar contraseña
          </Button>
        </div>
      </Card>
    </main>
  )
}
