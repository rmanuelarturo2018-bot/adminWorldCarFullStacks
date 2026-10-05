import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Spinner from '../components/common/Spinner.jsx'
import { LockIcon, MailIcon, UserIcon } from '../components/common/icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './LoginPage.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.firstName.trim()) nextErrors.firstName = 'Nombre requerido.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Apellido requerido.'
    if (!EMAIL_REGEX.test(form.email.trim())) nextErrors.email = 'Ingresa un correo válido.'
    if (!form.password) nextErrors.password = 'Ingresa una contraseña.'
    else if (form.password.length < 6) nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirma tu contraseña.'
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Las contraseñas no coinciden.'

    return nextErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setFormError(null)

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      }

      await register(payload)
      navigate('/', { replace: true })
    } catch (err) {
      setFormError(err.message || 'No se pudo registrar el usuario.')
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <aside className="login__aside">
        <div className="login__brand">
          <span className="login__logo">F</span>
          <span className="login__brand-name">Freebuff</span>
        </div>

        <div className="login__aside-content">
          <h1>Crea tu cuenta y empieza a vender mejor</h1>
          <p>
            Gestiona clientes, pedidos y reportes con una sola plataforma enfocada en la
            operación real de tu negocio.
          </p>
        </div>

        <div className="login__aside-footer">
          “La mejor operación empieza con una buena base.”
        </div>
      </aside>

      <main className="login__main">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h2>Crear cuenta</h2>
          <p className="login__subtitle">Registra tu usuario para continuar.</p>

          {formError && (
            <p className="login__error" role="alert">
              {formError}
            </p>
          )}

          <Input
            label="Nombre"
            type="text"
            name="firstName"
            placeholder="Juan"
            icon={<UserIcon size={17} />}
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />

          <Input
            label="Apellido"
            type="text"
            name="lastName"
            placeholder="Pérez"
            icon={<UserIcon size={17} />}
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />

          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="tucorreo@empresa.com"
            icon={<MailIcon size={17} />}
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={<LockIcon size={17} />}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            icon={<LockIcon size={17} />}
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size={17} /> Registrando…
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>

          <p className="login__meta">
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="login__link" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}
