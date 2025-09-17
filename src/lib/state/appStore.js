// src/lib/state/appStore.js
import { createStore } from './state.js'

/** -------------------------------------------
 * Helpers
 * ------------------------------------------*/
const zeroPad3 = (n) => String(n).padStart(3, '0')
const indexBy = (arr, key = 'id') =>
  Object.fromEntries(arr.map(x => [x[key], x]))

/** -------------------------------------------
 * Initial State
 * ------------------------------------------*/
const initial = {
  // Library of available audio files
  assets: {
    list: [],                 // Array<Asset>
    byId: {}                  // Record<id, Asset>
  },

  // File loader UI state
  fileLoader: {
    selectedFileId: null
  },

  // “Preview / Remix” sandbox (SoundMixer)
  preview: {
    fileId: null,             // selected asset for preview
    isPlaying: false,
    bpm: 120,
    params: {
      pitchSemitones: 0,      // -24 .. +24 (example range)
      reverbWet: 0,           // 0..1
      reverse: false
    },
    // When user hits “Reset”, we restore to this snapshot
    originalParams: null,
    lastCommittedTrackNumber: 0
  },

  // Tracks committed from preview; Sequencer will use these
  tracks: [],                 // Array<Track>
  // Global transport for the sequencer (not used by Preview)
  transport: {
    bpm: 120,
    isPlaying: false,
    positionBeats: 0,
    loopBeats: 16             // default 16-step loop
  },

  ui: { nowPlayingMixerId: null } 
}

/** -------------------------------------------
 * Store
 * ------------------------------------------*/
export const store = createStore(initial)

/** -------------------------------------------
 * Selectors
 * ------------------------------------------*/
export const selectors = {
  getState: () => store.get(),

  getAssets: () => store.get().assets.list,

  getSelectedAsset() {
    const s = store.get()
    return s.assets.byId[s.fileLoader.selectedFileId] || null
  },

  getPreviewAsset() {
    const s = store.get()
    return s.assets.byId[s.preview.fileId] || null
  },

  getTracks: () => store.get().tracks,

  getNextTrackName() {
    const { lastCommittedTrackNumber } = store.get().preview
    return zeroPad3(lastCommittedTrackNumber + 1)
  }
}

/** -------------------------------------------
 * Actions
 * ------------------------------------------*/
export const actions = {
  /** Load/replace the asset list (from /src/data or wherever) */
  setAssets(list) {
    const withIds = list.map((a, i) => ({ id: a.id ?? String(i), ...a }))
    store.set(s => ({
      assets: { list: withIds, byId: indexBy(withIds, 'id') }
    }))
    console.log(store.get(),);
  },

  /** When the arrow is clicked in FileList */
  selectFile(id) {
    store.set(s => ({
      fileLoader: { ...s.fileLoader, selectedFileId: id }
    }))
  },

  /** Load currently selected file into the Preview/Remixer */
  loadSelectionIntoPreview() {
    const s = store.get()
    const id = s.fileLoader.selectedFileId
    if (!id) return

    store.set({
      preview: {
        ...s.preview,
        fileId: id,
        isPlaying: false,
        // reset params and keep a baseline snapshot for Reset
        params: { pitchSemitones: 0, reverbWet: 0, reverse: false },
        originalParams: { pitchSemitones: 0, reverbWet: 0, reverse: false }
      }
    })
  },

  /** Preview param setters (pitch/reverb/reverse) */
  setPreviewParam(key, value) {
    store.set(s => ({
      preview: {
        ...s.preview,
        params: { ...s.preview.params, [key]: value }
      }
    }))
  },

  setPreviewBpm(bpm) {
    const clamped = Math.max(20, Math.min(300, Number(bpm) || 120))
    store.set(s => ({
      preview: { ...s.preview, bpm: clamped }
    }))
  },

  /** Player controls for the Preview area */
  playPreview() {
    store.set(s => ({
      preview: { ...s.preview, isPlaying: true }
    }))
  },

  pausePreview() {
    store.set(s => ({
      preview: { ...s.preview, isPlaying: false }
    }))
  },

  /** Reset: stop & restore params to the “loaded” snapshot */
  resetPreview() {
    store.set(s => ({
      preview: {
        ...s.preview,
        isPlaying: false,
        params: { ...(s.preview.originalParams ?? s.preview.params) }
      }
    }))
  },

  /** Commit current preview settings as a new Track */
  commitPreviewAsTrack() {
    const s = store.get()
    const assetId = s.preview.fileId
    if (!assetId) return

    const nextNum = s.preview.lastCommittedTrackNumber + 1
    const name = zeroPad3(nextNum)

    const track = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${nextNum}`,
      name,                 // "001", "002", ...
      sourceFileId: assetId,
      // Snapshot current params so later edits don’t affect this track
      params: { ...s.preview.params },
      createdAt: Date.now()
    }

    store.set({
      tracks: [...s.tracks, track],
      preview: { ...s.preview, lastCommittedTrackNumber: nextNum }
    })
  },

  /** Transport (for the bottom Sequencer; not used by Preview) */
  setTransportBpm(bpm) {
    const clamped = Math.max(20, Math.min(300, Number(bpm) || 120))
    store.set(s => ({
      transport: { ...s.transport, bpm: clamped }
    }))
  },

  playTransport() {
    store.set(s => ({ transport: { ...s.transport, isPlaying: true } }))
  },

  pauseTransport() {
    store.set(s => ({ transport: { ...s.transport, isPlaying: false } }))
  },

  setLoopBeats(n) {
    const beats = Math.max(1, Math.min(128, Number(n) || 16))
    store.set(s => ({ transport: { ...s.transport, loopBeats: beats } }))
  },
  mixerPlayRequest(mixerId) {
    store.set(s => ({
      ui: { ...(s.ui || {}), nowPlayingMixerId: mixerId },
      preview: { ...s.preview, isPlaying: true }
    }))
  },

  mixerStop(mixerId) {
    store.set(s => {
      const isOwner = s.ui?.nowPlayingMixerId === mixerId
      return {
        ui: { ...(s.ui || {}), nowPlayingMixerId: isOwner ? null : s.ui.nowPlayingMixerId },
        preview: { ...s.preview, isPlaying: false }
      }
    })
  }
}

/** -------------------------------------------
 * Convenience: subscribe with partial selector
 * storeSub(selectorFn, callback) -> unsubscribe()
 * ------------------------------------------*/
export function storeSub(selector, fn) {
  let prev = selector(store.get())
  return store.subscribe(s => {
    const next = selector(s)
    if (next !== prev) {
      prev = next
      fn(next, s)
    }
  })
}
