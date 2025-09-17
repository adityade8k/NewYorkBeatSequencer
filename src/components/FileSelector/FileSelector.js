import { el, clear } from '@utils/dom.js'
import { Container } from '@components/Container/Container.js'
import { selectors, storeSub, actions } from '@lib/state/appStore.js'
import './FileSelector.css'

export function FileSelector({
  className = '',
  attrs = {},
  getItems = (s) => s.assets.list,
  getSelectedId = (s) => s.fileLoader.selectedFileId,
  onActivate = (item) => {
    actions.selectFile(item.id)
    actions.loadSelectionIntoPreview()
  },
  columns = { name: 'File Name', action: 'Load' },
  rowLabel = (item) => item?.title ?? item?.name ?? '(unnamed)',
  iconClass = 'icon icon--arrow FileSelector__loadIcon'
} = {}) {
  // Header + rows
  const header = el(
    'div',
    { class: 'FileSelector__header' },
    el('span', { class: 'FileSelector__col FileSelector__col--name' }, columns.name),
    el('span', { class: 'FileSelector__col FileSelector__col--load' }, columns.action)
  )
  const rows = el('div', { class: 'FileSelector__rows' })

  // Root must be a Container
  const root = Container(
    { className: ['noPad', 'FileSelector__root', className].filter(Boolean).join(' '), attrs },
    header,
    rows
  )

  function renderRows() {
    clear(rows)
    const state = selectors.getState()
    const items = getItems(state) || []
    const selectedId = getSelectedId?.(state)

    items.forEach(item => {
      const row = el('div', {
        class: ['FileSelector__row', item.id === selectedId ? 'is-selected' : ''].join(' ')
      })

      const name = el('div', { class: 'FileSelector__name' }, rowLabel(item))

      const handler = () => onActivate(item)

      const loadIcon = el('span', {
        class: iconClass,
        role: 'button',
        tabindex: '0',
        'aria-label': `${columns.action} ${rowLabel(item)}`,
        onClick: handler,
        onKeydown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler() }
        }
      })

      row.append(name, loadIcon)
      rows.appendChild(row)
    })
  }

  // Re-render when input slices change
  const unsubItems = storeSub(getItems, renderRows)
  const unsubSel   = getSelectedId ? storeSub(getSelectedId, renderRows) : null

  renderRows()

  return {
    el: root,
    unmount() { unsubItems?.(); unsubSel?.() }
  }
}
