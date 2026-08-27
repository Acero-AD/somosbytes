# Design: Enhance Room Environment

## Context

Base: 159 draw calls, `frameloop="demand"` with zero idle renders, warm base + neon accents, all materials from `palette.ts`. The window is an emissive plane; the diorama floats on the background color. The idle-zero-render rule is currently absolute — ambient life forces an explicit renegotiation of that rule (done in the spec delta: visibility- and reduced-motion-gated).

## Goals / Non-Goals

**Goals**: grounded diorama with an outside world; visitor-chosen day/dusk mood; living idle scene that still costs nothing when hidden or when motion is unwanted; floor/walls that read as materials, not fills.

**Non-Goals**: free daylight cycle or clock-driven mood; audio; physical window cutout (the wall stays solid — the view is a layered emissive treatment); texture assets (everything generated).

## Decisions

- **D1 — Platform**: a wide flat slab (rounded box or short cylinder) under the floor, extending ~0.5–0.7 beyond the room on the open sides, dark wood tone from the palette. One mesh, `receiveShadow`, no cast. The background/fog colors become mood-driven so the backdrop participates in dusk.
- **D2 — Window view**: keep the solid wall; layer the view inside the frame — sky plane plus emissive sun disc + 2–3 cloud blobs (day) or moon crescent + star dots (dusk), toggled by mood with a cross-fade. All `meshBasicMaterial`, ~4–5 small meshes, castShadow off.
- **D3 — Mood state**: `mood: 'day' | 'dusk'` in the zustand scene store with localStorage persistence (try/catch, default day). A sun/moon DOM button in `Overlay` (always visible, ≥44px). Consumers read mood: `Lights` (directional/hemisphere intensity + color, accent light intensity), `FakeWindow` view, LED/arcade/logo halos unchanged (already emissive). Transition: lerp light intensities/colors over ~1s in a `useFrame` that invalidates until settled — works under demand frameloop.
- **D4 — Ambient life under demand frameloop**: keep `frameloop="demand"`; add one `AmbientTicker` component that calls `invalidate()` per frame only while `document.visibilityState === 'visible'` AND `!prefers-reduced-motion` (media query, reactive). Dust motes: a single `THREE.Points` cloud (~60 points, 1 draw call) drifting slowly in `useFrame`. Code-monitor cursor: a small emissive plane toggled by elapsed time. Arcade screen: slight color oscillation on its pixel planes. All three read the ticker's clock; when the ticker is off, everything freezes and rendering stops — hidden tabs and reduced-motion visitors get exactly the old behavior.
- **D5 — Floor/wall finish**: `utils/canvasTextures.ts` generates `CanvasTexture`s at runtime (self-contained): floor = plank pattern (palette wood tones, thin darker seams, slight per-plank tint variation), walls = very subtle vertical tone variation. Applied to the existing Room meshes with proper `SRGBColorSpace` and repeat. Baseboards: two long thin boxes (cream) along wall bases, castShadow off. LED wall-seam strip moves up a hair to sit on the baseboard.
- **D6 — Budget**: +platform (1) + window view (~5) + motes (1) + cursor (1) + baseboards (2) ≈ +10 → ~169; ceiling re-specced to <180. Textures add zero draw calls.

## Risks / Trade-offs

- [Mood lerp fights the demand frameloop] → the lerp itself invalidates until it settles (same pattern as the hotspot pulse).
- [Dusk hurts hotspot/label legibility] → dusk keeps ambient ≥ ~40% of day levels; labels are DOM (unaffected); verify with screenshots + click-through in dusk.
- [Points raycast interference] → set `raycast` to no-op on the motes so they never swallow clicks.
- [prefers-reduced-motion changes mid-session] → reactive media-query listener, ticker stops/starts live.
- [Plank texture tiling looks repetitive] → single non-repeating 1024px canvas mapped once across the 6x6 floor.

## Migration Plan

Additive; rollback = revert commits. The mood persistence key is a per-viewer convenience (localStorage), safe to ignore on failure.

## Open Questions

- Dusk backdrop: deep plum vs warm charcoal — decide visually.
- Whether the mood toggle also swaps the screen-UI wallpaper tint (nice touch, trivial) — decide during implementation.
