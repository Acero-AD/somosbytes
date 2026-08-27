import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { Box3, Mesh, Vector3 } from 'three'
import { asset } from '../../utils/asset'

type GroupProps = ThreeElements['group']

// Kenney furniture kit models are ~half real-world scale with the origin at
// the front-bottom-left corner. This loader recenters them on x/z (keeping
// y=0 on the floor), enables shadows, and clones so a model can appear twice.
export const KENNEY_SCALE = 2

const MODEL_NAMES = [
  'desk',
  'computerScreen',
  'computerKeyboard',
  'computerMouse',
  'chairDesk',
  'tableCoffee',
  'pottedPlant',
  'plantSmall1',
  'plantSmall2',
  'rugRound',
  'rugDoormat',
  'lampRoundFloor',
  'lampRoundTable',
  'books',
  'bookcaseOpenLow',
  'loungeChair',
  'pillow',
  'coatRackStanding',
  'laptop',
  'sideTable',
] as const

export type KenneyModelName = (typeof MODEL_NAMES)[number]

const url = (name: KenneyModelName) => asset(`/models/${name}.glb`)

MODEL_NAMES.forEach((name) => useGLTF.preload(url(name)))

interface KenneyModelProps extends Omit<GroupProps, 'scale'> {
  model: KenneyModelName
  /** Flat props (rugs) skip the shadow pass — one draw call less per mesh. */
  castShadow?: boolean
  /** Uniform scale override for props that read wrong at kit scale (e.g., the bear). */
  scale?: number
}

export function KenneyModel({ model, castShadow = true, scale = KENNEY_SCALE, ...props }: KenneyModelProps) {
  const { scene } = useGLTF(url(model))
  const object = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = true
      }
    })
    const box = new Box3().setFromObject(cloned)
    const center = box.getCenter(new Vector3())
    cloned.position.set(-center.x, 0, -center.z)
    return cloned
  }, [scene, castShadow])
  return (
    <group {...props} scale={scale}>
      <primitive object={object} />
    </group>
  )
}
