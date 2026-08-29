# Proposal: Enhance Room Environment

## Why

The room itself is now rich and personal, but everything around and beneath it is unfinished: the diorama floats in a beige void, the "window" is a flat glowing rectangle onto nothing, the scene has exactly one mood, nothing ever moves, and the floor and walls are single flat colors. The environment is the least-designed layer of the experience.

## What Changes

Four areas, decided with Diego:

- **World outside the room**: a visible platform beneath the diorama (so it reads as a designed model, not a floating slab) and a window view that actually shows an outside — sun and clouds by day, moon and stars at dusk.
- **Mood / time-of-day**: a visitor-facing day↔dusk toggle. Dusk dims the warm daylight, cools the window light, and lets the neon accents dominate — the deferred "dusk mode", done as a choice instead of a default. Remembered per visitor.
- **Ambient life**: subtle idle motion — drifting dust motes, a blinking cursor on the code monitor, a shimmering arcade screen. This conflicts with the current idle-zero-render requirement; the spec delta resolves it: animate only while the tab is visible, render zero frames when hidden, and stay fully static for reduced-motion visitors.
- **Floor and walls**: architectural finish — wood-plank floor and subtle wall texture via runtime-generated canvas textures (self-contained, no fetched assets), plus baseboards along both walls.

Performance ceiling revised <160 → <180 draw calls to cover the additions (measured before/after as always).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `visual-experience`: four ADDED requirements (world beyond the room, mood modes, ambient life, architectural finish) and two MODIFIED requirements (performance budgets — idle rule rewritten around tab visibility and reduced motion, ceiling raised; corner-room diorama layout — the surrounding space becomes designed backdrop).

## Impact

- Code: `Experience.tsx` (platform, placement), `Lights.tsx` + `FakeWindow.tsx` + LED/arcade/code-monitor components (mood wiring, ambient life), `state/store.ts` or a small ui store (mood + persistence), `ui/Overlay.tsx` (toggle button), new `utils/canvasTextures.ts`, `Room.tsx` (textures, baseboards), a frame ticker honoring `document.visibilityState` and `prefers-reduced-motion`.
- No content-model, navigation, hotspot, or fallback changes. No new assets — textures are generated at runtime.
