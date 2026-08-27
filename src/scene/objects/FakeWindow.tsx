import { useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useScene } from '../../state/store'
import { palette } from '../palette'

type GroupProps = ThreeElements['group']

const WIDTH = 1.1
const HEIGHT = 1

const STAR_POSITIONS = new Float32Array([
  -0.42, 0.35, 0, 0.05, 0.4, 0, 0.35, 0.22, 0, 0.45, -0.05, 0, -0.1, 0.18, 0, 0.18, -0.3, 0, -0.35, -0.15, 0,
])

// Fake window onto the outside: sun and clouds by day, moon and stars at
// dusk. Pure set dressing (no light comes through); face points along +z.
export function FakeWindow(props: GroupProps) {
  const mood = useScene((s) => s.mood)
  const stars = useMemo(() => STAR_POSITIONS, [])
  return (
    <group {...props}>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial color={mood === 'day' ? palette.sky : palette.duskSky} />
      </mesh>
      <group visible={mood === 'day'}>
        <mesh position={[-0.28, 0.27, 0.008]}>
          <circleGeometry args={[0.13, 24]} />
          <meshBasicMaterial color="#ffe9a8" toneMapped={false} />
        </mesh>
        <mesh position={[0.18, 0.08, 0.008]} scale={[1.7, 0.55, 1]}>
          <circleGeometry args={[0.11, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.08, -0.24, 0.008]} scale={[1.9, 0.5, 1]}>
          <circleGeometry args={[0.09, 20]} />
          <meshBasicMaterial color="#fdf6ec" />
        </mesh>
      </group>
      <group visible={mood === 'dusk'}>
        <mesh position={[-0.26, 0.29, 0.008]}>
          <circleGeometry args={[0.11, 24]} />
          <meshBasicMaterial color="#f3ebd3" toneMapped={false} />
        </mesh>
        {/* offset overlay carves the crescent */}
        <mesh position={[-0.21, 0.33, 0.009]}>
          <circleGeometry args={[0.1, 24]} />
          <meshBasicMaterial color={palette.duskSky} />
        </mesh>
        <points position={[0, 0, 0.008]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.028} color="#ffffff" toneMapped={false} />
        </points>
      </group>
      {/* frame: top/bottom/left/right + cross bars */}
      {[
        { pos: [0, HEIGHT / 2, 0.02] as const, size: [WIDTH + 0.12, 0.08, 0.06] as const },
        { pos: [0, -HEIGHT / 2, 0.02] as const, size: [WIDTH + 0.12, 0.08, 0.06] as const },
        { pos: [-WIDTH / 2, 0, 0.02] as const, size: [0.08, HEIGHT + 0.12, 0.06] as const },
        { pos: [WIDTH / 2, 0, 0.02] as const, size: [0.08, HEIGHT + 0.12, 0.06] as const },
        { pos: [0, 0, 0.015] as const, size: [WIDTH, 0.05, 0.04] as const },
        { pos: [0, 0, 0.015] as const, size: [0.05, HEIGHT, 0.04] as const },
      ].map(({ pos, size }, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <boxGeometry args={[size[0], size[1], size[2]]} />
          <meshStandardMaterial color={palette.cream} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}
