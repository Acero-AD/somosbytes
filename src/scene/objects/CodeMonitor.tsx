import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'

type GroupProps = ThreeElements['group']

const LINES: { color: string; width: number; x: number }[] = [
  { color: '#3ddc84', width: 0.34, x: -0.1 },
  { color: palette.neonMagenta, width: 0.22, x: -0.16 },
  { color: palette.cream, width: 0.4, x: -0.07 },
  { color: palette.neonPurple, width: 0.28, x: -0.13 },
  { color: '#3ddc84', width: 0.18, x: -0.18 },
]

// Decor monitor showing glowing "code" — never a hotspot (design D5).
export function CodeMonitor(props: GroupProps) {
  return (
    <group {...props}>
      <KenneyModel model="computerScreen" />
      <mesh position={[0, 0.34, 0.108]}>
        <planeGeometry args={[0.62, 0.36]} />
        <meshBasicMaterial color="#1c1526" />
      </mesh>
      {LINES.map(({ color, width, x }, i) => (
        <mesh key={i} position={[x, 0.46 - i * 0.06, 0.112]}>
          <planeGeometry args={[width, 0.022]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
