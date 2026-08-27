import { useMemo } from 'react'
import { useScene } from '../state/store'
import { plankTexture, wallTexture } from '../utils/canvasTextures'
import { palette } from './palette'

export const ROOM_SIZE = 6
export const WALL_HEIGHT = 3
const THICKNESS = 0.2

// Corner diorama: floor plus back (-z) and left (-x) walls. The overview
// camera lives in the +x/+z quadrant, so the two open sides stay behind it.
// Clicking any room surface while focused returns to overview — but not
// mid-flight, so a stray click can't cancel the visitor's own zoom-in.
export function Room() {
  const floorMap = useMemo(plankTexture, [])
  const wallMap = useMemo(wallTexture, [])
  const onClick = () => {
    const { isTransitioning, back } = useScene.getState()
    if (!isTransitioning) back()
  }
  return (
    <group onClick={onClick}>
      <mesh position={[0, -THICKNESS / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, THICKNESS, ROOM_SIZE]} />
        <meshStandardMaterial map={floorMap} roughness={0.9} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2 - THICKNESS / 2]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE + THICKNESS * 2, WALL_HEIGHT, THICKNESS]} />
        <meshStandardMaterial map={wallMap} roughness={0.95} />
      </mesh>
      <mesh position={[-ROOM_SIZE / 2 - THICKNESS / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[THICKNESS, WALL_HEIGHT, ROOM_SIZE]} />
        <meshStandardMaterial map={wallMap} roughness={0.95} />
      </mesh>
      {/* baseboards */}
      <mesh position={[0, 0.06, -ROOM_SIZE / 2 + 0.025]}>
        <boxGeometry args={[ROOM_SIZE, 0.12, 0.05]} />
        <meshStandardMaterial color={palette.cream} roughness={0.85} />
      </mesh>
      <mesh position={[-ROOM_SIZE / 2 + 0.025, 0.06, 0]}>
        <boxGeometry args={[0.05, 0.12, ROOM_SIZE]} />
        <meshStandardMaterial color={palette.cream} roughness={0.85} />
      </mesh>
    </group>
  )
}
