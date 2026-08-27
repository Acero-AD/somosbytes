import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { Mesh } from 'three'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'

type GroupProps = ThreeElements['group']

const LINES: { color: string; width: number; x: number }[] = [
  { color: '#3ddc84', width: 0.42, x: -0.14 },
  { color: palette.neonMagenta, width: 0.28, x: -0.21 },
  { color: palette.cream, width: 0.5, x: -0.1 },
  { color: palette.neonPurple, width: 0.34, x: -0.18 },
  { color: '#3ddc84', width: 0.22, x: -0.24 },
]

// Decor monitor showing glowing "code" — never a hotspot (design D5).
// Plane geometry mirrors the measured monitor glass (see Pc.tsx): the
// display sits recessed at z=-0.019 relative to the centered model.
// The cursor blinks on the ambient ticker's frames.
export function CodeMonitor(props: GroupProps) {
  const cursorRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (cursorRef.current) cursorRef.current.visible = Math.floor(clock.elapsedTime * 1.6) % 2 === 0
  })
  return (
    <group {...props}>
      <KenneyModel model="computerScreen" />
      <mesh position={[0, 0.386, -0.015]}>
        <planeGeometry args={[0.78, 0.4]} />
        <meshBasicMaterial color="#1c1526" />
      </mesh>
      {LINES.map(({ color, width, x }, i) => (
        <mesh key={i} position={[x, 0.52 - i * 0.06, -0.012]}>
          <planeGeometry args={[width, 0.024]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={cursorRef} position={[-0.1, 0.22, -0.012]}>
        <planeGeometry args={[0.026, 0.034]} />
        <meshBasicMaterial color="#3ddc84" toneMapped={false} />
      </mesh>
    </group>
  )
}
