# Tasks: Add Room Decor and Hotspot Labels

## 1. Hotspot labels

- [ ] 1.1 Add `labelOffset` per hotspot to `scene/hotspots/hotspots.ts`
- [ ] 1.2 Create `scene/hotspots/HotspotLabel.tsx`: drei `<Html>` chip button, click/pointerdown stopPropagation → `focus(id)`, `zIndexRange` below the DOM overlay, CSS entrance rise-and-settle + opacity fade, chip styles in `index.css`
- [ ] 1.3 Render `HotspotLabel` inside the `<Hotspot>` wrapper, visible only when `mode === 'overview' && !isTransitioning`
- [ ] 1.4 Remove the hover tooltip: drop `hoveredLabel` from `state/store.ts`, the tooltip element from `ui/Overlay.tsx`, and its setter calls from `Hotspot.tsx`
- [ ] 1.5 Verify labels (playwright-cli): 4 chips in settled overview; fade out on focus and stay hidden until return; label click focuses its hotspot without leaking into the scene; idle renders zero frames after entrance animation; no overlap at 390x844

## 2. Decoration

- [ ] 2.1 Copy `loungeChair`, `pillow`, `bear`, `lampRoundTable`, `coatRackStanding`, `rugDoormat`, `plantSmall1` GLBs from the Kenney kit into `public/models/` and register them in `KenneyModel.tsx`
- [ ] 2.2 Create procedural `WallPoster.tsx` (palette plane + frame) and `FakeWindow.tsx` (frame + emissive sky plane) in `scene/objects/`
- [ ] 2.3 Place all decor in `Experience.tsx` per design D6: air gap ≥0.25 from hotspot hit boxes, `castShadow={false}` on flat/minor decor
- [ ] 2.4 Verify decor (playwright-cli): all 4 hotspots still focus from overview and at 390x844 tap positions; overview + orbit-extreme screenshots show no hotspot/label occlusion; draw calls <120 via `__glInfo`; idle still renders zero frames

## 3. Wrap up

- [ ] 3.1 Re-check overview framing after decor; nudge `OVERVIEW_POSE` if composition needs it
- [ ] 3.2 `npm run build && npm run preview`: production click-through of all four hotspots; commit per task group
