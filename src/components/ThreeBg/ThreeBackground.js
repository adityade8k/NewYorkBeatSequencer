// src/components/ThreeBG/ThreeBackground.js
import * as THREE from 'three'
import { el } from '@utils/dom.js'

/**
 * ThreeBackground()
 * - Renders a transparent WebGL canvas fixed behind the page.
 * - As the user scrolls, the camera orbits around a cube.
 * - Returns { el, unmount } so you can dispose cleanly if needed.
 */
export function ThreeBackground() {
  // --- DOM wrapper (fixed position via CSS) ---
  const root = el('div', { class: 'three-bg' })

  // --- Renderer (transparent so your site background still shows) ---
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  root.appendChild(renderer.domElement)

  // --- Scene, Camera, Lights ---
  const scene = new THREE.Scene()
  scene.background = null // keep transparent

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  scene.add(camera)

  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(3, 5, 2)
  scene.add(ambient, dir)

  // --- Cube (the thing we orbit around) ---
  const geo = new THREE.BoxGeometry(2, 2, 2)
  const mat = new THREE.MeshStandardMaterial({
    color: 0x5e9cff,
    roughness: 0.4,
    metalness: 0.2
  })
  const cube = new THREE.Mesh(geo, mat)
  scene.add(cube)

  // --- Sizing & resize handling ---
  function resize() {
    const w = root.clientWidth || window.innerWidth
    const h = root.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }
  resize()
  window.addEventListener('resize', resize)

  // --- Scroll → camera orbit mapping ---
  // We compute an angle from scroll progress [0..1] → [0..2π].
  const radius = 6
  let angle = 0

  function updateFromScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const t = window.scrollY / maxScroll // 0..1
    angle = t * Math.PI * 2              // full revolution across full page scroll
  }
  updateFromScroll()
  window.addEventListener('scroll', updateFromScroll, { passive: true })

  // --- Animation loop ---
  let rafId = 0
  function tick() {
    rafId = requestAnimationFrame(tick)

    // optional: slowly rotate the cube itself
    cube.rotation.y += 0.01
    cube.rotation.x += 0.005

    // position camera on a horizontal circle; add gentle vertical motion
    camera.position.x = radius * Math.cos(angle)
    camera.position.z = radius * Math.sin(angle)
    camera.position.y = 1.2 * Math.sin(angle * 0.5)
    camera.lookAt(cube.position)

    renderer.render(scene, camera)
  }
  tick()

  // --- Cleanup for unmount (if ever removed) ---
  function unmount() {
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', updateFromScroll)
    cancelAnimationFrame(rafId)

    // dispose GPU resources
    geo.dispose()
    mat.dispose()
    renderer.dispose()

    // remove canvas from DOM
    renderer.domElement?.remove()
    root.remove()
  }

  return { el: root, unmount }
}
