import { BeveledBoxGeometry } from './BeveledBoxGeometry'

// The housing is authored around the existing display anchor. Screen content,
// HTML transforms, and camera poses keep their measured dimensions.
export function MonitorHousing({ centerY, tilt }: { centerY: number; tilt: number }) {
  return (
    <group>
      <mesh position={[0, centerY, -0.022]} rotation={[tilt, 0, 0]} castShadow receiveShadow>
        <BeveledBoxGeometry args={[0.795, 0.505, 0.04]} radius={0.012} />
        <meshStandardMaterial color="#272d30" roughness={0.38} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.115, -0.055]} castShadow>
        <BeveledBoxGeometry args={[0.06, 0.2, 0.055]} radius={0.008} />
        <meshStandardMaterial color="#535d62" roughness={0.32} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.012, -0.025]} castShadow receiveShadow>
        <BeveledBoxGeometry args={[0.3, 0.024, 0.18]} radius={0.009} />
        <meshStandardMaterial color="#535d62" roughness={0.32} metalness={0.8} />
      </mesh>
    </group>
  )
}
