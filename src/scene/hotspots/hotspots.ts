export interface CameraPose {
  position: [number, number, number]
  target: [number, number, number]
}

export interface HotspotDef {
  label: string
  pose: CameraPose
  /** Anchor of the floating label chip, relative to the hotspot group origin. */
  labelOffset: [number, number, number]
}

// Camera poses are data: tune them with the dev-only pose logger in
// CameraRig (orbit, frame the shot, press "p", paste here).
export const OVERVIEW_POSE: CameraPose = {
  position: [3.9, 3.1, 4.1],
  target: [-0.45, 0.75, -0.45],
}

export const HOTSPOTS = {
  pc: {
    label: 'Projects',
    pose: { position: [0, 1.11, -1.45], target: [0, 1.11, -2.51] },
    labelOffset: [0, 0.78, 0],
  },
  magazines: {
    label: 'Writing',
    pose: { position: [-0.75, 1.35, 1.8], target: [-1.75, 0.4, 0.75] },
    labelOffset: [0, 0.95, 0],
  },
  cvFrame: {
    label: 'CV',
    pose: { position: [-1.45, 1.62, -1], target: [-2.87, 1.58, -1] },
    labelOffset: [0, 0.55, 0],
  },
  phone: {
    label: 'Contact',
    pose: { position: [0.95, 1.85, -1.45], target: [0.55, 0.78, -2.25] },
    // pushed right/front so the chip clears the monitor on narrow viewports
    labelOffset: [0.3, 0.28, 0.25],
  },
} as const satisfies Record<string, HotspotDef>

export type HotspotId = keyof typeof HOTSPOTS
