import './Card.css'

/**
 * Contenedor genérico con título y área de acciones opcionales.
 */
export default function Card({
  title,
  subtitle,
  actions,
  padless = false,
  className = '',
  children,
}) {
  return (
    <section className={`card ${padless ? 'card--padless' : ''} ${className}`}>
      {(title || actions) && (
        <header className="card__header">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
