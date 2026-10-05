import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  BoxIcon,
  DashboardIcon,
  GearIcon,
  LogOutIcon,
  UsersIcon,
} from '../common/icons.jsx'
import './Sidebar.css'

const iconById = {
  dashboard: DashboardIcon,
  administracion_usuarios: UsersIcon,
  inventario: BoxIcon,
}

const routeByMenuId = {
  dashboard: '/',
  administracion_usuarios: '/admin/users',
  usuarios_lista: '/admin/users',
  usuarios_roles: '/admin/roles',
  inventario: '/inventario/productos',
  inventario_productos: '/inventario/productos',
  inventario_categorias: '/inventario/categorias',
  inventario_movimientos: '/inventario/movimientos',
  inventario_proveedores: '/inventario/proveedores',
}

function getItemRoute(item) {
  return routeByMenuId[item.id] || item.route || item.ruta || '#'
}

function getMenu() {
  try {
    const stored = localStorage.getItem('menu')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const menu = Array.isArray(user?.menu) && user.menu.length ? user.menu : getMenu()

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo">F</span>
        <span className="sidebar__brand-name">Freebuff</span>
      </div>

      <nav className="sidebar__nav" aria-label="Menú principal">
        <p className="sidebar__section">Menú</p>
        {menu.map((item) => {
          const Icon = iconById[item.id] || GearIcon
          const submenus = Array.isArray(item.submenus) ? item.submenus : []

          return (
            <div key={item.id}>
              <NavLink
                to={getItemRoute(item)}
                end={submenus.length === 0}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.titulo}</span>
              </NavLink>

              {submenus.map((submenu) => (
                <NavLink
                  key={submenu.id}
                  to={getItemRoute(submenu)}
                  className={({ isActive }) =>
                    `sidebar__link sidebar__link--submenu ${
                      isActive ? 'sidebar__link--active' : ''
                    }`
                  }
                  onClick={onClose}
                >
                  <span>{submenu.titulo}</span>
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__logout" onClick={() => { logout(); navigate('/login', { replace: true }); }}>
          <LogOutIcon size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
