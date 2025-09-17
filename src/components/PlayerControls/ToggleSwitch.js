import { el } from '@utils/dom.js'
import { Container } from '@components/Container/Container.js'

export function ToggleSwitch({
  label = 'Toggle',
  checked = false,
  onChange,
  className = '',
  attrs = {}
} = {}) {
  const root = Container({ className: ['noPad', className].join(' '), attrs })
  const wrap = el('label', { class: 'Toggle' })
  const span = el('span', { class: 'Toggle__label' }, label)
  const input = el('input', { class: 'Toggle__input', type: 'checkbox' })
  input.checked = !!checked
  input.addEventListener('change', e => onChange?.(!!e.target.checked))
  wrap.append(span, input)
  root.append(wrap)
  return { el: root, set(v){ input.checked = !!v } }
}
