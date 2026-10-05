import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button.jsx'
import { BellIcon, LogOutIcon, MenuIcon, SearchIcon, UserIcon, GearIcon, LockIcon } from '../common/icons.jsx'
import './Topbar.css'

/**
 * Barra superior: menú móvil, búsqueda, notificaciones y perfil con submenu.
 */
export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleMenuClick(action) {
    setMenuOpen(false)
    navigate(action)
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu"
        onClick={onToggleSidebar}
        aria-label="Abrir menú"
      >
        <MenuIcon size={20} />
      </button>

      <div className="topbar__search">
        <SearchIcon size={16} />
        <input type="search" placeholder="Buscar pedidos, clientes…" />
      </div>

      <div className="topbar__right">
        <button
          type="button"
          className="topbar__icon-btn"
          aria-label="Notificaciones"
        >
          <BellIcon size={19} />
          <span className="topbar__dot" />
        </button>

        <div className="topbar__user" ref={menuRef}>
          <button
            type="button"
            className="topbar__user-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="topbar__avatar">{user?.initials}</span>
            <div className="topbar__user-info">
              <span className="topbar__user-name">{user?.name}</span>
              <span className="topbar__user-role">{user?.role}</span>
            </div>
          </button>

          {menuOpen && (
            <div className="topbar__dropdown">
              <button
                type="button"
                className="topbar__dropdown-item"
                onClick={() => handleMenuClick('/profile')}
              >
                <UserIcon size={16} />
                <span>Perfil</span>
              </button>
              <button
                type="button"
                className="topbar__dropdown-item"
                onClick={() => handleMenuClick('/profile/edit')}
              >
                <GearIcon size={16} />
                <span>Actualizar</span>
              </button>
              <button
                type="button"
                className="topbar__dropdown-item"
                onClick={() => handleMenuClick('/profile/change-password')}
              >
                <LockIcon size={16} />
                <span>Cambiar contraseña</span>
              </button>
              <div className="topbar__dropdown-divider" />
              <button
                type="button"
                className="topbar__dropdown-item topbar__dropdown-item--danger"
                onClick={() => { setMenuOpen(false); logout() }}
              >
                <LogOutIcon size={16} />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={logout} className="topbar__logout-desktop">
          <LogOutIcon size={16} />
          <span>Salir</span>
        </Button>
      </div>
    </header>
  )
}
