import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AppLayout.css'

/**
 * Layout principal de la app: sidebar + topbar + contenido (Outlet).
 */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="app-layout__backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="app-layout__main">
        <Topbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
