import { useScene } from '../state/store'
import { palette } from './palette'

export const ROOM_SIZE = 6
export const WALL_HEIGHT = 3
const THICKNESS = 0.2

// Corner diorama: floor plus back (-z) and left (-x) walls. The overview
// camera lives in the +x/+z quadrant, so the two open sides stay behind it.
// Clicking any room surface while focused returns to overview.
export function Room() {
  const back = useScene((s) => s.back)
  return (
    <group onClick={back}>
      <mesh position={[0, -THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, THICKNESS, ROOM_SIZE]} />
        <meshStandardMaterial color={palette.floor} roughness={0.9} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2 - THICKNESS / 2]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE + THICKNESS * 2, WALL_HEIGHT, THICKNESS]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-ROOM_SIZE / 2 - THICKNESS / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[THICKNESS, WALL_HEIGHT, ROOM_SIZE]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
    </group>
  )
}
