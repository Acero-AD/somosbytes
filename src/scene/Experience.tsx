import { Lights } from './Lights'
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
      <Lights />
      <Room />
      <Desk position={[0, 0, -2.5]} />
      <Pc position={[0, DESK_TOP_Y, -2.55]} />
      <Phone position={[0.75, DESK_TOP_Y, -2.35]} rotation={[0, 0.5, 0]} />
      <MagazineStack position={[-1.9, 0, 0.7]} />
      <CvFrame position={[-2.87, 1.5, -1]} rotation={[0, Math.PI / 2, 0]} />
    </>
  )
}
