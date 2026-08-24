import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { portfolio } from '../content/portfolio'

interface LoaderProps {
  onSkip: () => void
}

// Full-viewport splash while assets load; also the always-reachable way to
// skip the 3D experience entirely.
export function Loader({ onSkip }: LoaderProps) {
  const { active, progress } = useProgress()
  const [done, setDone] = useState(false)
  const finished = !active && progress === 100

  // Grace fallback: if the loading manager never activates (everything
  // already cached), dismiss anyway.
  useEffect(() => {
    if (active) return
    const timeout = setTimeout(() => setDone(true), finished ? 450 : 2000)
    return () => clearTimeout(timeout)
  }, [active, finished])

  if (done) return null
  return (
    <div className={finished ? 'loader loader-out' : 'loader'}>
      <h1>{portfolio.name}</h1>
      <div className="loader-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <button type="button" className="loader-skip" onClick={onSkip}>
        Skip 3D →
      </button>
    </div>
  )
}
