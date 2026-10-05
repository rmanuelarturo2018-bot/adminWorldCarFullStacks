import Card from '../common/Card.jsx'
import './ActivityList.css'

/**
 * Línea de tiempo de actividad reciente.
 */
export default function ActivityList({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <Card title="Actividad reciente" subtitle="Sin actividad real" className="activity-list">
        <div style={{ padding: '1rem', color: '#64748b' }}>No hay actividad reciente del backend.</div>
      </Card>
    )
  }

  return (
    <Card
      title="Actividad reciente"
      subtitle="Lo que pasó hoy"
      className="activity-list"
    >
      <ul className="activity-list__items">
        {activities.map((activity) => (
          <li key={activity.id} className="activity-list__item">
            <span
              className={`activity-list__dot activity-list__dot--${activity.color}`}
              aria-hidden="true"
            />
            <div className="activity-list__content">
              <p className="activity-list__text">
                <strong>{activity.user}</strong> {activity.action}{' '}
                {activity.target && <strong>{activity.target}</strong>}
              </p>
              <span className="activity-list__time">{activity.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
