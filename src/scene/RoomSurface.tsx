import { useEffect, useMemo } from 'react'
import { BoxGeometry } from 'three'
import { useRoomTextures } from './roomMaterials'

export function RoomSurface({ size, position, finish }: {
  size: [number, number, number]
  position: [number, number, number]
  finish: 'wood' | 'plaster'
}) {
  const maps = useRoomTextures()
  const [width, height, depth] = size
  const span = finish === 'wood' ? 1.7 : 2
  // Face UVs are measured in world units, including thin edges. Texture scale
  // remains consistent across the floor and differently proportioned walls.
  const geometry = useMemo(() => {
    const box = new BoxGeometry(width, height, depth)
    const positions = box.getAttribute('position')
    const normals = box.getAttribute('normal')
    const uv = box.getAttribute('uv')
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i)
      if (Math.abs(normals.getY(i)) > 0.5) uv.setXY(i, (x + width / 2) / span, (z + depth / 2) / span)
      else if (Math.abs(normals.getX(i)) > 0.5) uv.setXY(i, (z + depth / 2) / span, (y + height / 2) / span)
      else uv.setXY(i, (x + width / 2) / span, (y + height / 2) / span)
    }
    return box
  }, [width, height, depth, span])
  useEffect(() => () => geometry.dispose(), [geometry])
  const start = finish === 'wood' ? 0 : 3
  return (
    <mesh position={position} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        map={maps[start]}
        normalMap={maps[start + 1]}
        roughnessMap={maps[start + 2]}
        roughness={1}
        normalScale={finish === 'wood' ? [0.35, 0.35] : [0.18, 0.18]}
      />
    </mesh>
  )
}
