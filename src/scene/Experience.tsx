import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScene } from '../state/store'
import { AmbientTicker, DustMotes } from './AmbientLife'
import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { Room } from './Room'
import { Hotspot } from './hotspots/Hotspot'
import { KenneyModel } from './objects/KenneyModel'
import { Pc } from './objects/Pc'
import { MagazineStack } from './objects/MagazineStack'
import { CvFrame } from './objects/CvFrame'
import { Phone } from './objects/Phone'
import { WallPoster } from './objects/WallPoster'
import { FakeWindow } from './objects/FakeWindow'
import { LogoPoster } from './objects/LogoPoster'
import { LedStrip } from './objects/LedStrip'
import { CodeMonitor } from './objects/CodeMonitor'
import { Printer3d } from './objects/Printer3d'
import { ReadingNook } from './objects/ReadingNook'
import { ArcadeMachine } from './objects/ArcadeMachine'
import { palette } from './palette'

// Kenney desk top (0.384 * KENNEY_SCALE).
export const DESK_TOP_Y = 0.77

// Dev/e2e hook: exposes renderer stats for automated perf checks.
function DevStats() {
  const gl = useThree((s) => s.gl)
  useFrame(() => {
    ;(window as unknown as Record<string, unknown>).__glInfo = {
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
    }
  })
  return null
}

export function Experience() {
  // mount-time backdrop; the mood lerp in Lights takes over from here
  const backdrop = useMemo(
    () => (useScene.getState().mood === 'dusk' ? palette.duskBackground : palette.background),
    [],
  )
  return (
    <>
      <color attach="background" args={[backdrop]} />
      {/* far range: the portrait aspect-dolly parks the camera ~15 units out */}
      <fog attach="fog" args={[backdrop, 18, 40]} />
      {import.meta.env.DEV && <DevStats />}
      <AmbientTicker />
      <DustMotes />
      <CameraRig />
      <Lights />
      <Room />

      {/* desk corner: two desk modules form one long battlestation */}
      <KenneyModel model="desk" position={[-0.72, 0, -2.55]} />
      <KenneyModel model="desk" position={[0.73, 0, -2.55]} />
      <KenneyModel model="chairDesk" position={[0.1, 0, -1.75]} rotation={[0, Math.PI + 0.25, 0]} />
      <KenneyModel model="computerKeyboard" position={[0, DESK_TOP_Y, -2.32]} />
      <KenneyModel model="computerMouse" position={[0.42, DESK_TOP_Y, -2.32]} />
      <KenneyModel model="plantSmall2" position={[-0.55, DESK_TOP_Y, -2.45]} />
      <CodeMonitor position={[1.05, DESK_TOP_Y, -2.6]} rotation={[0, -0.35, 0]} />
      <Hotspot id="pc" position={[0, DESK_TOP_Y, -2.62]} hitSize={[1, 0.75, 0.6]} hitOffset={[0, 0.3, 0.1]}>
        <Pc />
      </Hotspot>
      <Hotspot id="phone" position={[-1.05, DESK_TOP_Y, -2.28]} rotation={[0, 0.5, 0]} hitSize={[0.4, 0.25, 0.55]} hitOffset={[0, 0.05, 0]}>
        <Phone />
      </Hotspot>

      {/* reading corner */}
      <KenneyModel model="rugRound" position={[-1.75, 0.002, 0.75]} castShadow={false} />
      <Hotspot id="magazines" position={[-1.75, 0, 0.75]} hitSize={[1.4, 0.75, 0.9]} hitOffset={[0, 0.35, 0]}>
        <KenneyModel model="tableCoffee" />
        <MagazineStack position={[-0.25, 0.46, 0.05]} rotation={[0, 0.3, 0]} />
        <KenneyModel model="laptop" position={[0.32, 0.46, -0.02]} rotation={[0, -0.5, 0]} scale={0.8} castShadow={false} />
      </Hotspot>
      <KenneyModel model="lampRoundFloor" position={[-2.45, 0, 1.9]} />

      {/* wall + shelf */}
      <Hotspot id="cvFrame" position={[-2.87, 1.5, -1]} rotation={[0, Math.PI / 2, 0]} hitSize={[0.7, 0.9, 0.3]}>
        <CvFrame />
      </Hotspot>
      <KenneyModel model="bookcaseOpenLow" position={[2, 0, -2.63]} />
      <KenneyModel model="books" position={[2, 0.8, -2.63]} />
      <KenneyModel model="pottedPlant" position={[2.72, 0, -2.55]} />
      <KenneyModel model="lampRoundTable" position={[2.3, 0.8, -2.68]} castShadow={false} />

      {/* decoration — placed with air gap around every hotspot hit box */}
      <KenneyModel model="loungeChair" position={[-1.15, 0, 2.1]} rotation={[0, 0.55, 0]} />
      <ReadingNook position={[0.8, 0, 1.15]} rotation={[0, -0.4, 0]} />
      <KenneyModel model="coatRackStanding" position={[2.75, 0, -1.3]} />
      <KenneyModel model="rugDoormat" position={[1.3, 0.002, 2.6]} rotation={[0, 0.15, 0]} castShadow={false} />
      <KenneyModel model="pottedPlant" position={[-2.68, 0, 1.5]} scale={3} />
      <FakeWindow position={[-1.3, 1.7, -2.89]} />
      <LogoPoster position={[0, 2.15, -2.88]} />
      <LedStrip length={2.86} color={palette.neonMagenta} position={[0, 0.71, -2.17]} />
      <LedStrip length={5.9} color={palette.neonPurple} position={[0, 0.135, -2.94]} />
      <WallPoster color={palette.mint} position={[1.35, 1.85, -2.89]} />
      <WallPoster color={palette.blush} position={[2.05, 1.65, -2.89]} width={0.4} height={0.5} />
      <WallPoster color={palette.sky} position={[-2.89, 1.75, 0.6]} rotation={[0, Math.PI / 2, 0]} width={0.55} height={0.42} />

      {/* techie corner */}
      <KenneyModel model="sideTable" position={[-2.66, 0, -0.1]} rotation={[0, Math.PI / 2, 0]} castShadow={false} />
      <Printer3d position={[-2.66, 0.77, -0.1]} rotation={[0, Math.PI / 2 - 0.2, 0]} />
      <Hotspot
        id="arcade"
        position={[-2.62, 0, -1.95]}
        rotation={[0, Math.PI / 2, 0]}
        hitSize={[0.7, 1.8, 0.65]}
        hitOffset={[0, 0.85, 0.05]}
      >
        <ArcadeMachine />
      </Hotspot>
    </>
  )
}
