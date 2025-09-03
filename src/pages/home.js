// src/pages/Home.js
import { el } from '@utils/dom.js'

export function Home({ mount }) {
  // build page DOM
  const page = el('div', { class: 'stack' },
    el('h1', {}, 'Home'),
    el('p', {}, 'This is the home page rendered by the router.'),
    el('div', { class: 'card' }, 'Edit src/pages/Home.js to change me.')
  )

  // mount it
  mount.append(page)

  // return cleanup API (remove page from DOM)
  return {
    unmount() {
      if (page.parentNode === mount) mount.removeChild(page)
    }
  }
}
