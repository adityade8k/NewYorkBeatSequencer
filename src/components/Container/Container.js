import { el } from "@/utils/dom"

export function Container(
  { className = '', attrs = {} } = {},
  ...children
) {
  const classes = ['container'] // base class with border + padding from styles.css

  if (className) {
    if (Array.isArray(className)) classes.push(...className.filter(Boolean))
    else classes.push(className)
  }

  return el(
    'div',
    {
      class: classes.join(' '),
      ...attrs
    },
    ...children
  )
}