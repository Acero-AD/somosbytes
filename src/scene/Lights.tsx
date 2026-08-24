import { ContactShadows } from '@react-three/drei'

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
      {/* static scene: render the contact shadows once and reuse */}
      <ContactShadows frames={1} position={[0, 0.01, 0]} scale={9} opacity={0.35} blur={2.5} far={2.5} />
    </>
  )
}
