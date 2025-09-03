// src/lib/router/router.js
import { clear } from '@utils/dom.js'

/**
 * Minimal hash router.
 * - routes: { '/': Home, '/about': About, ... }
 * - app: the container element to render pages into
 *
 * Each page is a function like: Page({ mount }) => { unmount?() }
 */
export function createRouter({ app, routes }) {
  let current = null  // holds the currently mounted page instance (to unmount later)

  const render = () => {
    // 1) get path from the URL hash (e.g., "#/about" -> "/about")
    const path = location.hash.slice(1) || '/'

    // 2) choose the page function for this path (fallback to '/')
    const View = routes[path] || routes['/']

    // 3) clean up the previous page if it exposed an unmount()
    if (current?.unmount) current.unmount()

    // 4) clear the app container’s DOM
    clear(app)

    // 5) mount the new page; keep what it returns for teardown later
    current = View({ mount: app })
  }

  // Start listening to navigation (hash changes) and render once at load
  const start = () => {
    window.addEventListener('hashchange', render)
    render()
  }

  // Optional helper: programmatic navigation
  const goto = (path) => { location.hash = path }

  return { start, goto }
}
