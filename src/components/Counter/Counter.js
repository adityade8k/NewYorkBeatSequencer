// src/components/Counter/Counter.js
import { el } from '@utils/dom.js'
import { store } from '@lib/state/appStore.js'
import { Button } from '@components/Button/Button.js'

export function Counter() {
  // --- UI pieces
  const badge = el('span', { class: 'badge' }, 'count: ?')

  

  const incBtn = Button({
    label: '+',
    variant: 'primary',
    onClick: () => store.update(s => ({ count: s.count + 1 }))
  })

  const decBtn = Button({
    label: '–',
    variant: 'danger',
    onClick: () => store.update(s => ({ count: s.count - 1 }))
  })

  const resetBtn = Button({
    label: 'Reset',
    onClick: () => store.set({ count: 0 }),
    variant: 'ghost'
  })

  const row = el('div', { class: 'row' }, badge, incBtn, decBtn, resetBtn)

  // --- subscribe to store (reactive badge)
  const unsub = store.subscribe(s => {
    badge.textContent = `count: ${s.count}`
  })

  // --- component root
  const root = el('div', { class: 'stack' },
    el('div', { class: 'row' },
      el('span', { class: 'badge' }, 'demo'),
      'Reactive counter (component)'
    ),
    row
  )

  return {
    el: root,
    unmount() {
      // stop reacting when the component is removed
      unsub()
    }
  }
}
