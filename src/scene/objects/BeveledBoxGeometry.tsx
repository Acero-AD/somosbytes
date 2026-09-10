import { useEffect, useMemo } from 'react'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

// Small edge radii catch light without adding a postprocessing pass.
export function BeveledBoxGeometry({ args, radius = 0.01 }: {
  args: [number, number, number]
  radius?: number
}) {
  const [width, height, depth] = args
  const geometry = useMemo(() => new RoundedBoxGeometry(
    width, height, depth, 2, Math.min(radius, width / 3, height / 3, depth / 3),
  ), [width, height, depth, radius])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <primitive attach="geometry" object={geometry} />
}
