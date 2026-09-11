import { Html } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useScene } from '../../state/store'
import { ScreenUI } from '../screen/ScreenUI'
import { palette } from '../palette'
import { MonitorHousing } from './MonitorHousing'

type GroupProps = ThreeElements['group']

// Preserve the established display dimensions and backward tilt. The custom
// housing, content planes and HTML transform share this anchor.
export const SCREEN_CENTER_Y = 0.343
export const SCREEN_TILT = -0.14
export const SCREEN_SIZE: [width: number, height: number] = [0.755, 0.465]

// drei Html in transform mode maps CSS px to world units at
// (distanceFactor || 10) / 400 = 1/40; UI renders at 2x px for sharpness.
const SCREEN_UI_PX_WIDTH = 1640
const SCREEN_UI_SCALE = SCREEN_SIZE[0] / (SCREEN_UI_PX_WIDTH / 40)

export function Pc(props: GroupProps) {
  const pcActive = useScene((s) => s.activeHotspot === 'pc')
  return (
    <group {...props}>
      <MonitorHousing centerY={SCREEN_CENTER_Y} tilt={SCREEN_TILT} />
      <mesh position={[0, SCREEN_CENTER_Y, 0.004]} rotation={[SCREEN_TILT, 0, 0]}>
        <planeGeometry args={SCREEN_SIZE} />
        <meshBasicMaterial color={palette.screenGlow} />
      </mesh>
      {pcActive && (
        <Html
          transform
          position={[0, SCREEN_CENTER_Y, 0.008]}
          rotation={[SCREEN_TILT, 0, 0]}
          scale={SCREEN_UI_SCALE}
        >
          <ScreenUI />
        </Html>
      )}
    </group>
  )
}
