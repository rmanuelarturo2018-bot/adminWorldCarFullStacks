import { Link } from 'react-router-dom'
import './NotFoundPage.css'

/**
 * Página 404.
 */
export default function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1>Página no encontrada</h1>
      <p className="not-found__text">
        La página que buscas no existe o fue movida a otra dirección.
      </p>
      <Link to="/" className="btn btn--primary">
        Volver al dashboard
      </Link>
    </div>
  )
}
