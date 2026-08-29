import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'
import { ArcadeScreen } from './snake/ArcadeScreen'

type GroupProps = ThreeElements['group']

// Upright arcade cabinet with emissive brand-color marquee; the front faces
// +z of the group. The screen is a live CanvasTexture surface running the
// snake minigame (attract mode while idle).
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
      <ArcadeScreen />
      {/* control deck: slopes down toward the player, everything rides it */}
      <group position={[0, 0.92, 0.3]} rotation={[0.35, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.06, 0.26]} />
          <meshStandardMaterial color={palette.wood} roughness={0.8} />
        </mesh>
        {[
          { x: -0.05, color: palette.neonMagenta },
          { x: 0.07, color: palette.neonPurple },
        ].map(({ x, color }) => (
          <mesh key={x} position={[x, 0.04, 0.03]}>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[-0.16, 0.06, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
          <meshStandardMaterial color={palette.cream} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}
