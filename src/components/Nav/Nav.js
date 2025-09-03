// src/components/Nav/Nav.js
import { el } from '@utils/dom.js'
import logoUrl from '@assets/logo.svg'

export function Nav() {
  // left side: brand (logo + text)
  const brand = el('div', { class: 'brand' },
    el('img', { src: logoUrl, alt: 'logo' }),
    el('strong', {}, 'Vanilla Vite Modular')
  )

  // right side: simple links (hash routes)
  const links = el('div', { class: 'links' },
    el('a', { href: '#/' },  'Home'),
    el('a', { href: '#/about' }, 'About')
  )

  // the bar itself (styled by your base.css nav.site rules)
  const nav = el('nav', { class: 'site' }, brand, links)

  // optional: mark active link on hash changes
  const setActive = () => {
    const path = location.hash.slice(1) || '/'
    for (const a of nav.querySelectorAll('a')) {
      a.classList.toggle('active', a.getAttribute('href') === `#${path}`)
    }
  }
  setActive()
  const off = () => window.removeEventListener('hashchange', setActive)
  window.addEventListener('hashchange', setActive)

  // expose cleanup in case this ever gets unmounted (it’s persistent now)
  return {
    el: nav,
    unmount() { off() }
  }
}
