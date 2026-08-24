import { useEffect } from 'react'
import { useScene } from '../state/store'

// DOM layer over the canvas: back button, Escape handling, and the single
// shared hotspot tooltip (fed by the store instead of per-hotspot <Html>).
export function Overlay() {
  const mode = useScene((s) => s.mode)
  const hoveredLabel = useScene((s) => s.hoveredLabel)
  const back = useScene((s) => s.back)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') back()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [back])

  return (
    <div className="overlay">
      {mode !== 'overview' && (
        <button type="button" className="back-button" onClick={back}>
          ← Back
        </button>
      )}
      {hoveredLabel && <div className="tooltip">{hoveredLabel}</div>}
    </div>
  )
}
