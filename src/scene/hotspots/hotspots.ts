export interface CameraPose {
  position: [number, number, number]
  target: [number, number, number]
}

export interface HotspotDef {
  label: string
  pose: CameraPose
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
  },
  magazines: {
    label: 'Writing',
    pose: { position: [-0.75, 1.35, 1.8], target: [-1.75, 0.4, 0.75] },
  },
  cvFrame: {
    label: 'CV',
    pose: { position: [-1.7, 1.5, -1], target: [-2.87, 1.5, -1] },
  },
  phone: {
    label: 'Contact',
    pose: { position: [0.58, 1.55, -1.45], target: [0.58, 0.79, -2.22] },
  },
} as const satisfies Record<string, HotspotDef>

export type HotspotId = keyof typeof HOTSPOTS
