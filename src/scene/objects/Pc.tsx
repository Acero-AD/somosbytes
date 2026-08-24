import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

// Screen center height above the group origin (which sits on the desk top).
export const SCREEN_CENTER_Y = 0.42
export const SCREEN_SIZE: [width: number, height: number] = [0.82, 0.47]

// Gray-box monitor: stand + body + screen plane. The group origin sits on
// the desk top; the screen faces +z.
export function Pc(props: GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.25, 0.1, 0.18]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
      </mesh>
      <mesh position={[0, SCREEN_CENTER_Y, -0.02]} castShadow>
        <boxGeometry args={[0.92, 0.57, 0.05]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
      </mesh>
      <mesh position={[0, SCREEN_CENTER_Y, 0.006]}>
        <planeGeometry args={SCREEN_SIZE} />
        <meshBasicMaterial color={palette.screenGlow} />
      </mesh>
    </group>
  )
}
