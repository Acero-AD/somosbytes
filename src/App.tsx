import { Canvas } from '@react-three/fiber'
import { Experience } from './scene/Experience'

export default function App() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [4.5, 4, 4.5], fov: 45 }}>
      <Experience />
    </Canvas>
  )
}
