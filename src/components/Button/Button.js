import { el } from '@utils/dom.js'
import './styles.css'

export function Button({
  label = 'Click',
  onClick,
  variant = 'default',   // supports 'on' | 'off' | others
  disabled = false,
  className = '',
  type = 'button',
  attrs = {}
} = {}) {
  const classes = ['btn']
  if (variant && variant !== 'default') classes.push(`btn--${variant}`)
  if (className) {
    if (Array.isArray(className)) classes.push(...className.filter(Boolean))
    else classes.push(className)
  }

  const computedDisabled =
    variant === 'on'  ? true  :
    variant === 'off' || "off-yellow" ? false :
    !!disabled

  // Optional: if you're treating it like a toggle button, expose aria-pressed
  const ariaPressed =
    (variant === 'on' && 'true') ||
    (variant === 'off' && 'false') ||
    null

  return el(
    'button',
    {
      class: classes.join(' '),
      type,
      disabled: computedDisabled ? '' : null,             
      onClick: computedDisabled ? null : (onClick || null), // don't wire if disabled
      'aria-pressed': ariaPressed,                      
      ...attrs
    },
    label
  )
}
