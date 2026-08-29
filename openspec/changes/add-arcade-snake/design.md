# Design: add-arcade-snake

## Context

The arcade cabinet (`src/scene/objects/ArcadeMachine.tsx`) is decor: a 0.44×0.34 screen plane plus four shimmer planes animated on the ambient ticker, placed at `[-2.62, 0, -1.95]` rotated to face +x. The room already has the exact interaction pattern the game needs: the PC hotspot flies the camera in, promotes `focused → screen` on arrival (`arrived()` in `src/state/store.ts`), and mounts an interactive surface. The scene runs `frameloop="demand"`; anything that animates must invalidate deliberately (`AmbientTicker` pattern), and the settled idle scene must render zero frames. All prior decisions hold: self-contained assets, brand palette, <180 draw calls, DOM-over-canvas clicks must `stopPropagation` (ScreenUI lesson).

Decided with Diego: CanvasTexture rendering, keyboard + mobile d-pad, blinking `PRESS START` attract mode, `localStorage` high score, no sound, easter egg (fallback untouched).

## Goals / Non-Goals

**Goals:**
- Arcade becomes the fifth hotspot; a complete Snake loop (attract → run → game over → restart) plays on the cabinet screen.
- Zero regression of the render contract: frames only during active runs and ambient-life frames; hidden tab pauses; reduced-motion visitors keep a static room but can play.
- Net draw-call reduction (screen bg + 4 shimmer planes collapse into one textured plane).

**Non-Goals:**
- Sound, gamepad support, difficulty ramp, additional games, leaderboards, fallback-page exposure.

## Decisions

**D1 — Screen rendering: one CanvasTexture for every screen state.**
A small offscreen 2D canvas (22×17 cells × 8px = 176×136) is the cabinet screen's only surface: attract visuals, live run, and game-over are all drawn there. `NearestFilter` + `toneMapped={false}` for chunky emissive pixels; snake in `neonPurple`, food in `neonMagenta`, text in `cream` on the existing `#12081c`. The four shimmer planes and the separate bg plane are removed — the attract state redraws their drifting pixels on the canvas. *Alternatives rejected:* `<Html transform>` (anti-aliased DOM fights the retro look, adds occlusion work), instanced pixel meshes (most code, more draw calls).

**D2 — Game engine is a plain TS module, not store state.**
`src/scene/objects/snake/engine.ts`: pure game logic (grid, snake, food, tick, direction queue, status `attract | running | paused | over`, scores) with no three/React imports — unit-testable in isolation and importable from both React trees. The zustand store stays untouched except for one generalization: `arrived()` promotes to `screen` when `activeHotspot` is in an `INTERACTIVE_HOTSPOTS` set (`pc`, `arcade`) instead of `=== 'pc'`. The Overlay derives "show d-pad" entirely from existing store state (`mode === 'screen' && activeHotspot === 'arcade'`) plus a `(pointer: coarse)` media query — no new store fields. *Alternative rejected:* game state in zustand (re-render churn per tick for data only the canvas reads).

**D3 — Tick loop rides `useFrame` with an accumulator.**
An `ArcadeScreen` component inside the cabinet: while `status === 'running'`, each frame calls `invalidate()` and advances the engine every `TICK_MS = 110`; on any state change it repaints the canvas and sets `texture.needsUpdate`. Attract blink is drawn time-based on ambient-ticker frames (so it obeys visibility/reduced-motion gating for free; under reduced motion the attract screen is painted once, prompt solid). A `visibilitychange` listener pauses a running engine and resumes on return. Fixed tick, no speed ramp (YAGNI — engine's tick interval stays a constant that a future change could vary).

**D4 — Input: buffered directions, mode-gated listeners.**
A window `keydown` listener mounts only while in the arcade's `screen` mode: arrows/WASD map to directions, `preventDefault` on handled keys, reversals into the neck rejected, up to two queued turns per tick (classic input buffering so fast corners register). Any direction/start input in `attract`/`over` starts a fresh run — one affordance, matching `PRESS START`. The d-pad is four DOM buttons in `Overlay.tsx` (≥44px, `pointerdown` + `stopPropagation`/`onPointerDown` guard exactly like `.screen-ui`), calling `engine.setDirection()` directly.

**D5 — Hotspot wiring.**
New `arcade` entry in `HOTSPOTS` with a head-on pose along the screen's +x normal (screen center world ≈ `[-2.37, 1.14, -1.95]`; starting guess `position [-1.45, 1.2, -1.95]`, tuned with the dev pose logger) and a label chip (text: **"Arcade"**) anchored above the marquee. The cabinet gets an invisible oversized hit box (the established `visible={false}` mesh pattern) wrapped in the existing `Hotspot` component in `Experience.tsx`. Leaving (back/Escape/click-outside) resets the engine to `attract` via an effect watching the store.

**D6 — High score: `localStorage` key `snakeHighScore`.**
Same guarded read/write shape as the `mood` preference; failures degrade to session-only. Drawn as `HI ####` in the canvas corner during attract and runs.

## Risks / Trade-offs

- [Screen readability at focus distance is unproven] → First implementation task is a spike: stamp a throwaway grid texture on the plane, fly to the candidate pose, screenshot, and only then invest in polish. Cell count can drop (e.g. 18×14) if 22×17 reads muddy.
- [D-pad taps leaking into the 3D scene] → Apply the ScreenUI lesson from day one: `stopPropagation` on `pointerdown`/`click`; verify by tapping the d-pad over hotspot silhouettes.
- [Keyboard listener conflicts] → Escape stays "leave" (dying ≠ exiting); handled keys are gated to arcade `screen` mode so nothing changes elsewhere.
- [Per-tick texture uploads] → 176×136 RGBA ≈ 96 KB every ~110 ms only while playing; negligible, but verified in the perf pass alongside the draw-call count.
- [Label crowding in the back-left corner (CV frame chip is nearby)] → Verify overview label layout at desktop + portrait widths; nudge `labelOffset` as done for the phone chip.
- [Hidden-tab resume feels abrupt] → Resume paused (status `paused`, prompt "resume" on the canvas) rather than instantly ticking; a single input continues the run.

## Migration Plan

Purely additive; no data or URL changes. Rollback = revert the commits (the localStorage key becomes an orphan, harmless).

## Open Questions

None blocking — label text ("Arcade") and grid size are tunable during implementation without spec impact.
