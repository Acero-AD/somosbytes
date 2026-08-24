import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

const WIDTH = 1.1
const HEIGHT = 1

// Fake window: frame + cross bars over an emissive sky plane. Pure set
// dressing (no real light comes through); face points along +z.
export function FakeWindow(props: GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial color={palette.sky} />
      </mesh>
      {/* frame: top/bottom/left/right + cross bars */}
      {[
        { pos: [0, HEIGHT / 2, 0.02] as const, size: [WIDTH + 0.12, 0.08, 0.06] as const },
        { pos: [0, -HEIGHT / 2, 0.02] as const, size: [WIDTH + 0.12, 0.08, 0.06] as const },
        { pos: [-WIDTH / 2, 0, 0.02] as const, size: [0.08, HEIGHT + 0.12, 0.06] as const },
        { pos: [WIDTH / 2, 0, 0.02] as const, size: [0.08, HEIGHT + 0.12, 0.06] as const },
        { pos: [0, 0, 0.015] as const, size: [WIDTH, 0.05, 0.04] as const },
        { pos: [0, 0, 0.015] as const, size: [0.05, HEIGHT, 0.04] as const },
      ].map(({ pos, size }, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <boxGeometry args={[size[0], size[1], size[2]]} />
          <meshStandardMaterial color={palette.cream} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}
