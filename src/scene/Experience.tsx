import { Lights } from './Lights'
import { Room } from './Room'
import { palette } from './palette'

export function Experience() {
  return (
    <>
      <color attach="background" args={[palette.background]} />
      <Lights />
      <Room />
    </>
  )
}
