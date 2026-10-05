import Card from '../common/Card.jsx'
import './SalesChart.css'

/**
 * Gráfico de barras simple (CSS puro) con total acumulado.
 */
export default function SalesChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <Card title="Ventas mensuales" subtitle="Sin datos reales disponibles" className="sales-chart">
        <div className="sales-chart__plot" style={{ minHeight: 120, alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          No hay ventas registradas por el backend.
        </div>
      </Card>
    )
  }

  const max = Math.max(...data.map((d) => d.value))
  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <Card
      title="Ventas mensuales"
      subtitle={`Ingresos acumulados: $${total.toLocaleString('es-MX')}`}
      className="sales-chart"
    >
      <div className="sales-chart__plot">
        {data.map((d) => (
          <div key={d.month} className="sales-chart__col">
            <div className="sales-chart__bar" style={{ height: `${(d.value / max) * 78}%` }}>
              <span className="sales-chart__bar-value">${d.value.toLocaleString('es-MX')}</span>
            </div>
            <span className="sales-chart__month">{d.month}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
