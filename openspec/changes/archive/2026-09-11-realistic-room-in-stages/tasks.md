## 1. Stage 0 — Baseline and coherent asset selection

- [x] 1.1 Create a checkpoint report with fixed desktop landscape/mobile portrait viewports and overview, orbit-extreme, PC, reading, and arcade poses in day and dusk; capture the current scene and exercise all hotspots.
- [x] 1.2 Record baseline build/lint results, cold-load conditions, unique scene bytes, draw calls including all shadow/contact passes, triangles, decoded texture-memory estimates, and hidden-tab/reduced-motion behavior; record the reference phone/browser and any unavailable checks explicitly.
- [x] 1.3 Assemble a shared material reference and shortlist CC0 floor, plaster, environment, desk, chair, seating, and plant candidates; compare their scale/finish together and allocate the 12 MiB scene budget across stages.
- [x] 1.4 Create the asset manifest/preparation documentation and link it from CREDITS.md; record source/license evidence and required normalization/export settings, including no decoder-dependent extensions.
- [x] 1.5 Close stage 0 with reproducible baseline evidence and a coherent candidate set; resolve baseline requirement failures before expanding the scene and retain the report with the stage diff.

## 2. Stage 1 — Realistic architectural surfaces

- [x] 2.1 Prepare local floor/plaster color, OpenGL normal, and roughness maps within texture limits; record provenance, byte sizes, decoded memory estimates, and any 2K justification.
- [x] 2.2 Introduce shared surface-material definitions and apply them to the floor and both walls with correct color spaces, world-scale UV repeats, and subtle normal strength; keep baseboards and room click behavior.
- [x] 2.3 Include the new textures in initial loading readiness and verify cold-load progress, Skip 3D, and no visible surface pop-in.
- [x] 2.4 Close stage 1: run build/lint and the checkpoint matrix; verify both moods, texture scale, all hotspot navigation, full-pass draw calls, scene bytes, and successful local requests under production CSP; fix or revert failures before stage 2.

## 3. Stage 2 — Environment and day/dusk lighting

- [x] 3.1 Prepare and document one local environment at most 2K wide; load it explicitly without replacing the backdrop or enabling an external preset/decoder.
- [x] 3.2 Balance environment fill/reflections, existing ambient/directional lighting, and accent strengths for day and dusk; preserve one shadow-casting light and refresh contact shadows after scene assets are ready.
- [x] 3.3 Integrate environment intensity with mood interpolation/persistence and ensure lighting stops invalidating when settled for reduced-motion visitors.
- [x] 3.4 Close stage 2: repeat build/lint and visual/loading/interaction/budget checks, verify neon and screen readability, and measure hidden-tab and reduced-motion zero idle frames under the production CSP.

## 4. Stage 3 — Desk corner as the first furniture group

- [x] 4.1 Prepare the selected desk and office chair as ordinary GLBs; normalize dimensions/orientation, simplify and consolidate materials as needed, and complete their asset records.
- [x] 4.2 Add a minimal generic model wrapper/registry with explicit transforms/support dimensions, shared resources, safe optional multi-material overrides, and disabled decoders in load/preload paths.
- [x] 4.3 Replace both desk modules or their combined equivalent and the office chair; recalibrate desk height and position keyboard, mouse, plants, phone, and both monitors on their intended supports.
- [x] 4.4 Refine or replace desk accessories to fit the material direction, retaining the existing interactive monitor initially; adjust PC/phone hit bounds, labels, and camera targets only where required by the new placement.
- [x] 4.5 Remove retired desk/chair preloads and close stage 3 with build/lint, the full checkpoint matrix, PC controls and phone interaction, all hotspot reachability, and measured loading/rendering budgets under production CSP.

## 5. Stage 4 — Extend the style through the room

- [x] 5.1 Prepare and integrate coherent reading-area seating, coffee/side tables, fabric/rugs, and cushions; update magazine/laptop support placement and verify the reading interaction immediately.
- [x] 5.2 Prepare and integrate shelves, lamps, coat rack, and remaining furniture; preserve room spacing and keep every hotspot/label visible at orbit limits.
- [x] 5.3 Replace plants with suitable natural foliage; limit material/alpha/shadow costs, reuse repeated assets, and record model/texture metrics and provenance.
- [x] 5.4 Reconcile retained books and small props with the same style, remove unused preloads/assets, and update the inventory to reflect actual initial network requests.
- [x] 5.5 Close stage 4 with build/lint, day/dusk desktop/mobile comparisons, reading and all other interactions, loading/CSP results, and full-pass draw-call/asset-budget evidence; resolve style mismatches before final polish.

## 6. Stage 5 — Interactive details and final acceptance

- [x] 6.1 Refine or replace monitor housings and recalibrate display planes/HTML transforms, support placement, hit bounds, labels, and focus poses together; verify PC controls and code-monitor content at desktop/mobile sizes.
- [x] 6.2 Audit/refine phone, printer, arcade, and remaining custom props for coherent materials and modest edge detail; preserve arcade screen mapping, start/play/exit controls, and contact/CV content.
- [x] 6.3 Refine window frame and day/dusk sky treatment, exposed trim/platform edges, and remaining decorative finishes while retaining branding and the open diorama composition.
- [x] 6.4 Perform final asset cleanup and update provenance/preparation records; verify every loaded model is decoder-free, the scene fits 12 MiB, and all textures/environment meet the dimension limits.
- [x] 6.5 Run build/lint and a production-CSP browser acceptance pass: cold loading, mood persistence, every hotspot and return path, PC controls, arcade gameplay/exit, Skip 3D/fallback, missing requests, and console errors.
- [x] 6.6 Capture final day/dusk desktop/mobile overview, orbit extremes, and focused comparisons; document that every retained/replaced object fits the shared material direction and no screen, label, shadow, or support alignment regressed.
- [x] 6.7 Record physical reference-phone performance across three warmed focus/return repetitions for PC, reading area, and arcade in both moods; verify p95 frame intervals at most 33.3 ms, fewer than 180 draw calls including shadows, DPR at most 2, and hidden-tab/reduced-motion zero idle frames. Keep mobile acceptance pending if no device is available.
- [x] 6.8 Close the final checkpoint only when all stage evidence passes; document each stage's rollback reference and mark the change ready for archive without archiving or publishing as part of this task.
