import { create } from 'zustand'
import type { HotspotId } from '../scene/hotspots/hotspots'

export type Mode = 'overview' | 'focused' | 'screen'
export type Mood = 'day' | 'dusk'

const MOOD_KEY = 'mood'

// Hotspots with an interactive surface: arriving promotes focus to `screen`.
const INTERACTIVE_HOTSPOTS: ReadonlySet<HotspotId> = new Set(['pc', 'arcade'])

const readMood = (): Mood => {
  try {
    return localStorage.getItem(MOOD_KEY) === 'day' ? 'day' : 'dusk'
  } catch {
    return 'dusk'
  }
}

interface SceneState {
  mode: Mode
  activeHotspot: HotspotId | null
  isTransitioning: boolean
  mood: Mood
  focus: (id: HotspotId) => void
  back: () => void
  /** Called by the camera rig when a fly-to comes to rest. */
  arrived: () => void
  toggleMood: () => void
}

export const useScene = create<SceneState>((set, get) => ({
  mode: 'overview',
  activeHotspot: null,
  isTransitioning: false,
  mood: readMood(),
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
      mode:
        mode === 'focused' && activeHotspot && INTERACTIVE_HOTSPOTS.has(activeHotspot)
          ? 'screen'
          : mode,
    })
  },
  toggleMood: () => {
    const mood: Mood = get().mood === 'day' ? 'dusk' : 'day'
    try {
      localStorage.setItem(MOOD_KEY, mood)
    } catch {
      /* private mode: the choice lives only for this visit */
    }
    set({ mood })
  },
}))

// Dev/e2e hook: lets browser automation assert the state machine directly.
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__scene = useScene
}
