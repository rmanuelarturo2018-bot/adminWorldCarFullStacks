import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import './RecentOrders.css'

const STATUS_VARIANT = {
  Completado: 'success',
  Enviado: 'info',
  Pendiente: 'warning',
  Cancelado: 'danger',
}

/**
 * Tabla de pedidos recientes con estado visual.
 */
export default function RecentOrders({ orders = [] }) {
  if (!orders || orders.length === 0) {
    return (
      <Card title="Pedidos recientes" subtitle="Sin pedidos reales disponibles" padless className="recent-orders">
        <div style={{ padding: '1rem', color: '#64748b' }}>No hay pedidos registrados en el backend.</div>
      </Card>
    )
  }

  return (
    <Card
      title="Pedidos recientes"
      subtitle="Últimos movimientos"
      actions={
        <Button variant="secondary" size="sm">
          Ver todos
        </Button>
      }
      padless
      className="recent-orders"
    >
      <div className="recent-orders__wrap">
        <table className="recent-orders__table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="recent-orders__id">{order.id}</td>
                <td className="recent-orders__customer">{order.customer}</td>
                <td>{order.product}</td>
                <td className="recent-orders__amount">{order.amount}</td>
                <td>
                  <Badge variant={STATUS_VARIANT[order.status] || 'neutral'}>
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
