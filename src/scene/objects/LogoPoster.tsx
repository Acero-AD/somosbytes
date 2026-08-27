import { useTexture } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { SRGBColorSpace } from 'three'
import type { Texture } from 'three'
import { asset } from '../../utils/asset'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

const LOGO_URL = asset('/branding/logo.jpg')
useTexture.preload(LOGO_URL)

// The logo JPEG is a circular artwork centered in a square image; circle
// geometry UVs map exactly that inscribed circle, so the corners never
// render and no alpha channel is needed (design D1). Unlit + untonemapped
// so it reads as a lit neon sign.
export function LogoPoster({ radius = 0.42, ...props }: GroupProps & { radius?: number }) {
  const texture = useTexture(LOGO_URL, (t: Texture) => {
    t.colorSpace = SRGBColorSpace
  })
  return (
    <group {...props}>
      <mesh position={[0, 0, 0.004]}>
        <ringGeometry args={[radius * 0.97, radius * 1.12, 48]} />
        <meshBasicMaterial color={palette.neonMagenta} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[radius, 48]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
