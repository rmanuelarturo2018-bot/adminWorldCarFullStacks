import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import UpdateProfilePage from './pages/UpdateProfilePage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import RolesPage from './pages/RolesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'

const pageByRoute = {
  '/': DashboardPage,
  '/admin/users': UsersPage,
  '/admin/roles': RolesPage,
  '/inventario/productos': ProductsPage,
  '/inventario/categorias': CategoriesPage,
  '/profile': ProfilePage,
  '/profile/edit': UpdateProfilePage,
  '/profile/change-password': ChangePasswordPage,
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

function getStoredMenu() {
  try {
    const stored = localStorage.getItem('menu')
    const menu = stored ? JSON.parse(stored) : []
    return Array.isArray(menu) ? menu : []
  } catch {
    return []
  }
}

function getMenuRoutes(menu) {
  if (!Array.isArray(menu)) return []

  const routes = menu
    .flatMap((item) => [
      item,
      ...(Array.isArray(item.submenus) ? item.submenus : []),
    ])
    .map((item) => ({
      path: routeByMenuId[item.id] || item.route || item.ruta,
      Page: pageByRoute[routeByMenuId[item.id] || item.route || item.ruta],
    }))
    .filter(({ path, Page }) => path && path !== '/' && Page)

  return [...new Map(routes.map((route) => [route.path, route])).values()]
}

/** Bloquea rutas para usuarios no autenticados. */
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const { user } = useAuth()
  const menu = Array.isArray(user?.menu) && user.menu.length
    ? user.menu
    : getStoredMenu()
  const menuRoutes = getMenuRoutes(menu)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        {menuRoutes.map(({ path, Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
