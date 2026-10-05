import './Button.css'

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger']
const SIZES = ['sm', 'md', 'lg']

/**
 * Botón reutilizable.
 * @param {'primary'|'secondary'|'ghost'|'danger'} [variant]
 * @param {'sm'|'md'|'lg'} [size]
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${VARIANTS.includes(variant) ? variant : 'primary'}`,
    `btn--${SIZES.includes(size) ? size : 'md'}`,
    fullWidth && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
