# Proposal: add-arcade-snake

## Why

The arcade cabinet is pure set dressing today — a fake shimmer pretending a game is running. Making it actually playable turns the room's most inviting prop into a memorable easter egg: a small, delightful proof of craft that rewards visitors who explore, exactly what a portfolio room is for.

## What Changes

- The arcade machine becomes the fifth hotspot: clicking it flies the camera face-on to the cabinet screen, with a floating label chip like the other hotspots.
- A playable Snake game renders on the cabinet screen (CanvasTexture on the existing screen plane — retro raster look, brand-palette snake/food, replaces the shimmer planes while zoomed in).
- Attract mode: when not being played, the screen shows the idle shimmer plus a blinking `PRESS START`; the game starts on click/keypress once focused.
- Controls: arrow keys / WASD on desktop; an on-screen d-pad (DOM overlay) on touch devices.
- High score persists in `localStorage` (same try/catch pattern as the mood preference) and shows on the screen (`HI ####` corner readout).
- Game ticks only while a run is active; hidden tab pauses the run; reduced-motion visitors can still play (user-initiated motion) while the room stays static.
- The store's pc-only `focused → screen` promotion generalizes to a set of interactive hotspots (`pc`, `arcade`).
- No sound. The HTML fallback is untouched — the game is an easter egg, not portfolio content.

## Capabilities

### New Capabilities

- `arcade-minigame`: the playable Snake experience — attract mode, start/play/game-over states, controls (keyboard + touch d-pad), tick/pause rules under demand-frameloop, high-score persistence, reduced-motion allowance.

### Modified Capabilities

- `room-navigation`: the hotspot set grows to five (arcade added), and the "arriving at the PC promotes to screen mode" requirement generalizes to interactive hotspots (pc, arcade).
- `visual-experience`: the arcade screen requirement changes from pure decor shimmer to an interactive surface with an attract state; draw-call accounting notes the shimmer planes are replaced by a single textured plane.

## Impact

- `src/state/store.ts` — interactive-hotspot set for the screen promotion.
- `src/scene/hotspots/hotspots.ts` — new `arcade` hotspot pose + label.
- `src/scene/objects/ArcadeMachine.tsx` — screen becomes a CanvasTexture surface; shimmer becomes the attract state; wrapped in a `Hotspot`.
- New game module (e.g. `src/scene/objects/snake/`) — pure game logic + canvas renderer + input handling.
- `src/ui/Overlay.tsx` + `src/index.css` — touch d-pad while playing (with the established `stopPropagation` discipline for DOM over canvas).
- No new dependencies, no new fetched assets (canvas is generated at runtime), no fallback-page changes.
- Perf: net draw-call reduction (bg + 4 shimmer planes → 1 textured plane); budget unchanged (<180).
