import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../authService.js'

const STORAGE_KEY = 'freebuff.auth.user'
const MENU_STORAGE_KEY = 'menu'
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  /**
   * Login real contra la API.
   * Lanza un error si las credenciales fallan (para que la página lo muestre).
   */
  const login = async (credentials) => {
    const data = await authService.login(credentials)
    const apiUser = data?.data || data?.user

    if (!apiUser) {
      throw { message: data?.msg || 'No se pudo iniciar sesión' }
    }

    const name = [apiUser.firstName, apiUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()
    const initials = name
      ? name
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : (apiUser.email || 'U').charAt(0).toUpperCase()

    const roleName = apiUser.role?.name || 'Sin rol'
    const menu = Array.isArray(apiUser.role?.menu) ? apiUser.role.menu : []
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu))
    setUser({
      id: apiUser.id,
      email: apiUser.email,
      name: name || apiUser.email?.split('@')[0] || 'Usuario',
      role: roleName,
      roleId: apiUser.role?.id || null,
      menu,
      initials,
    })
  }

  const register = async (payload) => {
    const data = await authService.register(payload)
    const apiUser = data?.data || data?.user

    if (apiUser) {
      const name = [apiUser.firstName, apiUser.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()
      const initials = name
        ? name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : (apiUser.email || 'U').charAt(0).toUpperCase()

      setUser({
        id: apiUser.id,
        email: apiUser.email,
        name: name || apiUser.email?.split('@')[0] || 'Usuario',
        role: 'Sin rol',
        roleId: null,
        initials,
      })
    }

    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    localStorage.removeItem(MENU_STORAGE_KEY)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
