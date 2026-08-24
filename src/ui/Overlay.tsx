import { useEffect } from 'react'
import { portfolio } from '../content/portfolio'
import type { HotspotId } from '../scene/hotspots/hotspots'
import { useScene } from '../state/store'
import { asset } from '../utils/asset'

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
  const hoveredLabel = useScene((s) => s.hoveredLabel)
  const activeHotspot = useScene((s) => s.activeHotspot)
  const isTransitioning = useScene((s) => s.isTransitioning)
  const back = useScene((s) => s.back)
  const card = mode === 'focused' && !isTransitioning && activeHotspot ? cardFor(activeHotspot) : null

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
      {mode === 'overview' && (
        <button type="button" className="skip-link" onClick={onSkip}>
          Skip 3D →
        </button>
      )}
      {hoveredLabel && <div className="tooltip">{hoveredLabel}</div>}
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
