import { el } from '@utils/dom.js'
import { Container } from '@components/Container/Container.js'
import { Button } from '@components/Button/Button.js'

export function PlayerControls({
  isPlaying = false,
  canPlay = true,
  onPlay,
  onPause,
  onReset,
  className = '',
  attrs = {}
} = {}) {
  const root = Container({ className: ['noPad', className].join(' '), attrs })

  const pauseBtn = Button({
    label: '⏸',
    variant: (!isPlaying || !canPlay) ? 'on' : 'off',
    className: 'Player__btn'
  })

  const playBtn = Button({
    label: '▶',
    variant: (isPlaying || !canPlay) ? 'on' : 'off',
    className: 'Player__btn'
  })

  const resetBtn = Button({
    label: '⟲',
    variant: canPlay ? 'off' : 'on',
    className: 'Player__btn btn--yellow'
  })

  if (onPause) pauseBtn.addEventListener('click', onPause)
  if (onPlay)  playBtn.addEventListener('click', onPlay)
  if (onReset) resetBtn.addEventListener('click', onReset)

  root.append(pauseBtn, playBtn, resetBtn)
  return { el: root, update({ isPlaying: p, canPlay: c }) {
    pauseBtn.disabled = (!p || !c)
    playBtn.disabled  = (p || !c)
    resetBtn.disabled = !c
  }}
}
