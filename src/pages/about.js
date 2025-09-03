// src/pages/About.js
import { el } from '@utils/dom.js'

export function About({ mount }) {
  const page = el('div', { class: 'stack' },
    el('h1', {}, 'About'),
    el('p', {}, 'Router swaps pages by calling unmount() and re-rendering here.'),
    el('div', { class: 'card' }, 'Edit src/pages/About.js to change me.')
  )

  mount.append(page)

  return {
    unmount() {
      if (page.parentNode === mount) mount.removeChild(page)
    }
  }
}
