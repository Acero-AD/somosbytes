import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { useScene } from '../../state/store'
import { HOTSPOTS } from './hotspots'
import type { HotspotId } from './hotspots'

interface HotspotLabelProps {
  id: HotspotId
}

// Floating chip naming the section, anchored above the hotspot. Pure DOM:
// the entrance/exit animation is a CSS transition, so the idle canvas keeps
// rendering zero frames (design D4).
export function HotspotLabel({ id }: HotspotLabelProps) {
  const inOverview = useScene((s) => s.mode === 'overview' && !s.isTransitioning)
  const focus = useScene((s) => s.focus)
  const { label, labelOffset } = HOTSPOTS[id]
  // Starts hidden and flips on mount so the rise-and-settle plays on load too.
  const [entered, setEntered] = useState(false)
  useEffect(() => setEntered(true), [])
  const visible = entered && inOverview

  return (
    <Html position={labelOffset} center zIndexRange={[40, 0]}>
      <button
        type="button"
        className={visible ? 'hotspot-label' : 'hotspot-label hotspot-label-hidden'}
        tabIndex={visible ? 0 : -1}
        // stop DOM events from bubbling into R3F raycasting (ScreenUI lesson)
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          focus(id)
        }}
      >
        {label}
      </button>
    </Html>
  )
}
