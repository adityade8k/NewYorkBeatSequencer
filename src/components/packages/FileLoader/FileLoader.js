// src/components/packages/FileLoader/FileLoader.js
import { Container } from '@components/Container/Container.js'
import { FileSelector } from '@components/FileSelector/FileSelector.js'
import { selectors, storeSub } from '@lib/state/appStore.js'
import { el } from '@utils/dom.js'

export function FileLoader({ className = '', attrs = {} } = {}) {
  // Header bar
  const header = Container(
    { className: ['secondaryStroke'], attrs: {} },
    'New York Beat Sequencer'
  )

  // Title/label
  const title = Container(
    { className: 'label', attrs: {} },
    'Step 1: Choose a sound.'
  )

  // File selector (root is a Container; add noStroke to avoid nested borders)
  const list = FileSelector({
    className: '',
    // columns, onActivate, etc. can be left default here
  })

  // Footer (shows currently selected FILE)
  const selectedStrong = el('strong', { class: 'filelist__selected' }, '—')
  const footer = el(
    'div',
    { class: 'filelist__footer' },
    'Currently Selected File: ',
    selectedStrong
  )

  // Selector panel stack
  const selectorPane = Container(
    { className: ['vertical', 'fileLoader'], attrs: {} },
    title,
    list.el,
    footer
  )

  // Root panel
  const root = Container(
    { className: ['vertical', className].filter(Boolean).join(' '), attrs },
    header,
    selectorPane
  )

  // Keep footer in sync with store selection
  function updateFooter() {
    const selected = selectors.getSelectedAsset()
    selectedStrong.textContent = selected?.title ?? '—'
  }
  const unsub = storeSub(s => s.fileLoader.selectedFileId, updateFooter)
  updateFooter() // initial paint

  return {
    el: root,
    unmount() { list.unmount?.(); unsub?.() }
  }
}
