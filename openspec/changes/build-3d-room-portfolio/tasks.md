# Tasks: Build 3D Room Portfolio

## 1. Scaffold (M0)

- [x] 1.1 Bootstrap Vite react-ts template in repo root (`npm create vite@latest . -- --template react-ts`), clean demo boilerplate
- [x] 1.2 Install runtime deps (`@react-three/fiber`, `@react-three/drei`, `zustand`; let peer ranges pick `three`) and dev deps (`leva`, `r3f-perf`, `@types/three` only if TS complains)
- [x] 1.3 Set `base: './'` in `vite.config.ts`; create folder skeleton per design D8; add `public/models`, `public/cv`, `public/icons`
- [x] 1.4 Write `src/content/types.ts` and `src/content/portfolio.ts` with real content (projects, Substack URL, CV path, socials); drop CV PDF into `public/cv/` — NOTE: placeholder content + placeholder PDF per Diego's choice; TODO markers in `portfolio.ts`
- [x] 1.5 Render a `<Canvas>` with a spinning cube; verify `npm run dev` works; initial git commit

## 2. Gray-box room + navigation (M1)

- [x] 2.1 Build `Room.tsx`: floor + two walls (corner diorama) with palette colors from `scene/palette.ts`
- [x] 2.2 Add 4 placeholder `RoundedBox` props in `scene/objects/` (Pc, MagazineStack, CvFrame, Phone positions)
- [x] 2.3 Implement `state/store.ts` zustand state machine (`mode`, `activeHotspot`, `isTransitioning`, `hoveredLabel`, `focus`, `back`) — includes `hotspots.ts` data skeleton (store's `HotspotId` derives from it)
- [x] 2.4 Implement `CameraRig.tsx` with drei `CameraControls`: overview pose, clamped orbit (no truck/dolly), `setLookAt` fly-tos driven by store, promise-on-rest clears `isTransitioning`, disable controls when focused (via ACTION.NONE — `.enabled=false` would freeze our own transitions)
- [x] 2.5 Add dev-only `p` keydown pose logger; author all poses in `hotspots/hotspots.ts` (4 hotspots + `OVERVIEW_POSE`) — initial poses computed geometrically; visual fine-tune happens in 4.5
- [x] 2.6 Implement `hotspots/Hotspot.tsx`: enablement gating, click→focus with stopPropagation, hover emissive highlight + scale pulse + cursor, invisible oversized hit mesh
- [x] 2.7 Implement `ui/Overlay.tsx`: back button (hidden in overview), Escape listener, shared hover tooltip; wire `onPointerMissed` + floor/wall click → `back()`
- [x] 2.8 Verify M1: click all 4 cubes; return via Esc/back/click-outside for each; mid-flight clicks ignored; tap-test in DevTools device emulation (iPhone SE, Pixel) — verified with playwright-cli (desktop 1280x800 + portrait 390x844); found & fixed: aspect-aware camera dolly for portrait, restThreshold tuning (settle 3s→1.7s), tightened overview pose

## 3. PC screen UI (M2)

- [x] 3.1 Add emissive screen plane to the gray-box PC (far state) — landed with the gray-box Pc in 2.2
- [x] 3.2 Implement `screen/ScreenUI.tsx`: desktop wallpaper, icon grid from `portfolio.projects`, real anchors (`target="_blank" rel="noreferrer"`), description tooltips
- [x] 3.3 Mount `<Html transform>` with ScreenUI only in `screen` mode, positioned on the screen plane; opacity fade on mount/unmount; `pointerEvents` gated by `isTransitioning` — mounts from fly-in start (activeHotspot==='pc') so the fade plays during arrival; DOM clicks stopPropagation so they don't leak into R3F raycasting
- [x] 3.4 Implement focused overlay cards in `Overlay.tsx` for magazine/CV/phone hotspots (title, description, external link from content module) — added `asset()` BASE_URL helper so public/ paths survive bucket-subpath hosting
- [x] 3.5 Verify M2: full journey — monitor→arrive→icons open correct URLs in new tabs; icons inert during fly-in; Esc exits screen; other hotspots' cards link to CV PDF/Substack/socials — verified end-to-end with playwright-cli

## 4. Real assets + look (M3)

- [x] 4.1 Source CC0 GLBs (Kenney Furniture Kit, Poly Pizza) into `public/models/`; record source/license notes in a `CREDITS.md` — 12 models from Kenney Furniture Kit (152KB total); phone/CV frame/magazines stay procedural (no fitting models in kit)
- [x] 4.2 Run `gltfjsx --types --transform` on the monitor model to isolate the screen face; use `useGLTF`/`<primitive>` for the rest — gltfjsx inspection showed the GLB has no separate screen-face mesh, so the emissive plane + Html overlay the bezel instead (position derived from GLB bounding boxes)
- [x] 4.3 Swap gray boxes prop-by-prop inside unchanged `<Hotspot>` wrappers; override all materials to `palette.ts` colors — Kenney kit's own pastel palette is coherent as-is; procedural props (magazines/frame/phone) already use palette.ts
- [x] 4.4 Lighting pass: ambient + directional with tight shadow frustum (1024 map) + `<ContactShadows frames={1}>`; try `<SoftShadows>`; background color + light fog — warm hemisphere fill instead of SoftShadows (shadows already soft enough)
- [ ] 4.5 Re-tune all camera poses with the pose logger; polish hover highlight
- [ ] 4.6 Verify M3: visual pass at 3 window sizes; r3f-perf fps and draw calls (<60); DevTools 4x CPU throttle stays smooth

## 5. Fallback, loader, perf, ship (M4)

- [ ] 5.1 Implement `utils/webgl.ts` detection and `App.tsx` gate (WebGL missing / `?no3d` / persisted skip); `fallback/FallbackPage.tsx` semantic HTML from content module, always in DOM (visually hidden when 3D active), "Enter 3D room" undo link
- [ ] 5.2 Implement `ui/Loader.tsx` splash with `useProgress` + "Skip 3D" link; add `useGLTF.preload` calls
- [ ] 5.3 Add static `<title>`, meta description, OpenGraph tags, and noscript block with key links to `index.html`
- [ ] 5.4 Add `webglcontextlost` handler with reload / classic-view actions; `100dvh` canvas container
- [ ] 5.5 Perf tuning: `dpr={[1,2]}`, decide `frameloop` (always vs demand), r3f-perf audit; model compression only if `public/models` > ~2–3 MB
- [ ] 5.6 Verify M4: fallback via `?no3d`, via Skip 3D, and with WebGL disabled in browser; semantic content visible in DOM inspector; `npm run build && npm run preview` and re-run M1/M2 click-throughs against the production build; Lighthouse mobile pass
- [ ] 5.7 Hand off `dist/` for upload to the `tech-ai-tools` S3 bucket (request access in Slack #ai-tools); verify live URL end-to-end
