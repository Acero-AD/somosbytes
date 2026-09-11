# Stage 5 — final polish and acceptance

Implemented and browser-verified 2026-09-10. **Physical-phone acceptance remains pending; the change is not ready for archive.** OpenSpec tasks 6.7 and 6.8 remain open.

## Visual and object audit

[32 fixed day/dusk desktop/mobile comparisons](stage-5/) preserve the overview, orbit extremes, PC, reading, CV, phone and arcade poses. The final room uses warm oak, subtle plaster, charcoal hardware, fabric, leather and natural foliage. Both monitors now have beveled charcoal housings and metal stands authored around the established display anchors. Their display planes, code content and PC HTML retain their dimensions and focus poses. The mobile PC link remains clickable and aligned.

The phone, printer and arcade have modest edge detail; printer hardware uses a restrained metal finish. The arcade retains its screen mapping, accent marquee and controls. Window frame, artwork/CV frame, platform and baseboards have softened edges; the decorative sun/cloud and moon/star views remain readable in their respective moods. Books, keyboard/mouse, laptop and lamps retain their simple geometry with subdued finishes. Original furniture uses shared oak and fabric maps; the imported leather chair and foliage retain authored maps. Rugs/cushion, tables, shelf and coat rack fit the same proportions and finishes. Supported objects remain at the established desk (0.77 m), coffee table (0.46 m) and printer-table (0.77 m) heights. No camera or hotspot anchor changes were necessary.

## Verification

- `npm run build`: passes, including prerender. Existing large-chunk advisory remains. Final bundle: `Scene3DApp-DH3fEsK-.js`.
- `npm run lint`: no errors, 11 inherited warnings; no new warnings. `git diff --check` passes.
- [Production report](stage-5/production.json): actual hosting CSP, fresh browser session, local no-store HTTP server, no network throttling. All asset requests succeed, zero CSP violations, zero settled reduced-motion frames. Desktop overview has 171–172 full-pass draw calls; one-time startup peak is 368 and is reported separately under the approved budget clarification.
- [Production interactions](stage-5/interactions.json): both moods survive reload; Projects/Writing/CV/Contact focus and return; the PC link opens its expected destination (stubbed); real arcade mesh click plus keyboard input/exit; forced fallback and re-entry. Zero console/page errors. Peak across the measured mobile-viewport interaction sequence is 164 draw calls including recurring shadows.
- [Gameplay](stage-5/gameplay.json): desktop touch emulation starts and steers the real Snake engine, confirms advancing ticks, pauses on synthetic visibility change, produces zero additional settled hidden frames/ticks, resumes by keyboard and resets on exit. This is not an OS-background or physical-phone measurement.
- [Loading](stage-5/loading.json): Skip 3D works while six surface requests are deliberately delayed; after re-entry all six maps return 200 before loading completes.
- [Asset audit](stage-5/asset-audit.json): 37 unique requested scene files, **9,778,972 bytes (9.33 MiB)** against 12 MiB. Checksums, local bytes, used/required decoder extensions and recorded texture dimensions pass. All image maps are 1024²; HDR is 1024×512. Decoded image estimate is 106.67 MiB with mipmaps, excluding HDR/PMREM, shadow targets and generated UI textures; it is not total GPU allocation. The HDR source is about 4 MiB as RGBA half-float before environment conversion.

The browser test initially clicked the cabinet before the return transition had settled and used a heading selector also matching the hidden fallback. Corrected waits and scoped selectors pass. Hidden-game idle sampling now waits for outstanding transition frames to settle; no application behavior was changed to make these tests pass.

## Remaining device gate

No physical reference phone was available. Record device model, OS, browser, viewport, DPR, power/thermal state and network/cache conditions. On the production build, warm the scene and capture three focus/return repetitions for PC, reading and arcade in each mood. Measure visible-frame p95 (at most 33.3 ms), all-pass calls (under 180), and canvas DPR (at most 2). Separately check actual background-tab zero frames and settled reduced-motion zero frames. Keep cold-load timings separate. Desktop emulation does not close this gate.

## Rollback references

Baseline Git revision: `15c1fe76b5b8572397c6e7259a563b3414c06485`. Stage-specific visual/metric references are retained in [baseline](baseline.md), [stage 1](stage-1.md), [stage 2](stage-2.md), [stage 3](stage-3.md) and [stage 4](stage-4.md), each with its rollback instructions. The implementation is split into atomic commits: `88bea65` plan/baseline, `556827d` compact tooling/provenance, `a6b1300` architectural surfaces, `e3fee80` environment lighting, `581a6ff` interactive housings/custom props, and `20721b3` furniture/foliage. The original staged captures record the development checkpoints; commit boundaries group independent code changes and need not exactly match those historical captures. Restore the baseline files to revert the complete change; use the stage reports and preparation scripts for selective reconstruction.

To roll back stage 5 alone, restore Kenney monitor references/preloads and `computerScreen.glb` from the baseline revision, and replace BeveledBoxGeometry uses in custom props/Room with their former boxGeometry/material values. Keep the stage-4 furniture, surfaces and lighting. Assets and provenance remain reproducible from the scripts and inventory. Nothing has been pushed, published or archived.

## Lounge color follow-up

The lounge cushions now use a warm tan base color (`#bb9167`), replacing their black color map while retaining the imported normal and roughness maps. The floor cushion uses the same tan color with its fabric maps; the wooden frame and desk chair are unchanged. [Day](stage-5/lounge-tan-day.png) and [dusk](stage-5/lounge-tan-dusk.png) previews record this color-only follow-up; the refreshed final comparison matrix includes both tan cushions.

## Compact tooling and commit verification

The 13 helpers were consolidated into three scripts: asset preparation, original furniture generation, and room review. `node scripts/review-room.mjs all` passes the refreshed four-view matrix, production-CSP measurements, PC/fallback interactions, loading/Skip 3D, gameplay and offline asset audit. The refreshed matrix includes the tan lounge and floor cushion. All four application-code commits also pass TypeScript builds from isolated exports of their own trees. Build and lint pass with the previously recorded warnings. Physical-phone acceptance is still pending.
