import { ContactShadows } from '@react-three/drei'
import { palette } from './palette'

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#fff4e6" />
      {/* warm sky + floor-bounce fill keeps the walls from going gray */}
      <hemisphereLight args={['#fff6ea', '#d8b99a', 0.55]} />
      <directionalLight
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
      <pointLight position={[0, 2, -2.2]} color={palette.neonMagenta} intensity={3.5} distance={4.5} decay={2} />
      <pointLight position={[-1.8, 1.5, 1.6]} color={palette.neonPurple} intensity={2.5} distance={4.5} decay={2} />
      {/* static scene: render the contact shadows once and reuse */}
      <ContactShadows frames={1} position={[0, 0.01, 0]} scale={9} opacity={0.35} blur={2.5} far={2.5} />
    </>
  )
}
