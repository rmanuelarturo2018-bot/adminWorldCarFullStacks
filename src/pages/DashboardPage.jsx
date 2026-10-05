import { useEffect, useState } from 'react'
import axiosClient from '../axiosClient.js'
import ActivityList from '../components/dashboard/ActivityList.jsx'
import RecentOrders from '../components/dashboard/RecentOrders.jsx'
import SalesChart from '../components/dashboard/SalesChart.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import TopProducts from '../components/dashboard/TopProducts.jsx'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './DashboardPage.css'

const TODAY = (() => {
  const text = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
})()

/**
 * Vista principal del dashboard, compuesta por componentes reutilizables.
 */
export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || ''

  // Contador real de clientes desde la API. Sin datos reales no se muestran números inventados.
  const [clientCount, setClientCount] = useState(null)

  useEffect(() => {
    let active = true
    axiosClient
      .get('/api/clients')
      .then((response) => {
        const list = Array.isArray(response.data) ? response.data : []
        if (active) setClientCount(list.length)
      })
      .catch(() => {
        if (active) setClientCount(0)
      })
    return () => {
      active = false
    }
  }, [])

  const displayedStats = [
    {
      id: 'customers',
      label: 'Clientes registrados',
      value: clientCount === null ? '—' : String(clientCount),
      delta: 0,
      icon: 'users',
      color: 'success',
    },
  ]

  const salesData = []
  const recentOrdersData = []
  const activityData = []
  const topProductsData = []

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__date">{TODAY}</p>
          <h1 className="dashboard__title">Hola, {firstName} 👋</h1>
          <p className="dashboard__subtitle">Este es el resumen de tu negocio hoy.</p>
        </div>
        <div className="dashboard__actions">
          <Button variant="secondary">Exportar</Button>
          <Button>Nuevo pedido</Button>
        </div>
      </header>

      <section className="dashboard__stats" aria-label="Indicadores principales">
        {displayedStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </section>

      <section className="dashboard__row">
        <SalesChart data={salesData} />
        <TopProducts products={topProductsData} />
      </section>

      <section className="dashboard__row dashboard__row--bottom">
        <RecentOrders orders={recentOrdersData} />
        <ActivityList activities={activityData} />
      </section>
    </div>
  )
}
