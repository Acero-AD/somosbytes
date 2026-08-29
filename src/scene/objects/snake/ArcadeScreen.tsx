import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three'
import { useScene } from '../../../state/store'
import { snakeEngine, TICK_MS } from './engine'
import type { Direction } from './engine'
import { SCREEN_H, SCREEN_W, paint } from './paint'

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
  W: 'up',
  A: 'left',
  S: 'down',
  D: 'right',
}

// The cabinet display: one CanvasTexture for every screen state (attract,
// running, paused, game over). Ticks and repaints ride useFrame — the loop
// self-invalidates only while a run is active, so the demand-frameloop
// contract holds everywhere else (design D3).
export function ArcadeScreen() {
  const invalidate = useThree((s) => s.invalidate)
  const active = useScene((s) => s.mode === 'screen' && s.activeHotspot === 'arcade')
  const accumulator = useRef(0)
  const painted = useRef('')

  const { texture, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const ctx = canvas.getContext('2d')!
    const texture = new CanvasTexture(canvas)
    texture.magFilter = NearestFilter
    texture.minFilter = NearestFilter
    texture.generateMipmaps = false
    texture.colorSpace = SRGBColorSpace
    return { texture, ctx }
  }, [])

  // out-of-frame input (d-pad, keys, visibility) kicks one frame to restart the loop
  useEffect(() => {
    snakeEngine.wake = () => invalidate()
    return () => {
      snakeEngine.wake = () => {}
    }
  }, [invalidate])

  // leaving the hotspot abandons the run
  useEffect(() => {
    if (active) return
    snakeEngine.reset()
    invalidate()
  }, [active, invalidate])

  // hidden tab pauses; returning repaints once even under reduced motion
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') snakeEngine.pause()
      else invalidate()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [invalidate])

  // keyboard steering, only while this screen is the focused surface;
  // Escape stays untouched (the overlay's back handler owns it)
  useEffect(() => {
    if (!active) return
    const onKeyDown = (e: KeyboardEvent) => {
      const direction = KEY_DIRECTIONS[e.key]
      if (direction) {
        e.preventDefault()
        snakeEngine.input(direction)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        snakeEngine.pressStart()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  useFrame((state, delta) => {
    if (snakeEngine.status === 'running') {
      // demand frameloop: after an idle gap the first delta spans the whole
      // gap — clamp it so a fresh run doesn't fast-forward into a wall
      accumulator.current += Math.min(delta, 0.12) * 1000
      while (accumulator.current >= TICK_MS) {
        accumulator.current -= TICK_MS
        snakeEngine.tick()
      }
      state.invalidate()
    } else {
      accumulator.current = 0
    }
    // attract blinks on ambient-ticker frames; settled paused/over stay static
    const blinkOn =
      snakeEngine.status === 'attract' ? Math.floor(state.clock.elapsedTime * 1.6) % 2 === 0 : true
    const key = `${snakeEngine.status}:${snakeEngine.ticks}:${snakeEngine.score}:${snakeEngine.highScore}:${blinkOn}`
    if (key !== painted.current) {
      painted.current = key
      paint(ctx, snakeEngine, blinkOn)
      texture.needsUpdate = true
    }
  })

  return (
    <mesh position={[0, 1.14, 0.251]}>
      <planeGeometry args={[0.44, 0.34]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
