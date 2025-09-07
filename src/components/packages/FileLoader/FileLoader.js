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

    
    

    // Footer (shows currently selected file)
    const selectedStrong = el('strong', { class: 'filelist__selected' }, '—')
    const footer = el(
        'div',
        { class: 'filelist__footer' },
        'Currently Selected Track: ',
        selectedStrong
    )

    const list = FileSelector()
    const FileSelectorCont = Container(
        { className: ["vertical", 'fileLoader'], attrs: {} },
         title, list.el, footer
    )

    // Root panel
    const root = Container(
        { className: ['vertical', className].filter(Boolean).join(' '), attrs },
        header,
        FileSelectorCont,
    )

    // Keep footer in sync with store
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
