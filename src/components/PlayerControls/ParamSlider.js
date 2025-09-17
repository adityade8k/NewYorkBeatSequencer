import { el } from '@utils/dom.js'
import { Container } from '@components/Container/Container.js'

export function ParamSlider({
  label = 'Param',
  min = 0, max = 1, step = 0.01,
  value = 0,
  onInput,
  className = '',
  attrs = {}
} = {}) {
  const root = Container({ className: ['noPad', className].join(' '), attrs })
  const wrap = el('div', { class: 'ParamSlider' })
  const lab  = el('label', { class: 'ParamSlider__label' }, label)
  const slider = el('input', { class: 'ParamSlider__input', type: 'range', min, max, step, value })
  slider.addEventListener('input', e => onInput?.(Number(e.target.value)))
  wrap.append(lab, slider)
  root.append(wrap)
  return { el: root, set(v){ slider.value = String(v) } }
}
