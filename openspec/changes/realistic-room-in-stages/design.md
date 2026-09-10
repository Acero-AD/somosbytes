## Context

The current React Three Fiber scene uses a six-unit corner room, 21 small Kenney GLBs, generated color textures, and a directional shadow light with cached contact shadows. `Lights.tsx` interpolates day/dusk settings; the renderer uses a demand loop with explicit ambient animation. Furniture positions, desk heights, monitor HTML transforms, and hotspot targets depend on the existing geometry.

The current specs require a low-poly palette, generated-only architectural textures, CC0 assets, fewer than 180 draw calls including shadows, and zero settled frames for reduced motion. Hosting forbids WebAssembly compilation and external decoder requests. This change replaces the aesthetic constraints while retaining the performance, accessibility, navigation, and hosting contracts.

## Goals / Non-Goals

**Goals:**
- Create a coherent realistic miniature studio with warm wood, light plaster, charcoal metal, woven fabric, natural foliage, and magenta/purple accents.
- Deliver small stages that can be inspected and reverted independently, with repeatable evidence before moving on.
- Preserve the full portfolio and arcade interactions, mood persistence, fallback, and mobile usability.

**Non-Goals:**
- First-person navigation, an enclosed walk-through room, a renderer migration, path tracing, or a new UI.
- Baked scene lighting, real-time global illumination, postprocessing effects, runtime model decoders, or security-policy relaxation.
- Buying assets, replacing branding/content artwork, or building a general asset-management service.

## Decisions

### 1. Retain the diorama and use one material direction

The existing camera and interaction composition are the foundation. The palette continues to govern architecture, accents, and custom props; imported assets retain authored PBR maps instead of being indiscriminately recolored. Evaluate candidates together under both moods. Light wood, subdued plaster, dark hardware, restrained fabric colors, and natural foliage are the selection criteria. A fully enclosed realistic room would require a separate navigation and lighting design.

Minor props can remain if they visually fit after material/edge adjustments. Completion requires evaluating every visible prop, including the code monitor, phone, arcade, printer, rugs, books, and decorative window; merely replacing the Kenney furniture is insufficient.

### 2. Prepare local assets before integration

Use Poly Haven and ambientCG as initial CC0 candidate sources, verifying each chosen asset's own page and license during implementation. No exact downloads are committed by this proposal. Keep a manifest recording source URL, license, downloaded variant, preparation recipe/tool version, output path, dimensions, triangle/material counts, texture sizes, and bytes. Link it from `CREDITS.md`.

Normalize model units to meters, record orientation and intended floor/support origin, and export ordinary GLB with PNG/JPEG textures and no decoder-dependent extensions. Offline simplification, pruning, material consolidation, texture resizing, and geometry baking are allowed; do not blindly use an optimizer's compression defaults. Start with 1K texture maps, at most 2K for visibly justified close-up surfaces; use one environment of at most 2K. Set an initial 12 MiB ceiling for total uncompressed-on-wire file bytes of unique scene models, textures, and environment assets requested before interaction (embedded textures counted only within their GLB). This is a proposed ceiling, not a measured prediction. If it cannot be met, simplify/select different assets before changing the budget in a later proposal.

PNG/JPEG costs more GPU memory than KTX2 but preserves the current loader/security contract. KTX2, Draco, and Meshopt are deferred. File size is not a GPU-memory measurement: inventory decoded texture memory separately during checkpoints.

### 3. Upgrade architecture independently of furniture

Replace the floor/wall generated maps with local color, OpenGL normal, and roughness maps on standard materials. Configure color maps as sRGB and data maps as non-color data; choose repeat/UV scale in world units so grain and plaster detail remain plausible on differently sized surfaces. Keep normal detail subtle. Add modest geometric bevels to exposed platform/trim edges during polish. Avoid displacement subdivision and expensive physical-material features by default.

The first surface stage includes both walls and the floor so the architectural shell remains coherent even while existing furniture is retained.

### 4. Add a static lighting environment, with mood-aware intensity

Load a local HDR environment through drei using an explicit local file, without replacing the designed backdrop. Keep one directional shadow light, cached contact shadows, and shadowless accent lights. Rebalance ambient fill, directional strength, environment intensity, and exposure so wood/plaster stay readable and neon retains detail in both moods. Interpolate environment intensity with the existing mood transition and stop invalidation after settling.

The environment provides reflection/fill cues; it does not provide interior occlusion or light through walls. Keep the window a decorative outside view, improve its frame and sky treatment during polish, and align the apparent daylight direction with the window where practical. Real apertures and baked bounce lighting would enlarge scope and complicate day/dusk transitions.

### 5. Make model placement explicit, preserve interaction anchors

Introduce a small generic static model wrapper/asset registry alongside the Kenney wrapper. Keep decoder flags disabled in both load and preload paths. Registry entries carry per-asset scale/orientation and support dimensions; do not apply Kenney's blanket scale of two to new assets. Share geometry/textures and clone materials only when an instance requires modification, including multi-material meshes.

