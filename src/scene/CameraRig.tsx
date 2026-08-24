import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import CameraControlsImpl from 'camera-controls'
import { Vector3 } from 'three'
import { useScene } from '../state/store'
import { HOTSPOTS, OVERVIEW_POSE } from './hotspots/hotspots'
import type { CameraPose } from './hotspots/hotspots'

const { ACTION } = CameraControlsImpl

// Poses are authored for a landscape viewport; on narrow (portrait) screens
// dolly the camera out along its own axis so the framed width still fits.
function fitPose(pose: CameraPose, aspect: number): CameraPose {
  const factor = Math.max(1, 1.15 / aspect)
  if (factor === 1) return pose
  const [tx, ty, tz] = pose.target
  const [px, py, pz] = pose.position
  return {
    target: pose.target,
    position: [tx + (px - tx) * factor, ty + (py - ty) * factor, tz + (pz - tz) * factor],
  }
}

export function CameraRig() {
  const controlsRef = useRef<CameraControlsImpl>(null)
  const mode = useScene((s) => s.mode)
  const activeHotspot = useScene((s) => s.activeHotspot)
  const isTransitioning = useScene((s) => s.isTransitioning)
  const arrived = useScene((s) => s.arrived)
  const aspect = useThree((state) => state.size.width / state.size.height)
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

  const firstRun = useRef(true)
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const pose = fitPose(activeHotspot ? HOTSPOTS[activeHotspot].pose : OVERVIEW_POSE, aspect)
    const [px, py, pz] = pose.position
    const [tx, ty, tz] = pose.target
    const animate = !firstRun.current
    firstRun.current = false
    const id = ++transitionId.current
    void controls.setLookAt(px, py, pz, tx, ty, tz, animate).then(() => {
      if (transitionId.current === id) arrived()
    })
  }, [activeHotspot, arrived, aspect])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.35}
      restThreshold={0.01}
      minPolarAngle={0.7}
      maxPolarAngle={1.35}
      minAzimuthAngle={0.35}
      maxAzimuthAngle={1.22}
    />
  )
}
