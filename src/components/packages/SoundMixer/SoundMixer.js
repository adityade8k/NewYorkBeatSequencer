import * as Tone from 'tone'
import { el, clear } from '@utils/dom.js'
import { Container } from '@components/Container/Container.js'
import { PlayerControls } from '@playerControls/PlayerControls.js'
import { ParamSlider } from '@playerControls/ParamSlider.js'
import { ToggleSwitch } from '@playerControls/ToggleSwitch.js'
import { selectors, storeSub, actions } from '@lib/state/appStore.js'

export function SoundMixer({ className = '', attrs = {} } = {}) {
  // Unique id so only one SoundMixer plays at a time
  const mixerId = (crypto?.randomUUID?.() || `mixer_${Date.now()}_${Math.random().toString(36).slice(2)}`)

  
  const title = Container({ className: 'label' }, 'Step 2: Remix it')

  const previewArea = Container({ className: 'noPad SoundMixer__preview' }, 
    el('div', { class: 'SoundMixer__canvas' })
  )
  const fileBadge = Container({ className: 'noPad SoundMixer__file' }, 'File Name')

  const controlsCol = Container({ className: 'vertical noPad SoundMixer__controlsCol' })

  const pitch = ParamSlider({ label: 'Pitch', min: -12, max: 12, step: 1, value: 0,
    onInput: (v) => actions.setPreviewParam('pitchSemitones', v)
  })
  const reverb = ParamSlider({ label: 'Reverb', min: 0, max: 1, step: 0.01, value: 0,
    onInput: (v) => actions.setPreviewParam('reverbWet', v)
  })
  const reverse = ToggleSwitch({ label: 'Reverse',
    onChange: (v) => actions.setPreviewParam('reverse', v)
  })

  const bpmBox = el('input', {
    class: 'SoundMixer__bpm',
    type: 'number', min: '20', max: '300', step: '1',
    value: String(selectors.getState().preview.bpm || 120),
    onInput: (e) => actions.setPreviewBpm(e.target.value)
  })

  const player = PlayerControls({
    isPlaying: false,
    canPlay: false,
    onPlay:  async () => { await ensureAudioStart(); actions.mixerPlayRequest(mixerId); startLoop(); },
    onPause: () => { actions.mixerStop(mixerId); stopLoop(); },
    onReset: () => { actions.mixerStop(mixerId); stopLoop(); actions.resetPreview(); syncFromState(); }
  })

  const rightSide = Container({ className: 'vertical noPad' },
    Container({ className: 'noPad label' }, 'Preview BPM'), bpmBox,
    Container({ className: 'noPad' }, pitch.el),
    Container({ className: 'noPad' }, reverb.el),
    Container({ className: 'noPad' }, reverse.el),
  )

  const topRow = Container({ className: 'horizontal noStroke' },
    Container({ className: 'vertical noPad half' }, previewArea, fileBadge),
    rightSide
  )

  const bottomRow = Container({ className: 'noStroke' }, player.el)

  const root = Container(
    { className: ['vertical', className].join(' '), attrs },
    title, topRow, bottomRow
  )

  // ----- Tone.js engine -----
  let buffer = null
  let loopTimer = null

  const pitchNode = new Tone.PitchShift({ pitch: 0 })
  const reverbNode = new Tone.Reverb({ decay: 2.5, wet: 0 })
  pitchNode.connect(reverbNode)
  reverbNode.toDestination()

  async function ensureAudioStart() {
    if (Tone.context.state !== 'running') await Tone.start()
  }

  async function loadBuffer(url) {
    buffer = null
    if (!url) return
    buffer = await new Promise((resolve, reject) => {
      const b = new Tone.ToneAudioBuffer(url,
        () => resolve(b),
        (e) => reject(e)
      )
    })
  }

  function triggerVoice(time = undefined) {
    if (!buffer) return
    const player = new Tone.Player({ url: buffer, autostart: false })
    // apply params snapshot at trigger time
    const p = selectors.getState().preview.params || {}
    player.reverse = !!p.reverse
    player.connect(pitchNode)
    player.start(time ?? undefined)
    // auto-dispose after it finishes
    const dur = buffer.duration
    setTimeout(() => { player.dispose() }, (dur + 0.25) * 1000)
  }

  function startLoop() {
    stopLoop()
    const bpm = selectors.getState().preview.bpm || 120
    const intervalMs = (60 / bpm) * 1000
    // first hit immediately
    triggerVoice()
    loopTimer = setInterval(() => {
      // If someone else grabbed ownership, stop spawning
      if (selectors.getState().ui?.nowPlayingMixerId !== mixerId) { stopLoop(); return }
      triggerVoice()
    }, intervalMs)
  }

  function stopLoop() {
    if (loopTimer) { clearInterval(loopTimer); loopTimer = null }
  }

  function syncFromState() {
    const s = selectors.getState()
    const asset = selectors.getPreviewAsset()
    // ui
    fileBadge.textContent = asset ? asset.title : 'File Name'
    bpmBox.value = String(s.preview.bpm ?? 120)
    const pr = s.preview.params || {}
    pitch.set(pr.pitchSemitones ?? 0)
    reverb.set(pr.reverbWet ?? 0)
    reverse.set(!!pr.reverse)
    // nodes
    pitchNode.pitch = pr.pitchSemitones ?? 0
    reverbNode.wet.value = pr.reverbWet ?? 0
  }

  // ----- Store subscriptions -----
  const unsubPreview = storeSub(s => s.preview, async (next) => {
    // params -> update nodes
    const pr = next.params || {}
    pitchNode.pitch = pr.pitchSemitones ?? 0
    reverbNode.wet.value = pr.reverbWet ?? 0

    // bpm -> restart interval if playing
    if (loopTimer) startLoop()

    // file change -> load buffer
    const asset = selectors.getPreviewAsset()
    await loadBuffer(asset?.url)
    syncFromState()
  })

  const unsubOwner = storeSub(s => s.ui?.nowPlayingMixerId, (ownerId) => {
    const iOwn = ownerId === mixerId
    const canPlay = !!selectors.getPreviewAsset()
    // update buttons
    player.update({ isPlaying: iOwn, canPlay })
    // if I don't own and a loop is running, stop it
    if (!iOwn) stopLoop()
  })

  // initial load/sync
  ;(async () => {
    const asset = selectors.getPreviewAsset()
    await loadBuffer(asset?.url)
    syncFromState()
    player.update({
      isPlaying: selectors.getState().ui?.nowPlayingMixerId === mixerId,
      canPlay: !!asset
    })
  })()

  return {
    el: root,
    unmount() {
      stopLoop()
      unsubPreview?.()
      unsubOwner?.()
      pitchNode.dispose()
      reverbNode.dispose()
    }
  }
}
