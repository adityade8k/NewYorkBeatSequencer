// src/pages/Home.js
import { el } from '@utils/dom.js'
import { Counter } from '@components/Counter/Counter.js'

export function Home({ mount }) {
  const title = el('h1', {}, 'Home')
  const lead  = el('p', {}, 'This page mounts a reusable Counter component.')

  // create component instance
  const counter = Counter()

  // page root
  const page = el('div', { class: 'stack' },
    title,
    lead,
    el('div', { class: 'card' }, counter.el)
  )

  // e.g. in Home.js, add:
const filler = el('div', {}, Array.from({ length: 30 }, (_, i) => el('p', {}, `line ${i+1}`)))
// and append `filler` somewhere on the page

page.append(filler)
  // mount into the provided region
  mount.append(page)

  return {
    unmount() {
      // dispose child component first
      counter.unmount?.()
      // then remove the page DOM
      if (page.parentNode === mount) mount.removeChild(page)
    }
  }
}
