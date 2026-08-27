import { Html } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useScene } from '../../state/store'
import { ScreenUI } from '../screen/ScreenUI'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'

type GroupProps = ThreeElements['group']

// Display quad measured from the GLB vertices: it is a TILTED slab leaning
// back 0.14 rad — from (y 0.056, z -0.036) to (y 0.287, z -0.068) pre-
// center/scale, x 0.007..0.386. After centering and x2 scale the quad is
// 0.758 x 0.467 world, centered at y 0.343 / z ~0 in group space.
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
      <KenneyModel model="computerScreen" />
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
