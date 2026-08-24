import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

// Framed document hanging on a wall; the face points along +z of the group,
// so rotate the group to match the wall it hangs on.
export function CvFrame(props: GroupProps) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.7, 0.04]} />
        <meshStandardMaterial color={palette.wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[0.42, 0.62]} />
        <meshStandardMaterial color={palette.cream} roughness={1} />
      </mesh>
      {/* fake text lines */}
      {[0.2, 0.1, 0, -0.1, -0.2].map((y, i) => (
        <mesh key={y} position={[i % 2 === 0 ? -0.02 : 0.02, y, 0.022]}>
          <planeGeometry args={[i === 0 ? 0.2 : 0.3, 0.025]} />
          <meshStandardMaterial color={palette.charcoal} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
