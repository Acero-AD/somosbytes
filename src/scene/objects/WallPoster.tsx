import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

interface WallPosterProps extends GroupProps {
  color: string
  width?: number
  height?: number
}

// Framed pastel poster with a simple sun-over-hills motif; the face points
// along +z of the group, so rotate to match the wall it hangs on.
export function WallPoster({ color, width = 0.5, height = 0.65, ...props }: WallPosterProps) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[width + 0.06, height + 0.06, 0.03]} />
        <meshStandardMaterial color={palette.wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[width * 0.15, height * 0.18, 0.018]}>
        <circleGeometry args={[width * 0.14, 24]} />
        <meshStandardMaterial color={palette.cream} roughness={1} />
      </mesh>
      <mesh position={[0, -height * 0.28, 0.018]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[width * 0.42, width * 0.42]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
    </group>
  )
}
