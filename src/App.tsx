import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { FallbackPage } from './fallback/FallbackPage'
import { Experience } from './scene/Experience'
import { useScene } from './state/store'
import { Loader } from './ui/Loader'
import { Overlay } from './ui/Overlay'
import { isWebGLAvailable } from './utils/webgl'

const SKIP_KEY = 'skip3d'

const readSkip = () => {
  try {
    return localStorage.getItem(SKIP_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const webgl = useMemo(isWebGLAvailable, [])
  const forcedOff = useMemo(() => new URLSearchParams(location.search).has('no3d'), [])
  const [skipped, setSkipped] = useState(readSkip)
  const [contextLost, setContextLost] = useState(false)
  const show3d = webgl && !forcedOff && !skipped && !contextLost

  const skip = () => {
    try {
      localStorage.setItem(SKIP_KEY, '1')
    } catch {
      /* private mode: skip lives only for this visit */
    }
    setSkipped(true)
  }

  const enter3d = () => {
    try {
      localStorage.removeItem(SKIP_KEY)
    } catch {
      /* nothing persisted */
    }
    if (forcedOff) {
      const url = new URL(location.href)
      url.searchParams.delete('no3d')
      location.href = url.toString()
      return
    }
    if (contextLost) {
      location.reload()
      return
    }
    setSkipped(false)
  }

  return (
    <>
      {show3d && (
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
                setContextLost(true)
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
          <Overlay onSkip={skip} />
          <Loader onSkip={skip} />
        </div>
      )}
      <FallbackPage active={!show3d} contextLost={contextLost} onEnter3d={webgl ? enter3d : undefined} />
    </>
  )
}
