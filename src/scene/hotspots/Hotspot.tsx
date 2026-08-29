import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeElements, ThreeEvent } from '@react-three/fiber'
import { Color, MathUtils, Mesh, MeshStandardMaterial } from 'three'
import type { Group } from 'three'
import { useScene } from '../../state/store'
import { HotspotLabel } from './HotspotLabel'
import type { HotspotId } from './hotspots'

type GroupProps = ThreeElements['group']

interface HotspotProps extends Omit<GroupProps, 'id'> {
  id: HotspotId
  /** Size of the invisible, raycast-only hit box (three ignores `visible` when raycasting). */
  hitSize: [number, number, number]
  /** Hit box center relative to the group origin. */
  hitOffset?: [number, number, number]
  /** Easter-egg mode: no label chip, no hover highlight/pulse — only the pointer cursor changes. */
  silent?: boolean
}

const HIGHLIGHT = new Color('#ffb347')
const BLACK = new Color('#000000')

export function Hotspot({ id, hitSize, hitOffset = [0, 0, 0], silent = false, children, ...props }: HotspotProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const enabled = useScene((s) => s.mode === 'overview' && !s.isTransitioning)
  const focus = useScene((s) => s.focus)
  const back = useScene((s) => s.back)
  // Materials get cloned once per hotspot so highlighting never bleeds into
  // meshes that share a material (relevant once GLTF props land in M3).
  const highlightables = useMemo(() => new Set<MeshStandardMaterial>(), [])

  useEffect(() => {
    if (silent) return
    const group = groupRef.current
    if (!group) return
    group.traverse((child) => {
      if (!(child instanceof Mesh) || child.material instanceof MeshStandardMaterial === false) return
      const cloned = (child.material as MeshStandardMaterial).clone()
      child.material = cloned
      highlightables.add(cloned)
    })
    return () => highlightables.clear()
  }, [highlightables, silent])

  const active = hovered && enabled
  const invalidate = useThree((s) => s.invalidate)

  // frameloop is "demand": kick rendering when the hover state changes so the
  // highlight shows and the pulse loop below can take over.
  useEffect(() => {
    if (!silent) invalidate()
  }, [active, silent, invalidate])

  useEffect(() => {
    if (!active) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [active])

  useEffect(() => {
    if (!active || silent) return
    for (const material of highlightables) {
      material.emissive.copy(HIGHLIGHT)
      material.emissiveIntensity = 0.3
    }
    return () => {
      for (const material of highlightables) {
        material.emissive.copy(BLACK)
        material.emissiveIntensity = 1
      }
    }
  }, [active, silent, highlightables])

  useFrame((state, delta) => {
    if (silent) return
    const group = groupRef.current
    if (!group) return
    const target = active ? 1.03 + Math.sin(state.clock.elapsedTime * 5) * 0.01 : 1
    group.scale.setScalar(MathUtils.damp(group.scale.x, target, 8, delta))
    // keep frames coming while pulsing or settling back to rest
    if (active || Math.abs(group.scale.x - 1) > 0.001) state.invalidate()
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const { mode, isTransitioning } = useScene.getState()
    if (isTransitioning) return
    if (mode === 'overview') focus(id)
    else back() // a disabled hotspot behaves like clicking outside
  }

  return (
    <group
      ref={groupRef}
      {...props}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh visible={false} position={hitOffset}>
        <boxGeometry args={hitSize} />
      </mesh>
      {!silent && <HotspotLabel id={id} />}
      {children}
    </group>
  )
}
