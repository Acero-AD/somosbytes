import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { Hotspot } from './hotspots/Hotspot'
import { Room } from './Room'
import { Desk, DESK_TOP_Y } from './objects/Desk'
import { Pc } from './objects/Pc'
import { MagazineStack } from './objects/MagazineStack'
import { CvFrame } from './objects/CvFrame'
import { Phone } from './objects/Phone'
import { palette } from './palette'

export function Experience() {
  return (
    <>
      <color attach="background" args={[palette.background]} />
      <CameraRig />
      <Lights />
      <Room />
      <Desk position={[0, 0, -2.5]} />
      <Hotspot id="pc" position={[0, DESK_TOP_Y, -2.55]} hitSize={[1.1, 0.8, 0.5]} hitOffset={[0, 0.35, 0]}>
        <Pc />
      </Hotspot>
      <Hotspot id="phone" position={[0.75, DESK_TOP_Y, -2.35]} rotation={[0, 0.5, 0]} hitSize={[0.4, 0.3, 0.55]} hitOffset={[0, 0.1, 0]}>
        <Phone />
      </Hotspot>
      <Hotspot id="magazines" position={[-1.9, 0, 0.7]} hitSize={[0.6, 0.4, 0.7]} hitOffset={[0, 0.15, 0]}>
        <MagazineStack />
      </Hotspot>
      <Hotspot id="cvFrame" position={[-2.87, 1.5, -1]} rotation={[0, Math.PI / 2, 0]} hitSize={[0.7, 0.9, 0.3]}>
        <CvFrame />
      </Hotspot>
    </>
  )
}
