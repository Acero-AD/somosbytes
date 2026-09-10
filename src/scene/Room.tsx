import { BeveledBoxGeometry } from './objects/BeveledBoxGeometry'
import { useScene } from '../state/store'
import { palette } from './palette'
import { RoomSurface } from './RoomSurface'

export const ROOM_SIZE = 6
export const WALL_HEIGHT = 3
const THICKNESS = 0.2

// Corner diorama: floor plus back (-z) and left (-x) walls. The overview
// camera lives in the +x/+z quadrant, so the two open sides stay behind it.
// Clicking any room surface while focused returns to overview — but not
// mid-flight, so a stray click can't cancel the visitor's own zoom-in.
export function Room() {
  const onClick = () => {
    const { isTransitioning, back } = useScene.getState()
    if (!isTransitioning) back()
  }
  return (
    <group onClick={onClick}>
      {/* diorama platform: grounds the room in the backdrop */}
      <mesh position={[0.1, -0.35, 0.1]}>
        <BeveledBoxGeometry args={[7.6, 0.3, 7.6]} />
        <meshStandardMaterial color={palette.platform} roughness={1} />
      </mesh>
      <RoomSurface finish="wood" size={[ROOM_SIZE, THICKNESS, ROOM_SIZE]} position={[0, -THICKNESS / 2, 0]} />
      <RoomSurface finish="plaster" size={[ROOM_SIZE + THICKNESS * 2, WALL_HEIGHT, THICKNESS]} position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2 - THICKNESS / 2]} />
      <RoomSurface finish="plaster" size={[THICKNESS, WALL_HEIGHT, ROOM_SIZE]} position={[-ROOM_SIZE / 2 - THICKNESS / 2, WALL_HEIGHT / 2, 0]} />
      {/* baseboards */}
      <mesh position={[0, 0.06, -ROOM_SIZE / 2 + 0.025]}>
        <BeveledBoxGeometry args={[ROOM_SIZE, 0.12, 0.05]} />
        <meshStandardMaterial color={palette.cream} roughness={0.85} />
      </mesh>
      <mesh position={[-ROOM_SIZE / 2 + 0.025, 0.06, 0]}>
        <BeveledBoxGeometry args={[0.05, 0.12, ROOM_SIZE]} />
        <meshStandardMaterial color={palette.cream} roughness={0.85} />
      </mesh>
    </group>
  )
}
