// src/components/Button/Button.js
import { el } from '@utils/dom.js'

/**
 * Variants:
 *  - 'on'  -> disabled (not clickable)
 *  - 'off' -> enabled
 *
 * Extra colors/styles (e.g. yellow) can be applied via `className`.
 */
export function Button({
  label = 'Click',
  onClick,
  variant = 'off',
  className = '',
  type = 'button',
  attrs = {}
} = {}) {
  const classes = ['btn']
  if (variant) classes.push(`btn--${variant}`)
  if (className) {
    if (Array.isArray(className)) classes.push(...className.filter(Boolean))
    else classes.push(className)
  }

  const isDisabled = variant === 'on'

  const ariaPressed =
    variant === 'on'  ? 'true' :
    variant === 'off' ? 'false' : null

  return el(
    'button',
    {
      class: classes.join(' '),
      type,
      disabled: isDisabled ? '' : null,
      onClick: isDisabled ? null : (onClick || null),
      'aria-pressed': ariaPressed,
      ...attrs
    },
    label
  )
}
