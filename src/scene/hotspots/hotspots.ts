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
  position: [4.2, 3.6, 4.4],
  target: [-0.4, 0.9, -0.4],
}

export const HOTSPOTS = {
  pc: {
    label: 'Projects',
    pose: { position: [0, 1.17, -1.5], target: [0, 1.17, -2.55] },
  },
  magazines: {
    label: 'Writing',
    pose: { position: [-0.9, 1.5, 1.7], target: [-1.9, 0.15, 0.7] },
  },
  cvFrame: {
    label: 'CV',
    pose: { position: [-1.7, 1.5, -1], target: [-2.87, 1.5, -1] },
  },
  phone: {
    label: 'Contact',
    pose: { position: [0.75, 1.6, -1.55], target: [0.75, 0.77, -2.35] },
  },
} as const satisfies Record<string, HotspotDef>

export type HotspotId = keyof typeof HOTSPOTS
