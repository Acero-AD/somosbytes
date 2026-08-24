import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

// Temporary smoke-test scene; replaced by the room experience in M1.
function SpinningCube() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.6
    ref.current.rotation.y += delta
  })
  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color="#a8d8c9" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [2.5, 2, 2.5], fov: 45 }}>
      <color attach="background" args={['#f5ede3']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <SpinningCube />
    </Canvas>
  )
}
