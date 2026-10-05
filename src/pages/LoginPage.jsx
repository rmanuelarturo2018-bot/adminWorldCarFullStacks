import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Spinner from '../components/common/Spinner.jsx'
import { LockIcon, MailIcon } from '../components/common/icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './LoginPage.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Pantalla de inicio de sesión. Autentica contra la API
 * (POST /api/accounts/login) a través de authService.
 */
export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Si ya hay sesión activa, ir directo al dashboard.
  if (user) {
    return <Navigate to="/" replace />
  }

  const validate = () => {
    const next = {}
    if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Ingresa un correo electrónico válido.'
    }
    if (!password) {
      next.password = 'Ingresa tu contraseña.'
    }
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setFormError(null)

    try {
      await login({ email: email.trim(), password })
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(err.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <aside className="login__aside">
        <div className="login__brand">
          <span className="login__logo">A</span>
          <span className="login__brand-name">Admin</span>
        </div>

        <div className="login__aside-content">
          <h1>Administra tu negocio en un solo lugar</h1>
          <p>
            Ventas, pedidos, clientes y reportes en tiempo real desde un
            dashboard simple y elegante.
          </p>
        </div>

        <div className="login__aside-footer">
          “Los datos no mienten. Toma mejores decisiones hoy.”
        </div>
      </aside>

      <main className="login__main">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h2>Iniciar sesión</h2>
          <p className="login__subtitle">Ingresa tus credenciales para continuar.</p>

          {formError && (
            <p className="login__error" role="alert">
              {formError}
            </p>
          )}

          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="tucorreo@empresa.com"
            icon={<MailIcon size={17} />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={<LockIcon size={17} />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size={17} /> Verificando…
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>

          <p className="login__meta">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="login__link"
              onClick={() => navigate('/register')}
            >
              Crear cuenta
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}
