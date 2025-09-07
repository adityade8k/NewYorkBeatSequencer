import { el, clear } from '@utils/dom.js'
import { Container } from '@components/Container/Container.js'
import { actions, selectors, storeSub } from '@lib/state/appStore.js'
import './FileSelector.css'

export function FileSelector({ className = '', attrs = {} } = {}) {
  // Header + rows
  const header = el(
    'div',
    { class: 'FileSelector__header' },
    el('span', { class: 'FileSelector__col FileSelector__col--name' }, 'File Name'),
    el('span', { class: 'FileSelector__col FileSelector__col--load' }, 'Load')
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
    const assets = selectors.getAssets()
    const selectedId = selectors.getState().fileLoader.selectedFileId

    assets.forEach(asset => {
      const row = el('div', {
        class: ['FileSelector__row', asset.id === selectedId ? 'is-selected' : ''].join(' ')
      })

      const name = el('div', { class: 'FileSelector__name' }, asset.title)

      const handler = () => {
        actions.selectFile(asset.id)
        actions.loadSelectionIntoPreview()
      }

      const loadIcon = el('span', {
        class: 'icon icon--arrow FileSelector__loadIcon',
        role: 'button',
        tabindex: '0',
        'aria-label': `Load ${asset.title}`,
        onClick: handler,
        onKeydown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler() }
        }
      })

      row.append(name, loadIcon)
      rows.appendChild(row)
    })
  }

  const unsubAssets = storeSub(s => s.assets.list, renderRows)
  const unsubSelection = storeSub(s => s.fileLoader.selectedFileId, renderRows)
  renderRows()

  return {
    el: root,
    unmount() { unsubAssets?.(); unsubSelection?.() }
  }
}
