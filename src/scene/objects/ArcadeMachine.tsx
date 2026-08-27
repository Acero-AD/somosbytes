import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

// Upright arcade cabinet with emissive brand-color screen and marquee; the
// front faces +z of the group. Pure decor (design D7).
export function ArcadeMachine(props: GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.55, 1.5, 0.5]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.7} />
      </mesh>
      {/* marquee */}
      <mesh position={[0, 1.57, 0]} castShadow>
        <boxGeometry args={[0.57, 0.16, 0.52]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.57, 0.262]}>
        <planeGeometry args={[0.5, 0.11]} />
        <meshBasicMaterial color={palette.neonMagenta} toneMapped={false} />
      </mesh>
      {/* screen with a tiny pixel game */}
      <mesh position={[0, 1.14, 0.251]}>
        <planeGeometry args={[0.44, 0.34]} />
        <meshBasicMaterial color="#12081c" />
      </mesh>
      {[
        { pos: [-0.1, 1.22] as const, color: palette.neonPurple },
        { pos: [0.02, 1.16] as const, color: palette.neonRed },
        { pos: [0.12, 1.22] as const, color: palette.neonPurple },
        { pos: [-0.02, 1.05] as const, color: '#3ddc84' },
      ].map(({ pos, color }, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0.253]}>
          <planeGeometry args={[0.05, 0.05]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
      {/* control deck */}
      <mesh position={[0, 0.92, 0.3]} rotation={[-0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.26]} />
        <meshStandardMaterial color={palette.wood} roughness={0.8} />
      </mesh>
      {[
        { x: -0.1, color: palette.neonMagenta },
        { x: 0.02, color: palette.neonPurple },
      ].map(({ x, color }) => (
        <mesh key={x} position={[x, 0.97, 0.33]} rotation={[-0.35, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
      {/* joystick */}
      <mesh position={[-0.18, 1, 0.31]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshStandardMaterial color={palette.cream} roughness={0.5} />
      </mesh>
    </group>
  )
}
