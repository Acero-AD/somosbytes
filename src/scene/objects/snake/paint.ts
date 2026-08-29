import { palette } from '../../palette'
import { COLS, ROWS } from './engine'
import type { SnakeEngine } from './engine'

export const CELL = 8
export const SCREEN_W = COLS * CELL
export const SCREEN_H = ROWS * CELL

const BG = '#12081c'
const HEAD = '#c26bf0'
const HUD_FONT = 'bold 9px monospace'
const TITLE_FONT = 'bold 16px monospace'

// fixed pixel field for the attract screen; halves alternate with the blink
const ATTRACT_PIXELS: { x: number; y: number; color: string }[] = [
  { x: 4, y: 3, color: palette.neonPurple },
  { x: 17, y: 4, color: palette.neonRed },
  { x: 7, y: 12, color: '#3ddc84' },
  { x: 14, y: 11, color: palette.neonMagenta },
  { x: 2, y: 8, color: palette.neonMagenta },
  { x: 19, y: 9, color: palette.neonPurple },
  { x: 10, y: 2, color: '#3ddc84' },
  { x: 12, y: 14, color: palette.neonRed },
]

const pad = (n: number) => String(n).padStart(4, '0')

const cell = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  ctx.fillStyle = color
  ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
}

const centered = (ctx: CanvasRenderingContext2D, text: string, y: number, font: string) => {
  ctx.fillStyle = palette.cream
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.fillText(text, SCREEN_W / 2, y)
}

const veil = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgba(18, 8, 28, 0.72)'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
}

export function paint(ctx: CanvasRenderingContext2D, engine: SnakeEngine, blinkOn: boolean) {
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  if (engine.status === 'attract') {
    for (const [i, p] of ATTRACT_PIXELS.entries()) {
      if (i % 2 === (blinkOn ? 0 : 1)) cell(ctx, p.x, p.y, p.color)
    }
    centered(ctx, 'SNAKE', 56, TITLE_FONT)
    if (blinkOn) centered(ctx, 'PRESS START', SCREEN_H - 12, HUD_FONT)
    ctx.fillStyle = palette.cream
    ctx.font = HUD_FONT
    ctx.textAlign = 'left'
    ctx.fillText(`HI ${pad(engine.highScore)}`, 4, 11)
    return
  }

  cell(ctx, engine.food.x, engine.food.y, palette.neonMagenta)
  engine.snake.forEach((segment, i) => cell(ctx, segment.x, segment.y, i === 0 ? HEAD : palette.neonPurple))

  ctx.fillStyle = palette.cream
  ctx.font = HUD_FONT
  ctx.textAlign = 'left'
  ctx.fillText(`SC ${pad(engine.score)}`, 4, 11)
  ctx.textAlign = 'right'
  ctx.fillText(`HI ${pad(engine.highScore)}`, SCREEN_W - 4, 11)

  if (engine.status === 'paused') {
    veil(ctx)
    centered(ctx, 'PAUSED', 62, TITLE_FONT)
    centered(ctx, 'PRESS START', SCREEN_H - 12, HUD_FONT)
  } else if (engine.status === 'over') {
    veil(ctx)
    centered(ctx, 'GAME OVER', 56, TITLE_FONT)
    centered(ctx, `SCORE ${pad(engine.score)}`, 76, HUD_FONT)
    centered(ctx, 'PRESS START', SCREEN_H - 12, HUD_FONT)
  }
}
