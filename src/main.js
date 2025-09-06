import { Container } from '@components/Container/Container.js'
import { FileLoader } from '@components/packages/FileLoader/FileLoader.js'
import './styles/base.css'
import { el } from '@utils/dom.js'

const app = document.getElementById('app')

const fileLoader = FileLoader({className: "", attrs: {}}, )
const fileLoader1 = FileLoader({className: "", attrs: {}}, )
const fileLoader2 = FileLoader({className: "", attrs: {}}, )
const topCont = Container({className: "noStroke", attrs: {}}, fileLoader.el, fileLoader1.el)
const bottomCont = Container({className: "noStroke", attrs: {}}, fileLoader2.el)

app.append(topCont, bottomCont)