// src/pages/Home.js
import { el } from '@utils/dom.js'
import { Button } from '@components/Button/Button.js'
export function Home({ mount }) {
  const title = el('h1', {}, 'Home')
  const lead = el('p', {}, 'This page mounts a reusable Counter component.')
  const testButton = Button({label:"TestLabel1", variant:"off-yellow", onClick : () => {console.log('test')}  })

  // page root
  const page = el('div', { class: 'stack'},
    title,
    lead,
    testButton
  )
  // mount into the provided region
  mount.append(page)

  return {
    unmount() {
      // then remove the page DOM
      if (page.parentNode === mount) mount.removeChild(page)
    }
  }
}
