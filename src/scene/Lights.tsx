import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { Color, MathUtils } from 'three'
import type { AmbientLight, DirectionalLight, HemisphereLight, PointLight } from 'three'
import { useScene } from '../state/store'
import { palette } from './palette'

const MOODS = {
  day: {
    ambient: 0.3,
    hemi: 0.55,
    dir: 1.8,
    dirColor: '#ffedd8',
    magenta: 3.5,
    purple: 2.5,
    backdrop: palette.background,
  },
  dusk: {
    ambient: 0.16,
    hemi: 0.22,
    dir: 0.55,
    dirColor: '#a9a0e0',
    magenta: 7,
    purple: 5.5,
    backdrop: palette.duskBackground,
  },
} as const

export function Lights() {
  const mood = useScene((s) => s.mood)
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)
  const ambientRef = useRef<AmbientLight>(null)
  const hemiRef = useRef<HemisphereLight>(null)
  const dirRef = useRef<DirectionalLight>(null)
  const magentaRef = useRef<PointLight>(null)
  const purpleRef = useRef<PointLight>(null)
  const scratch = useMemo(() => new Color(), [])

  // kick the demand frameloop when the mood flips; the lerp below keeps
  // invalidating until everything settles
  useEffect(() => invalidate(), [mood, invalidate])

  useFrame((_, delta) => {
    const target = MOODS[mood]
    const k = 1 - Math.exp(-4 * delta)
    let drift = 0
    const dampIntensity = (light: { intensity: number } | null, to: number) => {
      if (!light) return
      light.intensity = MathUtils.damp(light.intensity, to, 4, delta)
      drift = Math.max(drift, Math.abs(light.intensity - to))
    }
    const dampColor = (color: Color, to: string) => {
      scratch.set(to)
      color.lerp(scratch, k)
      drift = Math.max(
        drift,
        Math.abs(color.r - scratch.r) + Math.abs(color.g - scratch.g) + Math.abs(color.b - scratch.b),
      )
    }
    dampIntensity(ambientRef.current, target.ambient)
    dampIntensity(hemiRef.current, target.hemi)
    dampIntensity(dirRef.current, target.dir)
    dampIntensity(magentaRef.current, target.magenta)
    dampIntensity(purpleRef.current, target.purple)
    if (dirRef.current) dampColor(dirRef.current.color, target.dirColor)
    if (scene.background instanceof Color) dampColor(scene.background, target.backdrop)
    if (scene.fog) dampColor(scene.fog.color, target.backdrop)
    if (drift > 0.01) invalidate()
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.3} color="#fff4e6" />
      {/* warm sky + floor-bounce fill keeps the walls from going gray */}
      <hemisphereLight ref={hemiRef} args={['#fff6ea', '#d8b99a', 0.55]} />
      <directionalLight
        ref={dirRef}
        castShadow
        position={[4, 7, 3.5]}
        intensity={1.8}
        color="#ffedd8"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={25}
      />
      {/* brand accents: shadowless washes in the logo colors (design D3) */}
      <pointLight ref={magentaRef} position={[0, 2, -2.2]} color={palette.neonMagenta} intensity={3.5} distance={4.5} decay={2} />
      <pointLight ref={purpleRef} position={[-1.8, 1.5, 1.6]} color={palette.neonPurple} intensity={2.5} distance={4.5} decay={2} />
      {/* static scene: render the contact shadows once and reuse */}
      <ContactShadows frames={1} position={[0, 0.01, 0]} scale={9} opacity={0.35} blur={2.5} far={2.5} />
    </>
  )
}
