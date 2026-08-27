import type { ThreeElements } from '@react-three/fiber'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

// Open-frame 3D printer: base, portal gantry, bed, extruder, a half-printed
// cube and a neon filament spool. Group origin sits on the surface below.
export function Printer3d(props: GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.44, 0.06, 0.4]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
      </mesh>
      {[-0.19, 0.19].map((x) => (
        <mesh key={x} position={[x, 0.28, -0.08]} castShadow>
          <boxGeometry args={[0.05, 0.44, 0.05]} />
          <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.52, -0.08]}>
        <boxGeometry args={[0.44, 0.06, 0.06]} />
        <meshStandardMaterial color={palette.charcoal} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0.02]}>
        <boxGeometry args={[0.3, 0.02, 0.26]} />
        <meshStandardMaterial color={palette.sky} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, -0.08]}>
        <boxGeometry args={[0.08, 0.1, 0.08]} />
        <meshStandardMaterial color={palette.neonRed} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, 0.02]}>
        <boxGeometry args={[0.09, 0.06, 0.09]} />
        <meshStandardMaterial color={palette.mint} roughness={0.9} />
      </mesh>
      {/* filament spool on the gantry */}
      <mesh position={[0.13, 0.6, -0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
        <meshStandardMaterial color={palette.neonMagenta} roughness={0.6} />
      </mesh>
    </group>
  )
}
