import type { ThreeElements } from '@react-three/fiber'

type MeshProps = ThreeElements['mesh']

interface LedStripProps extends MeshProps {
  length: number
  color: string
}

// Static emissive bar — untonemapped so it reads as a light source; no
// animation, so the idle scene keeps rendering zero frames (design D4).
export function LedStrip({ length, color, ...props }: LedStripProps) {
  return (
    <mesh {...props}>
      <boxGeometry args={[length, 0.03, 0.03]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}
