import { create } from 'zustand'
import type { HotspotId } from '../scene/hotspots/hotspots'

export type Mode = 'overview' | 'focused' | 'screen'

interface SceneState {
  mode: Mode
  activeHotspot: HotspotId | null
  isTransitioning: boolean
  focus: (id: HotspotId) => void
  back: () => void
  /** Called by the camera rig when a fly-to comes to rest. */
  arrived: () => void
}

export const useScene = create<SceneState>((set, get) => ({
  mode: 'overview',
  activeHotspot: null,
  isTransitioning: false,
  focus: (id) => {
    const { mode, isTransitioning } = get()
    if (mode !== 'overview' || isTransitioning) return
    set({ mode: 'focused', activeHotspot: id, isTransitioning: true })
  },
  back: () => {
    if (get().mode === 'overview') return
    set({ mode: 'overview', activeHotspot: null, isTransitioning: true })
  },
  arrived: () => {
    const { mode, activeHotspot } = get()
    set({
      isTransitioning: false,
      // reaching the PC promotes focus to the interactive screen
      mode: mode === 'focused' && activeHotspot === 'pc' ? 'screen' : mode,
    })
  },
}))

// Dev/e2e hook: lets browser automation assert the state machine directly.
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__scene = useScene
}
