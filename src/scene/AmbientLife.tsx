import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { BufferAttribute, Points } from 'three'

// Drives ambient idle motion under frameloop="demand": while enabled it
// invalidates every frame; disabled (hidden tab, or the visitor prefers
// reduced motion) it stops entirely, restoring zero-render idle (design D4).
export function AmbientTicker() {
  const invalidate = useThree((s) => s.invalidate)
  const [enabled, setEnabled] = useState(false)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(document.visibilityState === 'visible' && !query.matches)
    update()
    document.addEventListener('visibilitychange', update)
    query.addEventListener('change', update)
    return () => {
      document.removeEventListener('visibilitychange', update)
      query.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    if (enabled) invalidate()
  }, [enabled, invalidate])

  useFrame(() => {
    if (enabledRef.current) invalidate()
  })
  return null
}

const MOTE_COUNT = 60

// One Points cloud drifting slowly upward through the room; never raycast,
// so it can't intercept hotspot clicks.
export function DustMotes() {
  const pointsRef = useRef<Points>(null)
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(MOTE_COUNT * 3)
    const speeds = new Float32Array(MOTE_COUNT)
    for (let i = 0; i < MOTE_COUNT; i++) {
      positions[i * 3] = -2.5 + Math.random() * 5
      positions[i * 3 + 1] = 0.2 + Math.random() * 2.3
      positions[i * 3 + 2] = -2.5 + Math.random() * 5
      speeds[i] = 0.02 + Math.random() * 0.05
    }
    return { positions, speeds }
  }, [])

  useFrame((state, delta) => {
    const points = pointsRef.current
    if (!points) return
    const attr = points.geometry.getAttribute('position') as BufferAttribute
    const t = state.clock.elapsedTime
    for (let i = 0; i < MOTE_COUNT; i++) {
      let y = attr.getY(i) + speeds[i] * delta
      if (y > 2.6) y = 0.2
      attr.setY(i, y)
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.4 + i) * 0.0004)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#fff6ea" transparent opacity={0.35} depthWrite={false} />
    </points>
  )
}
