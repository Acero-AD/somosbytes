import { CanvasTexture, SRGBColorSpace } from 'three'
import { palette } from '../scene/palette'

// Runtime-generated textures keep the build self-contained (no fetched
// image assets — a visual-experience requirement).

function makeCanvas(size: number): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  return canvas.getContext('2d')!
}

function finish(ctx: CanvasRenderingContext2D): CanvasTexture {
  const texture = new CanvasTexture(ctx.canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

// Deterministic pseudo-random so the pattern is stable across loads.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let plank: CanvasTexture | null = null
export function plankTexture(): CanvasTexture {
  if (plank) return plank
  const size = 1024
  const ctx = makeCanvas(size)
  const rand = mulberry32(7)
  ctx.fillStyle = palette.floor
  ctx.fillRect(0, 0, size, size)
  const rows = 9
  const rowH = size / rows
  for (let r = 0; r < rows; r++) {
    // per-plank tint variation
    const shift = Math.floor((rand() - 0.5) * 22)
    ctx.fillStyle = `rgb(${198 + shift}, ${155 + shift}, ${123 + shift})`
    ctx.fillRect(0, r * rowH, size, rowH - 3)
    // seam
    ctx.fillStyle = 'rgba(90, 60, 40, 0.45)'
    ctx.fillRect(0, (r + 1) * rowH - 3, size, 3)
    // staggered end joints
    const joints = 2 + Math.floor(rand() * 2)
    for (let j = 0; j < joints; j++) {
      const x = Math.floor(rand() * size)
      ctx.fillRect(x, r * rowH, 3, rowH - 3)
    }
    // faint grain streaks
    ctx.fillStyle = 'rgba(120, 85, 60, 0.12)'
    for (let g = 0; g < 5; g++) {
      const y = r * rowH + rand() * (rowH - 6)
      ctx.fillRect(rand() * size * 0.5, y, size * (0.2 + rand() * 0.4), 1.5)
    }
  }
  plank = finish(ctx)
  return plank
}

let wall: CanvasTexture | null = null
export function wallTexture(): CanvasTexture {
  if (wall) return wall
  const size = 512
  const ctx = makeCanvas(size)
  const rand = mulberry32(13)
  ctx.fillStyle = palette.wall
  ctx.fillRect(0, 0, size, size)
  // subtle vertical tonal bands, like painted plaster
  for (let x = 0; x < size; x += 4) {
    const alpha = 0.02 + rand() * 0.05
    ctx.fillStyle = rand() > 0.5 ? `rgba(255, 252, 245, ${alpha})` : `rgba(160, 140, 120, ${alpha})`
    ctx.fillRect(x, 0, 4, size)
  }
  wall = finish(ctx)
  return wall
}
