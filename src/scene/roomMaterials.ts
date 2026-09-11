import { useTexture } from '@react-three/drei'
import { NoColorSpace, RepeatWrapping, SRGBColorSpace } from 'three'
import type { Texture } from 'three'
import { asset } from '../utils/asset'

const MAPS = ['wood_floor', 'plastered_wall'].flatMap((name) =>
  ['color', 'normal', 'roughness'].map((map) => asset(`/textures/room/${name}-${map}.jpg`)),
)
MAPS.forEach((url) => useTexture.preload(url))

function configure(textures: Texture | Texture[]) {
  if (!Array.isArray(textures)) return
  textures.forEach((texture, index) => {
    texture.colorSpace = index % 3 === 0 ? SRGBColorSpace : NoColorSpace
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.anisotropy = 4
    texture.needsUpdate = true
  })
}

export function useRoomTextures() { return useTexture(MAPS, configure) }
