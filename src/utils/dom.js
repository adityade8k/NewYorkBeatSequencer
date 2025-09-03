// src/utils/dom.js

/**
 * Create a DOM element declaratively.
 * Usage:
 *   el('button', { class: ['btn', 'btn--primary'], onClick: [handler, { once: true }] }, 'Save')
 *   el('div', {}, ['mixed ', 42, el('em', {}, 'children')])
 */
export const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag)

  // ---------- attributes & props ----------
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') {
      // class: string | string[]
      node.className = Array.isArray(v) ? v.filter(Boolean).join(' ') : (v ?? '')
    } else if (k === 'style' && v && typeof v === 'object') {
      // style object
      Object.assign(node.style, v)
    } else if (k === 'dataset' && v && typeof v === 'object') {
      // dataset object -> data-*
      for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv
    } else if (k.startsWith('on:')) {
      // Custom events with dash-cased names, e.g. on:my-event
      const type = k.slice(3) // keep exact case/dashes
      if (typeof v === 'function') node.addEventListener(type, v)
      else if (Array.isArray(v) && typeof v[0] === 'function') node.addEventListener(type, v[0], v[1])
    } else if (k.startsWith('on') && (typeof v === 'function' || Array.isArray(v))) {
      // Standard DOM events (camelCase prop -> lowercase name)
      // onClick -> 'click', onKeydown -> 'keydown', etc.
      const type = k.slice(2).toLowerCase()
      if (Array.isArray(v)) {
        const [fn, opts] = v
        if (typeof fn === 'function') node.addEventListener(type, fn, opts)
      } else {
        node.addEventListener(type, v)
      }
    } else if (v != null) {
      // generic attributes (id, aria-*, role, href, src, value, ...)
      node.setAttribute(k, v)
    }
  }

  // ---------- children (strings, numbers, nodes, arrays) ----------
  const frag = document.createDocumentFragment()

  const appendTo = (target, child) => {
    // skip null/undefined/boolean
    if (child == null || typeof child === 'boolean') return

    // flatten arrays / nested arrays
    if (Array.isArray(child)) {
      child.forEach(c => appendTo(target, c))
      return
    }

    // real DOM nodes (Element/Text/Fragment/etc.)
    if (child instanceof Node) {
      target.appendChild(child)
      return
    }

    // primitive -> text node
    const t = typeof child
    if (t === 'string' || t === 'number' || t === 'bigint') {
      target.appendChild(document.createTextNode(String(child)))
      return
    }

    // plain objects are usually a mistake to render directly
    console.warn('[el] Ignoring non-Node object child:', child)
    // If you actually want objects, convert explicitly with JSON.stringify or a custom renderer.
  }

  children.forEach(c => appendTo(frag, c))
  node.appendChild(frag)

  return node
}

/**
 * Remove all children (handy for targeted re-renders).
 */
export const clear = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild)
}
