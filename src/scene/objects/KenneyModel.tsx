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
  'plantSmall2',
  'rugRound',
  'lampRoundFloor',
  'books',
  'bookcaseOpenLow',
] as const

export type KenneyModelName = (typeof MODEL_NAMES)[number]

const url = (name: KenneyModelName) => asset(`/models/${name}.glb`)

MODEL_NAMES.forEach((name) => useGLTF.preload(url(name)))

interface KenneyModelProps extends GroupProps {
  model: KenneyModelName
}

export function KenneyModel({ model, ...props }: KenneyModelProps) {
  const { scene } = useGLTF(url(model))
  const object = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    const box = new Box3().setFromObject(cloned)
    const center = box.getCenter(new Vector3())
    cloned.position.set(-center.x, 0, -center.z)
    return cloned
  }, [scene])
  return (
    <group {...props} scale={KENNEY_SCALE}>
      <primitive object={object} />
    </group>
  )
}
