import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

// Phone lying flat; group origin sits on the surface it rests on.
export function Phone(props: GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, 0.011, 0]} castShadow>
        <boxGeometry args={[0.18, 0.022, 0.36]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.155, 0.33]} />
        <meshBasicMaterial color={palette.screenGlow} />
      </mesh>
    </group>
  )
}
