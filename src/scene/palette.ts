// Shared palette — every material in the scene derives from these colors so
// mixed-source assets read as one coherent set (design D6).
export const palette = {
  background: '#efe6da',
  wall: '#f5ede3',
  floor: '#c69b7b',
  wood: '#9a7550',
  mint: '#a8d8c9',
  blush: '#f2b8c6',
  sky: '#a5c9e8',
  cream: '#fbf6ee',
  charcoal: '#3f3a35',
  screenGlow: '#dff1ff',
  // brand accents, sampled from the logo artwork
  neonMagenta: '#e0218a',
  neonPurple: '#8b2fc9',
  neonRed: '#e8355a',
  // environment
  platform: '#84644a',
  duskBackground: '#2b2136',
  duskSky: '#252048',
} as const
