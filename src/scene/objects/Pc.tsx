import { Html } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useScene } from '../../state/store'
import { ScreenUI } from '../screen/ScreenUI'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'

type GroupProps = ThreeElements['group']

// Display center height above the group origin (which sits on the desk top).
// The Kenney computerScreen model has no separate screen-face mesh, so our
// emissive plane (and the Html desktop) sits just in front of its bezel.
export const SCREEN_CENTER_Y = 0.34
export const SCREEN_SIZE: [width: number, height: number] = [0.62, 0.36]
const SCREEN_FACE_Z = 0.115

// drei Html in transform mode maps CSS px to world units at
// (distanceFactor || 10) / 400 = 1/40; UI renders at 2x px for sharpness.
const SCREEN_UI_PX_WIDTH = 1640
const SCREEN_UI_SCALE = SCREEN_SIZE[0] / (SCREEN_UI_PX_WIDTH / 40)

export function Pc(props: GroupProps) {
  const pcActive = useScene((s) => s.activeHotspot === 'pc')
  return (
    <group {...props}>
      <KenneyModel model="computerScreen" />
      <mesh position={[0, SCREEN_CENTER_Y, SCREEN_FACE_Z]}>
        <planeGeometry args={SCREEN_SIZE} />
        <meshBasicMaterial color={palette.screenGlow} />
      </mesh>
      {pcActive && (
        <Html transform position={[0, SCREEN_CENTER_Y, SCREEN_FACE_Z + 0.006]} scale={SCREEN_UI_SCALE}>
          <ScreenUI />
        </Html>
      )}
    </group>
  )
}
