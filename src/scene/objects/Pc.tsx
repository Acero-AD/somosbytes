import { Html } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useScene } from '../../state/store'
import { ScreenUI } from '../screen/ScreenUI'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

// Screen center height above the group origin (which sits on the desk top).
export const SCREEN_CENTER_Y = 0.42
export const SCREEN_SIZE: [width: number, height: number] = [0.82, 0.47]

// ScreenUI renders at 2x CSS pixels (sharper on mobile Safari) and is scaled
// down so the div exactly covers the screen plane. drei Html in transform
// mode maps CSS px to world units at (distanceFactor || 10) / 400 = 1/40.
const SCREEN_UI_PX_WIDTH = 1640
const SCREEN_UI_SCALE = SCREEN_SIZE[0] / (SCREEN_UI_PX_WIDTH / 40)

// Gray-box monitor: stand + body + screen plane. The group origin sits on
// the desk top; the screen faces +z. While the PC is the active hotspot the
// interactive desktop DOM is mounted on the screen plane (design D4).
export function Pc(props: GroupProps) {
  const pcActive = useScene((s) => s.activeHotspot === 'pc')
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
      {pcActive && (
        <Html transform position={[0, SCREEN_CENTER_Y, 0.012]} scale={SCREEN_UI_SCALE}>
          <ScreenUI />
        </Html>
      )}
    </group>
  )
}
