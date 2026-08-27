import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { Mesh } from 'three'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'
import { SCREEN_CENTER_Y, SCREEN_SIZE, SCREEN_TILT } from './Pc'

type GroupProps = ThreeElements['group']

const LINES: { color: string; width: number; x: number }[] = [
  { color: '#3ddc84', width: 0.42, x: -0.12 },
  { color: palette.neonMagenta, width: 0.28, x: -0.19 },
  { color: palette.cream, width: 0.5, x: -0.08 },
  { color: palette.neonPurple, width: 0.34, x: -0.16 },
  { color: '#3ddc84', width: 0.22, x: -0.22 },
]

// Decor monitor showing glowing "code" — never a hotspot (design D5). The
// content group lies on the measured tilted display quad (see Pc.tsx).
// The cursor blinks on the ambient ticker's frames.
export function CodeMonitor(props: GroupProps) {
  const cursorRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (cursorRef.current) cursorRef.current.visible = Math.floor(clock.elapsedTime * 1.6) % 2 === 0
  })
  return (
    <group {...props}>
      <KenneyModel model="computerScreen" />
      <group position={[0, SCREEN_CENTER_Y, 0.004]} rotation={[SCREEN_TILT, 0, 0]}>
        <mesh>
          <planeGeometry args={SCREEN_SIZE} />
          <meshBasicMaterial color="#1c1526" />
        </mesh>
        {LINES.map(({ color, width, x }, i) => (
          <mesh key={i} position={[x, 0.16 - i * 0.055, 0.002]}>
            <planeGeometry args={[width, 0.024]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        ))}
        <mesh ref={cursorRef} position={[-0.09, -0.125, 0.002]}>
          <planeGeometry args={[0.026, 0.034]} />
          <meshBasicMaterial color="#3ddc84" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
