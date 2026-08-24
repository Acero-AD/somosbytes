import { Canvas } from '@react-three/fiber'
import { Experience } from './scene/Experience'
import { useScene } from './state/store'
import { Overlay } from './ui/Overlay'

export default function App() {
  return (
    <div className="app">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.5, 4, 4.5], fov: 45 }}
        // clicks that hit no mesh return to overview (back() no-ops there);
        // ignored mid-flight so stray clicks don't cancel a zoom-in
        onPointerMissed={() => {
          const { isTransitioning, back } = useScene.getState()
          if (!isTransitioning) back()
        }}
      >
        <Experience />
      </Canvas>
      <Overlay />
    </div>
  )
}
