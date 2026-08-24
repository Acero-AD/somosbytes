import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './scene/Experience'
import { useScene } from './state/store'
import { Loader } from './ui/Loader'
import { Overlay } from './ui/Overlay'

interface Scene3DAppProps {
  onSkip: () => void
  onContextLost: () => void
}

// The whole three.js world lives in this lazy chunk — the app shell (gate,
// splash, fallback) stays light so first paint never waits for three.
export default function Scene3DApp({ onSkip, onContextLost }: Scene3DAppProps) {
  return (
    <div className="app">
      <Canvas
        shadows
        dpr={[1, 2]}
        // static scene: render only when something invalidates (camera
        // transitions via CameraControls, hover pulses via Hotspot)
        frameloop="demand"
        camera={{ position: [4.5, 4, 4.5], fov: 45 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            onContextLost()
          })
        }}
        // clicks that hit no mesh return to overview (back() no-ops there);
        // ignored mid-flight so stray clicks don't cancel a zoom-in
        onPointerMissed={() => {
          const { isTransitioning, back } = useScene.getState()
          if (!isTransitioning) back()
        }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Overlay onSkip={onSkip} />
      <Loader onSkip={onSkip} />
    </div>
  )
}
