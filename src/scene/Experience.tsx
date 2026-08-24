import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { Room } from './Room'
import { Hotspot } from './hotspots/Hotspot'
import { KenneyModel } from './objects/KenneyModel'
import { Pc } from './objects/Pc'
import { MagazineStack } from './objects/MagazineStack'
import { CvFrame } from './objects/CvFrame'
import { Phone } from './objects/Phone'
import { palette } from './palette'

// Kenney desk top (0.384 * KENNEY_SCALE).
export const DESK_TOP_Y = 0.77

export function Experience() {
  return (
    <>
      <color attach="background" args={[palette.background]} />
      <CameraRig />
      <Lights />
      <Room />

      {/* desk corner */}
      <KenneyModel model="desk" position={[0, 0, -2.55]} />
      <KenneyModel model="chairDesk" position={[0.1, 0, -1.75]} rotation={[0, Math.PI + 0.25, 0]} />
      <KenneyModel model="computerKeyboard" position={[0, DESK_TOP_Y, -2.32]} />
      <KenneyModel model="computerMouse" position={[0.42, DESK_TOP_Y, -2.32]} />
      <KenneyModel model="plantSmall2" position={[-0.55, DESK_TOP_Y, -2.45]} />
      <Hotspot id="pc" position={[0, DESK_TOP_Y, -2.62]} hitSize={[1, 0.75, 0.6]} hitOffset={[0, 0.3, 0.1]}>
        <Pc />
      </Hotspot>
      <Hotspot id="phone" position={[0.58, DESK_TOP_Y, -2.22]} rotation={[0, 0.5, 0]} hitSize={[0.4, 0.25, 0.55]} hitOffset={[0, 0.05, 0]}>
        <Phone />
      </Hotspot>

      {/* reading corner */}
      <KenneyModel model="rugRound" position={[-1.75, 0.002, 0.75]} />
      <Hotspot id="magazines" position={[-1.75, 0, 0.75]} hitSize={[1.4, 0.75, 0.9]} hitOffset={[0, 0.35, 0]}>
        <KenneyModel model="tableCoffee" />
        <MagazineStack position={[0, 0.46, 0]} rotation={[0, 0.3, 0]} />
      </Hotspot>
      <KenneyModel model="lampRoundFloor" position={[-2.45, 0, 1.9]} />

      {/* wall + shelf */}
      <Hotspot id="cvFrame" position={[-2.87, 1.5, -1]} rotation={[0, Math.PI / 2, 0]} hitSize={[0.7, 0.9, 0.3]}>
        <CvFrame />
      </Hotspot>
      <KenneyModel model="bookcaseOpenLow" position={[2, 0, -2.63]} />
      <KenneyModel model="books" position={[2, 0.8, -2.63]} />
      <KenneyModel model="pottedPlant" position={[2.72, 0, -2.55]} />
    </>
  )
}
