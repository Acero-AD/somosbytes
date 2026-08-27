import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'
import { KenneyModel } from './KenneyModel'

type GroupProps = ThreeElements['group']

// Floor-level reading spot: a cushion, an open book mid-read, a closed one
// waiting, and a notebook with a pen. Everything stays under ~0.2 world
// units tall so the room's sightlines stay open.
export function ReadingNook(props: GroupProps) {
  return (
    <group {...props}>
      <KenneyModel model="rugRounded" position={[0.2, 0.002, 0.2]} scale={1.2} castShadow={false} />
      {/* seat cushion lying flat */}
      <KenneyModel model="pillow" position={[0, 0.12, 0]} rotation={[-Math.PI / 2 + 0.06, 0.3, 0]} castShadow={false} />
      {/* open book: two halves in a shallow V, white pages on top */}
      <group position={[0.42, 0.025, 0.3]} rotation={[0, -0.5, 0]}>
        <mesh position={[-0.077, 0.028, 0]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.16, 0.014, 0.24]} />
          <meshStandardMaterial color={palette.neonPurple} roughness={0.85} />
        </mesh>
        <mesh position={[0.077, 0.028, 0]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.16, 0.014, 0.24]} />
          <meshStandardMaterial color={palette.neonPurple} roughness={0.85} />
        </mesh>
        <mesh position={[-0.072, 0.041, 0]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.14, 0.012, 0.22]} />
          <meshStandardMaterial color={palette.cream} roughness={1} />
        </mesh>
        <mesh position={[0.072, 0.041, 0]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[0.14, 0.012, 0.22]} />
          <meshStandardMaterial color={palette.cream} roughness={1} />
        </mesh>
      </group>
      {/* closed book beside it */}
      <mesh position={[0.5, 0.045, 0.02]} rotation={[0, 0.35, 0]} castShadow={false}>
        <boxGeometry args={[0.17, 0.04, 0.24]} />
        <meshStandardMaterial color={palette.sky} roughness={0.85} />
      </mesh>
      {/* notebook and pen */}
      <mesh position={[-0.05, 0.033, 0.48]} rotation={[0, 0.7, 0]}>
        <boxGeometry args={[0.16, 0.016, 0.22]} />
        <meshStandardMaterial color={palette.cream} roughness={1} />
      </mesh>
      <mesh position={[0.14, 0.037, 0.52]} rotation={[0, 0.25, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
        <meshStandardMaterial color={palette.neonMagenta} roughness={0.4} />
      </mesh>
    </group>
  )
}
