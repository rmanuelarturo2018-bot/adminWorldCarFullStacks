import './Input.css'

/**
 * Campo de texto con etiqueta, icono opcional y mensaje de error.
 */
export default function Input({
  label,
  icon,
  error,
  hint,
  className = '',
  id,
  ...rest
}) {
  const controlId = id || rest.name || label
  const hasIcon = Boolean(icon)

  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={controlId}>
          {label}
        </label>
      )}

      <div className="field__control">
        {hasIcon && <span className="field__icon">{icon}</span>}
        <input
          id={controlId}
          className={`field__input ${hasIcon ? 'field__input--icon' : ''} ${
            error ? 'field__input--error' : ''
          }`}
          aria-invalid={error ? 'true' : undefined}
          {...rest}
        />
      </div>

      {error && <span className="field__error">{error}</span>}
      {!error && hint && <span className="field__hint">{hint}</span>}
    </div>
  )
}
