import { Suspense, lazy, useMemo, useState } from 'react'
import { FallbackPage } from './fallback/FallbackPage'
import { portfolio } from './content/portfolio'
import { isWebGLAvailable } from './utils/webgl'

// Keeps three.js out of the initial bundle; fallback visitors never load it.
const Scene3DApp = lazy(() => import('./Scene3DApp'))

const SKIP_KEY = 'skip3d'

const readSkip = () => {
  try {
    return localStorage.getItem(SKIP_KEY) === '1'
  } catch {
    return false
  }
}

// Shown while the 3D chunk itself downloads; the drei-based Loader inside it
// takes over (same styling) once the chunk arrives.
function Splash({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="loader">
      <h1>{portfolio.name}</h1>
      <div className="loader-bar">
        <div style={{ width: '10%' }} />
      </div>
      <button type="button" className="loader-skip" onClick={onSkip}>
        Skip 3D →
      </button>
    </div>
  )
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
        <Suspense fallback={<Splash onSkip={skip} />}>
          <Scene3DApp onSkip={skip} onContextLost={() => setContextLost(true)} />
        </Suspense>
      )}
      <FallbackPage active={!show3d} contextLost={contextLost} onEnter3d={webgl ? enter3d : undefined} />
    </>
  )
}
