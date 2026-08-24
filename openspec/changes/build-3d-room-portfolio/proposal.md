# Proposal: Build 3D Room Portfolio

## Why

Diego needs a personal portfolio site that gathers his projects, Substack, CV, and contact links in one memorable place. Instead of a standard landing page, the portfolio is an interactive 3D room where objects act as entry points to each section — a differentiator that itself demonstrates frontend/3D skills.

## What Changes

- Greenfield build of a single-page static site (`somosbytes`) using React 19 + React Three Fiber v9 + drei v10 + Vite 7 + TypeScript, with zustand for shared scene state.
- An interactive 3D corner-room diorama with four click-to-focus hotspots:
  - **PC monitor** → camera zooms into the screen showing a desktop-like UI with project icons (external links).
  - **Magazine stack** → Substack.
  - **Framed document** → CV PDF.
  - **Phone/sticky notes** → contact & social links.
- Click-to-focus camera navigation (overview → fly-to → back via Esc/back button/click-outside), touch-friendly.
- A plain semantic HTML fallback rendering the same content, used when WebGL is unavailable or the visitor opts out ("Skip 3D"), and always present in the DOM for SEO.
- Single typed content source consumed by both the 3D scene and the fallback.
- Free CC0 low-poly GLTF assets + procedural geometry; no Blender pipeline, no light baking.
- Fully static build output (`dist/`), deployed to SeQura's `tech-ai-tools` S3 bucket.

## Capabilities

### New Capabilities

- `portfolio-content`: single typed content source (projects, Substack URL, CV path, socials) consumed by both the 3D scene and the HTML fallback.
- `room-navigation`: camera state machine (overview/focused/screen), fly-to transitions, return paths (Esc, back button, click-outside), hotspot enablement rules, hover/touch interaction.
- `pc-screen-projects`: zoom into the monitor, desktop-style UI with project icons, external links in new tabs, click-gating during camera transitions.
- `html-fallback`: WebGL detection, `?no3d` + persisted "Skip 3D" opt-out, always-in-DOM semantic content for SEO.
- `visual-experience`: room layout, palette coherence across scavenged assets, lighting without baking, loading splash, performance budgets.

### Modified Capabilities

_None — greenfield project, no existing specs._

## Impact

- New codebase under `src/` (scene, state, content, UI overlay, fallback) plus `public/` assets (GLB models, CV PDF, icons).
- New dependencies: `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`; dev-only `leva`, `r3f-perf`.
- No backend, no APIs — all links are external (GitHub, Substack, CV PDF served statically).
- Hosting: static upload to the `tech-ai-tools` S3 bucket (access via Slack #ai-tools); build must be self-contained (no CDN-fetched assets at runtime).
