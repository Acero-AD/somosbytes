import { Html } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useScene } from '../../state/store'
import { ScreenUI } from '../screen/ScreenUI'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'

type GroupProps = ThreeElements['group']

// Display geometry measured from the GLB's glass vertices (x 0..0.393,
// y 0.092..0.294, glass surface z=-0.062 pre-center/scale): the glass is
// recessed behind the bezel rim (the chin below sticks out in front and
// occludes anything lower), so the overlay covers exactly that rect.
export const SCREEN_CENTER_Y = 0.386
export const SCREEN_SIZE: [width: number, height: number] = [0.78, 0.4]
const SCREEN_FACE_Z = -0.015

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
        <Html transform position={[0, SCREEN_CENTER_Y, SCREEN_FACE_Z + 0.004]} scale={SCREEN_UI_SCALE}>
          <ScreenUI />
        </Html>
      )}
    </group>
  )
}
