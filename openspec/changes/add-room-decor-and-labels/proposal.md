# Proposal: Add Room Decor and Hotspot Labels

## Why

First-time visitors — and every touch user, who never sees hover feedback — get no signal about which objects are interactive or what they lead to. The room also reads as sparse (bare walls, empty corners), undercutting the cozy-diorama impression. Persistent labels fix discoverability; decoration finishes the look.

## What Changes

- **Persistent hotspot labels**: a DOM chip (drei `<Html>`, same pill style as the existing overlay UI) floats above each of the four hotspots naming its section ("Projects", "Writing", "CV", "Contact"). Visible only in settled overview; they fade out during transitions and while focused. Clicking a label focuses its hotspot. One-shot entrance animation that settles — no perpetual idle animation, preserving the zero-render idle of `frameloop="demand"`.
- **Remove the hover tooltip**: the persistent labels make the shared bottom-center hover tooltip redundant; it and the store's `hoveredLabel` plumbing are removed. Hover highlight + pointer cursor stay.
- **Room decoration** (all CC0 Kenney Furniture Kit models already downloaded, plus procedural pieces from the palette):
  - Walls: 2–3 procedural framed pastel posters; a fake window (procedural frame + emissive sky plane) on the back wall.
  - Reading corner: lounge chair + pillow, with the teddy bear on it.
  - Desk corner: small table lamp.
  - Filler: standing coat rack near the open edge, doormat, one extra plant.
- **Revised performance budget**: draw-call budget updated from "~60" to "<120 including the shadow pass" to honestly cover the decorated scene (measured 74 pre-decor; 121fps at 4x CPU throttle leaves ample headroom). Small decor skips the shadow pass. The idle-renders-zero-frames behavior becomes a spec requirement.

## Capabilities

### New Capabilities

_None — labels are a navigation affordance, decoration is part of the visual experience._

### Modified Capabilities

- `room-navigation`: the "label naming the section" moves from a hover-only tooltip to persistent overview labels; new requirement for label visibility/behavior rules.
- `visual-experience`: new requirement for decoration (non-interactive, must not steal hotspot clicks or occlude hotspots); performance budget requirement revised (draw-call ceiling, idle zero-render).

## Impact

- Code: `src/scene/hotspots/` (label component + anchor data), `src/ui/Overlay.tsx` (tooltip removal), `src/state/store.ts` (drop `hoveredLabel`), `src/scene/Experience.tsx` + `src/scene/objects/` (decor placement, poster/window components), `src/index.css` (chip styles).
- Assets: ~6 more Kenney GLBs copied into `public/models/` (same CC0 kit already credited in `CREDITS.md`); still far below the compression threshold.
- No content-model, fallback, or PC-screen changes.
