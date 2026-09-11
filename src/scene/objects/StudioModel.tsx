import { useEffect, useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { Box3, Mesh, MeshStandardMaterial, RepeatWrapping, Vector3 } from 'three'
import type { Texture } from 'three'
import { asset } from '../../utils/asset'
import { MODELS, studioUrl, NO_DECODERS } from '../studioAssets'
import type { ModelName } from '../studioAssets'
import { useRoomTextures } from '../roomMaterials'

const FABRIC_MAPS = ['normal', 'roughness'].map(map => asset(`/textures/furniture/fabric_pattern_07-${map}.jpg`))
function configureFabric(maps: Texture | Texture[]) {
  if (!Array.isArray(maps)) return
  maps.forEach(map => {
    map.wrapS = map.wrapT = RepeatWrapping
    map.repeat.set(2, 2)
    map.anisotropy = 4
    map.needsUpdate = true
  })
}

interface StudioModelProps extends Omit<ThreeElements['group'], 'scale'> {
  model: ModelName
  scale?: number
  castShadow?: boolean
  tint?: Record<string, string>
  /** Replace a material's base color while retaining its normal/roughness maps. */
  solidColors?: Record<string, string>
}

export function StudioModel({ model, scale, castShadow = true, tint, solidColors, ...props }: StudioModelProps) {
  const { scene } = useGLTF(studioUrl(model), ...NO_DECODERS)
  const [oak] = useRoomTextures()
  const [fabricNormal, fabricRoughness] = useTexture(FABRIC_MAPS, configureFabric)
  const prepared = useMemo(() => {
    const owned: MeshStandardMaterial[] = []
    const cloned = scene.clone(true)
    cloned.traverse(child => {
      if (!(child instanceof Mesh)) return
      child.castShadow = castShadow
      child.receiveShadow = true
      const adjust = (material: MeshStandardMaterial) => {
        const solidColor = solidColors?.[material.name]
        const color = solidColor ?? tint?.[material.name]
        const fabric = material.name === 'fabric' || material.name === 'linen'
        if (material.name !== 'oak' && !fabric && !color) return material
        const copy = material.clone()
        owned.push(copy)
        if (material.name === 'oak') {
          copy.map = oak
          copy.color.set('#ffffff')
        }
        if (fabric) {
          copy.normalMap = fabricNormal
          copy.normalScale.set(0.2, 0.2)
          copy.roughnessMap = fabricRoughness
        }
        if (color) copy.color.set(color)
        if (solidColor) copy.map = null
        return copy
      }
      child.material = Array.isArray(child.material) ? child.material.map(adjust) : adjust(child.material)
    })
    const bounds = new Box3().setFromObject(cloned)
    const center = bounds.getCenter(new Vector3())
    // Source assets have different origins. Normalize all to floor/support y=0.
    cloned.position.set(-center.x, -bounds.min.y, -center.z)
    return { cloned, owned }
  }, [scene, castShadow, tint, solidColors, oak, fabricNormal, fabricRoughness])
  useEffect(() => () => prepared.owned.forEach(material => material.dispose()), [prepared])
  return <group {...props} scale={scale ?? MODELS[model].scale}><primitive object={prepared.cloned} /></group>
}
