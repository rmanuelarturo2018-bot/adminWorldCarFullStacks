import './Badge.css'

const VARIANTS = ['success', 'warning', 'danger', 'info', 'neutral']

/**
 * Etiqueta de estado con color según variante.
 */
export default function Badge({ children, variant = 'neutral' }) {
  const resolved = VARIANTS.includes(variant) ? variant : 'neutral'
  return <span className={`badge badge--${resolved}`}>{children}</span>
}
