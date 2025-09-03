// src/main.js
import './styles/base.css'
import { el } from '@utils/dom.js'
import { createRouter } from '@lib/router/router.js'
import { Home } from '@pages/Home.js'
import { About } from '@pages/About.js'

// 1) Get the app mount region
const app = document.getElementById('app')

// 2) Persistent nav (stays across route changes)
const nav = el('nav', { class: 'site' },
  el('div', { class: 'brand' },
    el('strong', {}, 'Vanilla Vite Modular')
  ),
  el('div', { class: 'links' },
    el('a', { href: '#/' }, 'Home'),
    el('a', { href: '#/about' }, 'About')
  )
)
// Put nav above the app container
document.body.prepend(nav)

// 3) Define routes
const routes = {
  '/': Home,
  '/about': About
}

// 4) Create and start the router
const router = createRouter({ app, routes })
router.start()

console.log('Router started. Try clicking the Home/About links.')
