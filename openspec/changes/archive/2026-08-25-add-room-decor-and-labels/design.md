# Design: Add Room Decor and Hotspot Labels

## Context

The base experience (archived change `build-3d-room-portfolio`) is live in the codebase: 4 hotspots with hover affordances, `frameloop="demand"` (idle renders zero frames), 74 draw calls, DOM overlay in a dark-pill design language. The full Kenney Furniture Kit (CC0) sits in the session scratchpad; only 12 of ~140 models were copied. Labels and decor must not regress the demand-frameloop battery win, the click-gating rules, or the mobile framing.

## Goals / Non-Goals

**Goals**: at-a-glance discoverability of the four sections on both pointer and touch; a room that reads furnished; keep idle at zero renders.

**Non-Goals**: no new hotspots or content sections; no changes to PC screen, fallback, or content model; no ambient/idle animation loops.

## Decisions

### D1 — Labels as DOM chips via drei `<Html>`, not in-scene 3D text
Matches the established pill UI (back button, cards); crisp at every zoom; system fonts. In-scene `<Text>` (troika) was rejected because its default font loads from a CDN — violating the self-contained requirement in `visual-experience` — and bundling a font file for four words isn't worth the bytes. Occlusion correctness doesn't matter since labels only exist in the settled overview where nothing passes in front of them.

### D2 — Label anchoring and data
Each hotspot gains a `labelOffset: [x, y, z]` in `hotspots.ts` (position above the object, relative to the hotspot group). A `HotspotLabel` rendered inside the `<Hotspot>` wrapper reads `HOTSPOTS[id].label`. Visibility = `mode === 'overview' && !isTransitioning` — same selector the hotspot enablement already uses, so labels and interactivity can never disagree.

### D3 — Label interaction and event hygiene
The chip is a `<button>`: click → `focus(id)`. Both `click` and `pointerdown` call `stopPropagation()` so events never leak through drei's Html container into R3F raycasting (lesson learned from ScreenUI, where leaked clicks triggered `back()`). Html `zIndexRange` is set below the DOM overlay so the back button/cards always win.

### D4 — Entrance animation without breaking demand-frameloop
CSS-only: chips animate in with a short rise-and-settle keyframe when mounted (overview reached), then are static. No `useFrame`, no `invalidate()` loop — DOM animation doesn't touch the canvas. Hiding is a CSS opacity transition on the visibility flag. With `frameloop="demand"`, Html anchor positions only update on rendered frames — correct here, because the camera never moves while the scene idles.

### D5 — Tooltip removal
`hoveredLabel` leaves the store; `Overlay.tsx` drops the tooltip element; `Hotspot.tsx` stops setting it. Hover highlight + cursor remain untouched.

### D6 — Decoration set and placement rules
New Kenney models copied from the kit (same CC0 credit line): `loungeChair`, `pillow`, `bear`, `lampRoundTable`, `coatRackStanding`, `rugDoormat`, `plantSmall1`. Procedural pieces from `palette.ts`: 2–3 framed wall posters (plane + frame box, like `CvFrame` minus text lines) and a fake window on the back wall (frame + emissive sky-tinted plane, `castShadow` off).
Placement rules:
- **Air gap**: keep ≥0.25 world units between any decor mesh and every hotspot's invisible hit box, so raycasts near hotspot edges can't land on decor first.
- **Sightlines**: verify from the overview pose and both orbit extremes that no decor occludes a hotspot or its label (screenshot check).
- **Shadow pass**: `castShadow={false}` for rug/doormat/posters/window/pillow/bear; keep it for chair, coat rack, lamps.

### D7 — Budget
Spec ceiling revised to <120 draw calls including shadow pass (was "~60", measured 74 pre-decor). Estimated post-decor: ~100. Re-measure with the `__glInfo` dev hook; if over 120, drop filler props first (doormat, extra plant).

## Risks / Trade-offs

- [Labels overlap each other on narrow portrait viewports (PC and phone chips are close)] → offsets tuned per hotspot; verify at 390x844 and nudge `labelOffset` or shrink chip font on small screens via media query.
- [Html chips reposition one frame late during transitions] → they fade out at transition start (D2 visibility rule), so stale positioning is never visible.
- [Decor near the desk steals phone-hotspot taps] → air-gap rule + the tap-test in verification.
- [Draw calls creep past budget] → shadow-pass skips + drop-filler order defined in D7.

## Migration Plan

Additive UI change; no data or content migration. Rollback = revert the commits.

## Open Questions

- Poster art: plain palette rectangles vs. tiny procedural motifs (mountains/sun) — decide visually during implementation.
- Exact label wording is `HOTSPOTS[id].label` as-is ("Projects", "Writing", "CV", "Contact") — rename there if desired.
