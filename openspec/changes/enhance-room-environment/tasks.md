# Tasks: Enhance Room Environment

## 1. Architectural finish

- [ ] 1.1 Create `utils/canvasTextures.ts` (plank + wall finish CanvasTexture generators, palette-driven, SRGB)
- [ ] 1.2 Apply textures in `Room.tsx`; add baseboards along both walls; nudge the wall-seam LED strip onto the baseboard
- [ ] 1.3 Verify: overview screenshot shows planks/finish/baseboards; prod build makes no external texture requests; draw calls noted

## 2. World outside

- [ ] 2.1 Add the platform slab under the room in `Experience.tsx`
- [ ] 2.2 Rebuild `FakeWindow.tsx` with a layered view (sun/clouds day, moon/stars dusk scaffold — static day version first)
- [ ] 2.3 Verify: overview + orbit-extreme screenshots show the platform grounding the room, window reads as an outside

## 3. Mood modes

- [ ] 3.1 Add `mood` to the store with localStorage persistence (default day); sun/moon toggle button in `Overlay`
- [ ] 3.2 Wire mood into `Lights` (base dims, neon presence up), window view, background/fog; smooth ~1s lerp that invalidates while transitioning
- [ ] 3.3 Verify: day + dusk screenshots; hotspot click-through works in dusk; reload restores the chosen mood; labels legible in both moods

## 4. Ambient life

- [ ] 4.1 Add `AmbientTicker` (invalidates per frame only while tab visible AND no reduced-motion; reactive to both)
- [ ] 4.2 Add dust motes (single Points cloud, no raycast), code-monitor cursor blink, arcade screen shimmer, all clocked by the ticker
- [ ] 4.3 Verify: visible tab renders continuously; hidden tab renders zero frames (visibility emulation); reduced-motion emulation renders zero idle frames; motes never intercept clicks

## 5. Full verification & ship

- [ ] 5.1 Playwright: all 4 hotspots on desktop + 390x844 in both moods; draw calls <180; no console errors
- [ ] 5.2 `npm run build && npm run preview` click-through; commit per task group; push
