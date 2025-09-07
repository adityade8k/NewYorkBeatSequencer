// src/main.js
import './styles/base.css'

// UI primitives / packages
import { Container } from '@components/Container/Container.js'
import { FileLoader } from '@components/packages/FileLoader/FileLoader.js'
import { SoundMixer } from '@components/packages/SoundMixer/SoundMixer.js'
import { Sequencer } from '@components/packages/Sequencer/Sequencer.js'

import { actions } from '@lib/state/appStore.js'

import { files } from '@data/files.js'

if (Array.isArray(files) && files.length) {
  actions.setAssets(files)
}

const app = document.getElementById('app')

// Top row: FileLoader (left) + SoundMixer (right)
const fileLoader = FileLoader({ className: 'half', attrs: {} })
const soundMixer = SoundMixer({ className: 'half', attrs: {} })
const topRow = Container({ className: 'horizontal noStroke', attrs: {} }, fileLoader.el, soundMixer.el)

// Bottom row: Sequencer
const sequencer = Sequencer({ className: '', attrs: {} })
const bottomRow = Container({ className: 'noStroke', attrs: {} }, sequencer.el)

// Mount
app.append(topRow, bottomRow)
