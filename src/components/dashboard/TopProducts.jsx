import Card from '../common/Card.jsx'
import './TopProducts.css'

/**
 * Ranking de productos más vendidos con barras de progreso.
 */
export default function TopProducts({ products = [] }) {
  if (!products || products.length === 0) {
    return (
      <Card title="Productos más vendidos" subtitle="Sin datos reales" className="top-products">
        <div style={{ padding: '1rem', color: '#64748b' }}>No hay productos registrados en el backend.</div>
      </Card>
    )
  }

  return (
    <Card
      title="Productos más vendidos"
      subtitle="Por cantidad este mes"
      className="top-products"
    >
      <ul className="top-products__list">
        {products.map((product) => (
          <li key={product.name} className="top-products__item">
            <div className="top-products__row">
              <span className="top-products__name">{product.name}</span>
              <span className="top-products__count">
                {product.sales} ventas
              </span>
            </div>
            <div className="top-products__track">
              <div
                className="top-products__fill"
                style={{ width: `${product.share}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
