import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

export const DESK_TOP_Y = 0.75

// Not a hotspot itself — it carries the PC and the phone.
export function Desk(props: GroupProps) {
  const legX = 0.9
  const legZ = 0.35
  return (
    <group {...props}>
      <mesh position={[0, DESK_TOP_Y - 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.08, 0.9]} />
        <meshStandardMaterial color={palette.wood} roughness={0.9} />
      </mesh>
      {[
        [-legX, legZ],
        [legX, legZ],
        [-legX, -legZ],
        [legX, -legZ],
      ].map(([x, z]) => (
        <mesh key={`${x},${z}`} position={[x, (DESK_TOP_Y - 0.08) / 2, z]} castShadow>
          <boxGeometry args={[0.06, DESK_TOP_Y - 0.08, 0.06]} />
          <meshStandardMaterial color={palette.wood} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