Replace a complete functional group at each stage. The desk corner includes both desk modules (or one correctly sized replacement), chair, keyboard, mouse, and nearby props. Recalculate support heights while initially retaining the interactive monitor to isolate risk. When replacing a monitor or other interactive housing during polish, update its display anchor, hit bounds, and camera focus together. Preserve the PC HTML UI and arcade canvas behavior. Avoid joining interactive meshes into decorative batches. Remove unused preloads when assets are retired so loading cost reflects the visible scene.

### 6. Use sequential evidence gates, not a large final review

Keep a checkpoint report with a stable camera/viewport matrix and asset inventory. Capture desktop landscape and mobile portrait overview, orbit extremes, and focused PC/reading/arcade views in both day and dusk. Compare to the previous passing stage for placement, scale, surface detail, readable screens, shadows, neon clipping, and style consistency.

At each stage: run build/lint; exercise mood persistence, all hotspots, screen controls, and return navigation; measure interactive draw calls including recurring shadow passes, and record one-time environment/contact preparation separately, triangles, scene bytes, and decoded texture memory; inspect loading and console/network output under the actual production CSP. Explicitly check hidden-tab and reduced-motion idle behavior after lighting changes and in the final pass. GPU/frame captures must include all passes; the existing `__glInfo` hook alone may miss multipass work. Record a fixed device/browser and camera-transition frame timings, targeting p95 frame intervals at most 33.3 ms on the reference mid-range phone. CPU-throttled desktop checks are preliminary and must not be reported as proof of mobile GPU performance.

Each stage must leave a runnable scene. If a gate fails, resolve it within that stage or revert that stage; do not accumulate regressions. Intermediate mixed assets are acceptable only when their finish/scale fit the shared direction. The full change is complete only after every gate passes. These are implementation checkpoints, not additional user-approval requirements.

## Risks / Trade-offs

- High-resolution assets increase startup and GPU memory → resize, reuse maps, simplify, inventory costs, and enforce the scene-byte ceiling.
- Detailed foliage/materials exceed draw-call or transparency budgets → choose simpler plants, consolidate compatible materials, and limit shadows on minor props.
- Furniture swaps break screen alignment or clicks → separate static asset migration from interactive housing changes and verify focused views immediately.
- An HDR fill washes out dusk or produces implausible reflections → use a neutral environment, conservative intensity, and fixed day/dusk comparisons.
- Cached contact shadows omit new geometry → ensure the shadow capture occurs after all relevant assets mount and verify contact after each swap.
- Baseline already fails a budget → record it in stage 0 and resolve it before expanding the scene; do not claim inherited failures as passing evidence.
- A suitable CC0 replacement may not exist → refine the existing geometry/materials or create a simple original asset consistent with the same style; document original authorship and CC0 dedication for new reusable 3D assets.

## Migration Plan

| Stage | Deliverable | Gate before next stage |
| --- | --- | --- |
| 0 | Baseline evidence, shared material reference, candidate manifest | Reproducible views/metrics; coherent candidates and budget allocation |
| 1 | PBR floor and both walls | Correct texture scale, both moods readable, local loading and budgets pass |
| 2 | Local environment and balanced lights | Reflection/shadow quality, smooth mood transitions, idle/CSP checks pass |
| 3 | Complete desk corner | Support heights, chair proportions, PC/phone focus and controls pass |
| 4 | Reading area, shelves, plants, remaining furniture | All overview/orbit compositions, reading interaction and full-room coherence pass |
| 5 | Interactive housings and architectural/decorative polish | Full visual, loading, mobile, accessibility, and interaction acceptance |

Use separate commits or reviewable diffs for stages. No visitor-facing migration toggle is required. Revert the relevant stage's code and asset references to roll back; do not delete source/preparation records needed to reproduce earlier outputs. Stage checks happen locally; preview publishing follows the normal project workflow and is not required merely to prepare a checkpoint. Archive only after all stages are implemented and verified.

## Open Questions

- Exact model/texture/HDR selections and their measured costs are stage-0 outputs.
- The available reference phone/browser must be recorded before performance acceptance; if unavailable, record mobile validation as pending.
- Which existing small props can meet the final style through refinements is determined by the fixed-view audit, not by requiring every object to be replaced.

## References

- Asset candidates: https://polyhaven.com/ and https://ambientcg.com/
- Environment integration: https://drei.docs.pmnd.rs/staging/environment
- Standard material maps: https://threejs.org/docs/pages/MeshStandardMaterial.html
- Offline inspection/preparation: https://gltf-transform.dev/cli

## Approved budget clarification — 2026-09-09

The user approved distinguishing interactive frames (fewer than 180 calls including recurring shadows) from one-time startup preparation. Baseline production startup is 349 calls versus 173 settled. Startup peaks and loading conditions remain recorded; this is not permission for recurring frames to exceed the budget.
