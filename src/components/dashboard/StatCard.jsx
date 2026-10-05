import {
  ArrowDownIcon,
  ArrowUpIcon,
  CartIcon,
  DollarIcon,
  TrendingUpIcon,
  UsersIcon,
} from '../common/icons.jsx'
import './StatCard.css'

const ICONS = {
  dollar: DollarIcon,
  cart: CartIcon,
  users: UsersIcon,
  trending: TrendingUpIcon,
}

/**
 * Tarjeta de indicador (KPI) con variación porcentual.
 */
export default function StatCard({
  label,
  value,
  delta = 0,
  icon = 'dollar',
  color = 'primary',
}) {
  const Icon = ICONS[icon] || DollarIcon
  const positive = delta >= 0
  const TrendIcon = positive ? ArrowUpIcon : ArrowDownIcon

  return (
    <article className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${color}`}>
        <Icon size={20} />
      </div>

      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        <p
          className={`stat-card__delta ${
            positive ? 'stat-card__delta--up' : 'stat-card__delta--down'
          }`}
        >
          <TrendIcon size={13} />
          <span>
            {Math.abs(delta)}% vs. mes anterior
          </span>
        </p>
      </div>
    </article>
  )
}
