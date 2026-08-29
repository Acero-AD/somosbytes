import { useEffect, useState } from 'react'
import { portfolio } from '../content/portfolio'
import type { HotspotId } from '../scene/hotspots/hotspots'
import { snakeEngine } from '../scene/objects/snake/engine'
import type { Direction } from '../scene/objects/snake/engine'
import { useScene } from '../state/store'
import { asset } from '../utils/asset'

const DPAD: { direction: Direction; glyph: string; className: string; label: string }[] = [
  { direction: 'up', glyph: '▲', className: 'dpad-up', label: 'Up' },
  { direction: 'left', glyph: '◀', className: 'dpad-left', label: 'Left' },
  { direction: 'down', glyph: '▼', className: 'dpad-down', label: 'Down' },
  { direction: 'right', glyph: '▶', className: 'dpad-right', label: 'Right' },
]

interface CardContent {
  title: string
  text: string
  links: { label: string; url: string }[]
}

// Card content for the non-PC hotspots; URLs come from the content module.
function cardFor(id: HotspotId): CardContent | null {
  switch (id) {
    case 'magazines':
      return {
        title: 'Writing',
        text: 'Notes and essays about software.',
        links: [{ label: 'Read the Substack ↗', url: portfolio.substackUrl }],
      }
    case 'cvFrame':
      return {
        title: 'CV',
        text: 'The full story, on one page.',
        links: [{ label: 'Open the CV (PDF) ↗', url: asset(portfolio.cvPdfPath) }],
      }
    case 'phone':
      return {
        title: 'Contact',
        text: 'Say hi:',
        links: portfolio.socials.map((s) => ({ label: `${s.label} ↗`, url: s.url })),
      }
    default:
      return null
  }
}

interface OverlayProps {
  /** Switches to the classic (fallback) view; offered persistently in overview. */
  onSkip: () => void
}

// DOM layer over the canvas: back button, Escape handling, the single shared
// hotspot tooltip (fed by the store instead of per-hotspot <Html>), the
// focused-content card for non-PC hotspots, and the persistent skip link.
export function Overlay({ onSkip }: OverlayProps) {
  const mode = useScene((s) => s.mode)
  const activeHotspot = useScene((s) => s.activeHotspot)
  const isTransitioning = useScene((s) => s.isTransitioning)
  const back = useScene((s) => s.back)
  const mood = useScene((s) => s.mood)
  const toggleMood = useScene((s) => s.toggleMood)
  const card = mode === 'focused' && !isTransitioning && activeHotspot ? cardFor(activeHotspot) : null

  // touch devices get a d-pad while the arcade screen is the focused surface
  const [coarsePointer, setCoarsePointer] = useState(false)
  useEffect(() => {
    const query = matchMedia('(pointer: coarse)')
    const update = () => setCoarsePointer(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  const showDpad = coarsePointer && mode === 'screen' && activeHotspot === 'arcade'

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') back()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [back])

  return (
    <div className={mood === 'dusk' ? 'overlay overlay-dusk' : 'overlay'}>
      {mode !== 'overview' && (
        <button type="button" className="back-button" onClick={back}>
          ← Back
        </button>
      )}
      {mode === 'overview' && (
        <button type="button" className="skip-link" onClick={onSkip}>
          Skip 3D →
        </button>
      )}
      <button
        type="button"
        className="mood-toggle"
        onClick={toggleMood}
        aria-label={mood === 'day' ? 'Switch to dusk' : 'Switch to day'}
      >
        {mood === 'day' ? '🌙' : '☀️'}
      </button>
      {showDpad && (
        <div className="dpad">
          {DPAD.map(({ direction, glyph, className, label }) => (
            <button
              key={direction}
              type="button"
              className={className}
              aria-label={label}
              onPointerDown={(e) => {
                // keep the tap out of the 3D scene behind the control
                e.stopPropagation()
                e.preventDefault()
                snakeEngine.input(direction)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {glyph}
            </button>
          ))}
        </div>
      )}
      {card && (
        <div className="focus-card">
          <h2>{card.title}</h2>
          <p>{card.text}</p>
          <div className="focus-card-links">
            {card.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
