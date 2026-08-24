import { useEffect, useRef } from 'react'
import { CameraControls } from '@react-three/drei'
import CameraControlsImpl from 'camera-controls'
import { Vector3 } from 'three'
import { useScene } from '../state/store'
import { HOTSPOTS, OVERVIEW_POSE } from './hotspots/hotspots'

const { ACTION } = CameraControlsImpl

export function CameraRig() {
  const controlsRef = useRef<CameraControlsImpl>(null)
  const mode = useScene((s) => s.mode)
  const activeHotspot = useScene((s) => s.activeHotspot)
  const isTransitioning = useScene((s) => s.isTransitioning)
  const arrived = useScene((s) => s.arrived)
  // Guards stale setLookAt promises: only the latest transition may call arrived().
  const transitionId = useRef(0)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    // Orbit-only input; pan and dolly stay off in every mode.
    controls.mouseButtons.right = ACTION.NONE
    controls.mouseButtons.middle = ACTION.NONE
    controls.mouseButtons.wheel = ACTION.NONE
    controls.touches.two = ACTION.NONE
    controls.touches.three = ACTION.NONE
    const { position: p, target: t } = OVERVIEW_POSE
    void controls.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], false)
  }, [])

  // User rotation only in settled overview; NONE (not .enabled=false, which
  // would also freeze our own animated transitions) otherwise.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const interactive = mode === 'overview' && !isTransitioning
    controls.mouseButtons.left = interactive ? ACTION.ROTATE : ACTION.NONE
    controls.touches.one = interactive ? ACTION.TOUCH_ROTATE : ACTION.NONE
  }, [mode, isTransitioning])

  // Dev-only pose authoring: orbit, frame the shot, press "p", paste the
  // logged pose into hotspots.ts.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const fmt = (v: Vector3) =>
      `[${v.toArray().map((n) => Number(n.toFixed(2))).join(', ')}]`
    const onKeyDown = (e: KeyboardEvent) => {
      const controls = controlsRef.current
      if (e.key !== 'p' || !controls) return
      const position = controls.getPosition(new Vector3())
      const target = controls.getTarget(new Vector3())
      console.log(`pose: { position: ${fmt(position)}, target: ${fmt(target)} }`)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const { position: p, target: t } = activeHotspot
      ? HOTSPOTS[activeHotspot].pose
      : OVERVIEW_POSE
    const id = ++transitionId.current
    void controls.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], true).then(() => {
      if (transitionId.current === id) arrived()
    })
  }, [activeHotspot, arrived])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.5}
      minPolarAngle={0.7}
      maxPolarAngle={1.35}
      minAzimuthAngle={0.35}
      maxAzimuthAngle={1.22}
    />
  )
}
