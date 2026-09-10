import { useGLTF } from '@react-three/drei'
import { asset } from '../utils/asset'

export const MODELS = {
  desk: { file: 'desk', scale: 1, supportHeight: 0.77 },
  officeChair: { file: 'officeChair', scale: 1, supportHeight: 0.505 },
  coffeeTable: { file: 'coffeeTable', scale: 1, supportHeight: 0.46 },
  sideTable: { file: 'sideTable', scale: 1, supportHeight: 0.77 },
  shelf: { file: 'shelf', scale: 1, supportHeight: 0.8 },
  lounge: { file: 'modern_arm_chair_01', scale: 1, supportHeight: 0 },
  plant: { file: 'potted_plant_02', scale: 1, supportHeight: 0 },
  cushion: { file: 'cushion', scale: 1, supportHeight: 0.14 },
  rug: { file: 'rug', scale: 1, supportHeight: 0.012 },
  coatRack: { file: 'coatRack', scale: 1, supportHeight: 0 },
} as const
export type ModelName = keyof typeof MODELS
export const studioUrl = (name: ModelName) => asset(`/models/realistic/${MODELS[name].file}.glb`)
export const NO_DECODERS = [false, false] as const
// Only preload the models actually included in the current scene.
export function preloadStudioModels(names: ModelName[]) {
  names.forEach(name => useGLTF.preload(studioUrl(name), ...NO_DECODERS))
}

