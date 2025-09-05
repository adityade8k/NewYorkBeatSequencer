// src/main.js (only the relevant additions shown)
import './styles/base.css'
import { createRouter } from '@lib/router/router.js'
import { Nav } from '@components/Nav/Nav.js'
import { Home } from '@pages/home.js'
import { About } from '@pages/about.js'
import { ThreeBackground } from '@components/ThreeBg/ThreeBackground'

const app = document.getElementById('app')

// mount background FIRST so it's behind nav & content
const three = ThreeBackground()
document.body.prepend(three.el)

// now mount persistent nav on top
const nav = Nav();
document.body.prepend(nav.el);

// router as before
const routes = { '/': Home, '/about': About }
createRouter({ app, routes }).start();
