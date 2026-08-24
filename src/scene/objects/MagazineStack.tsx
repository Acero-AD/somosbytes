import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

const LAYERS: { color: string; rotation: number; offset: [number, number] }[] = [
  { color: palette.blush, rotation: 0.12, offset: [0.02, -0.01] },
  { color: palette.sky, rotation: -0.08, offset: [-0.02, 0.02] },
  { color: palette.mint, rotation: 0.05, offset: [0.01, 0.01] },
  { color: palette.cream, rotation: -0.1, offset: [0, -0.02] },
]

export function MagazineStack(props: GroupProps) {
  return (
    <group {...props}>
      {LAYERS.map(({ color, rotation, offset }, i) => (
        <mesh
          key={color}
          position={[offset[0], 0.025 + i * 0.05, offset[1]]}
          rotation={[0, rotation, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.35, 0.05, 0.45]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
