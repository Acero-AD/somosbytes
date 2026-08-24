# Design: Build 3D Room Portfolio

## Context

Greenfield repo (`somosbytes`). Owner is a software engineer comfortable with React/TS, new-ish to Three.js. Output must be a fully static Vite build (no SSR, no server routes), self-contained (no runtime CDN fetches), deployed to SeQura's `tech-ai-tools` S3 bucket. Local toolchain: Node v22, npm 11.

## Goals / Non-Goals

**Goals**: interactive 3D room with 4 hotspots; PC-screen desktop UI for projects; HTML fallback with content parity; single content source; cozy low-poly look without a Blender pipeline; works on mobile/touch.

**Non-Goals**: free-roam or first-person navigation; custom-modeled/baked room; CMS or backend; multi-page routing; in-3D text-heavy content (external links carry the content).

## Decisions

### D1 — React Three Fiber v9 + drei v10 over vanilla Three.js
Declarative scene graph, pointer events with built-in raycasting, and drei primitives (`CameraControls`, `Html`, `ContactShadows`, `useGLTF`, `useProgress`, `RoundedBox`) cover every hard part of this project. Vanilla Three.js would mean hand-rolling raycasting, tweens, and a CSS3D layer. Install fiber/drei first and let their peer ranges resolve `three`; never bump `three` independently.

### D2 — zustand for scene state over React context/state
The mode state machine is read by the camera rig, hotspots, DOM overlay, and screen UI — components living in different trees (inside/outside `<Canvas>`). zustand crosses that boundary trivially and allows transient reads in `useFrame` without re-renders. Store shape: `{ mode: 'overview'|'focused'|'screen', activeHotspot, isTransitioning, hoveredLabel, focus(id), back() }`.

### D3 — drei `<CameraControls>` for navigation over custom lerp or @react-spring/three
`setLookAt(...pose, true)` gives damped, interruptible fly-tos and returns a promise on rest — exactly the "camera arrived → enable screen UI / clear isTransitioning" hook. Touch, inertia, and angle clamping come free. Alternatives rebuild all of that. Per-hotspot poses live as data in `hotspots.ts` (`{position, target}` + `OVERVIEW_POSE`); a dev-only `p` keydown logs current position/target so pose authoring is orbit → frame → press `p` → paste.

### D4 — PC screen: static emissive plane far, `<Html transform>` (no occlude) near
At distance the screen is a plain emissive plane (crisp, cheap, glows). Only in `screen` mode — camera head-on, nothing can pass in front — is `<Html transform>` mounted on the screen plane with the `ScreenUI` desktop (icon grid from `portfolio.projects`, each a real `<a target="_blank">`). This sidesteps `Html`'s occlusion flicker entirely and keeps DOM out of the scene otherwise. Rejected: render-to-texture (UV→hit-region mapping complexity), CSS3DRenderer (second renderer, not idiomatic in R3F).

### D5 — Reusable `<Hotspot>` wrapper
Gates handlers/cursor on `mode === 'overview' && !isTransitioning`; `onClick` with `stopPropagation` → `focus(id)`; hover = emissive highlight on cloned materials + subtle scale pulse; one shared tooltip in the DOM overlay fed by `hoveredLabel` (no per-hotspot `Html`); an invisible oversized hit mesh (`visible={false}`, still raycasted) guarantees ≥44px touch targets. Non-PC hotspots show a DOM overlay card (title/description/link) when focused — DOM anchors avoid popup blockers.

### D6 — Assets and look
CC0 GLBs (Kenney Furniture Kit, Poly Pizza) in `public/models/`, loaded via `useGLTF` + `useGLTF.preload`. `gltfjsx --types --transform` only where per-mesh access is needed (monitor screen face); `<primitive>` elsewhere. All materials overridden to a shared `palette.ts` (cream/wood/pastels, roughness ~0.9). Lighting: ambient 0.5 + one shadow-casting directional (1024 map, tight frustum) + `<ContactShadows frames={1}>`; optional `<SoftShadows>`. No drei `<Environment>` presets (CDN fetch). Compression only if `public/models` exceeds ~2–3 MB (meshopt via gltfjsx; skip draco at this scale).

### D7 — Gray-box first
All interaction (M1–M2) is built and verified on placeholder `RoundedBox` props before any asset hunting; the `<Hotspot>` wrapper means swapping in GLBs later touches no interaction code.

### D8 — Folder structure

```
src/
├── App.tsx                 # WebGL gate: 3D vs fallback
├── content/{types,portfolio}.ts
├── state/store.ts
├── scene/
│   ├── Experience.tsx      # <Canvas> root
│   ├── CameraRig.tsx       # CameraControls + pose logger
│   ├── Lights.tsx  Room.tsx  palette.ts
│   ├── hotspots/{Hotspot.tsx,hotspots.ts}
│   ├── objects/            # Desk, Pc, MagazineStack, CvFrame, Phone
│   └── screen/ScreenUI.tsx
├── ui/{Overlay,Loader}.tsx
├── fallback/FallbackPage.tsx
└── utils/webgl.ts
```

`vite.config.ts` uses `base: './'` so the build works if served under a bucket subpath.

## Risks / Trade-offs

- [`Html transform` blur on mobile Safari] → render larger CSS pixels scaled down via `distanceFactor`; test on a real device.
- [Pointer leakage during camera animation] → `isTransitioning` gates both 3D handlers and Html `pointer-events`; cleared only on `setLookAt` promise resolution.
- [Mobile Safari WebGL context loss] → `webglcontextlost` handler offering reload / classic view; `100dvh` container; dpr clamp.
- [three/fiber/drei version skew] → peer ranges are the source of truth.
- [Popup blockers] → external navigation only through real DOM anchors, never `window.open` in raycast handlers.
- [Scavenged assets look incoherent] → palette material override on every imported mesh.

## Migration Plan

Not applicable (greenfield). Ship = upload `dist/` to the `tech-ai-tools` S3 bucket; rollback = re-upload previous build.

## Open Questions

- Final prop choice for socials (phone vs sticky notes) — decide during M3 asset pass; spec only requires "contact hotspot".
- `frameloop="always"` vs `"demand"` — decide in M4 based on whether idle animations (blinking cursor) are kept.
