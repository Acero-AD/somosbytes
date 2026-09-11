# Room asset preparation

Status: stages 1–4 accepted; final polish implemented; physical-phone acceptance pending. Runtime evidence is recorded per stage.

The current inventory is in `assets.json`. The existing Kenney attribution remains in `CREDITS.md`. Candidate pages and Poly Haven's [CC0 license](https://polyhaven.com/license) were checked on 2026-09-09. The candidate decisions below are historical; assets.json identifies the prepared and retired outputs.

## Shared direction and candidates

| Role | Candidate | Fit / preparation decision |
| --- | --- | --- |
| Floor | [Wood Floor](https://polyhaven.com/a/wood_floor) | Warm oak, subtle seams; source spans 1.7 m. Start with 1K diffuse, GL normal, roughness. |
| Walls | [Plastered Wall](https://polyhaven.com/a/plastered_wall) | Light plaster; inspect normal strength under magenta light before selection. |
| Environment | [Studio Small 09](https://polyhaven.com/a/studio_small_09) | Neutral studio candidate; compare with [Poly Haven Studio](https://polyhaven.com/a/poly_haven_studio) for natural daylight. One local 1K/2K HDR only. |
| Desk | Original oak/charcoal desk | Selected over the worn [Metal Office Desk](https://polyhaven.com/a/metal_office_desk); 2.9 × 0.77 × 0.75 m target, rounded edges and shared oak finish; export as CC0 plain GLB. |
| Office chair | Original rounded charcoal office chair | Create at approximately 0.65 m wide and 1.1 m high, with 0.46 m seat height, curved upholstered surfaces and metal base; export as CC0 plain GLB. |
| Lounge | [Mid Century Lounge Chair](https://polyhaven.com/a/mid_century_lounge_chair) | 1.2 m wide, approximately 6K source triangles; wood/leather option. Compare brown leather with the planned woven fabric elsewhere. |
| Plant | [Potted Plant 02](https://polyhaven.com/a/potted_plant_02) | Natural foliage candidate; inspect alpha cost and pot finish. Reuse maps across instances. |

Selection decision: use an original clean oak desk with charcoal metal legs and a rounded charcoal office chair, prepared as ordinary GLBs. This avoids the worn industrial desk and unavailable matching office-chair source. The desktop will remain 0.77 m high and approximately 2.9 m wide to preserve the current interaction composition. Use a subdued upholstered lounge (Modern Arm Chair 01 candidate), oak tables/shelves, and natural green Potted Plant 02 with a neutral pot. Compare all candidate finishes against light plaster and warm oak: charcoal seating/hardware provide contrast, foliage stays green, and magenta/purple remains an accent. Upholstery and wood maps will be shared where possible; candidate runtime dimensions/costs still require verification at their integration stage. Source triangle counts are descriptive website values, not measurements of prepared outputs. Avoid mixing worn industrial furniture, clean architectural finishes, and exaggerated low-poly props without adjustment.

## Proposed byte allocation

| Group | Ceiling allocation |
| --- | ---: |
| Floor and plaster maps | 2 MiB |
| HDR environment | 2 MiB |
| Desk corner models/maps | 2 MiB |
| Remaining furniture, seating, plants | 4 MiB |
| Retained models and final-detail reserve | 2 MiB |
| Total | 12 MiB |

These are allocations, not measured download sizes. Count unique runtime files before HTTP compression; embedded GLB maps are counted once. Record decoded texture memory separately: an RGBA8 1024² map is approximately 5.33 MiB with a full mip chain, regardless of JPEG file size. HDR textures and render targets require separate format-aware estimates.

## Preparation recipe and acceptance

1. Record the asset URL, license URL/evidence, author, download date, selected variant, and checksum before processing. Keep source packages outside `public/`.
2. In the chosen offline tool, normalize to meters, Y-up, and an explicit floor/support origin. Record tool/version, source bounds, rotation, scale, and final width/height/depth. Do not inherit Kenney's scale-of-two assumption.
3. Simplify only as needed, remove unused geometry/materials, and consolidate compatible materials while preserving interactive mesh boundaries. Record operations/settings so the export can be reproduced.
4. Export plain GLB using PNG/JPEG maps. Disable Draco, Meshopt, and KTX2/Basis; inspect both required/used extension lists and verify runtime loading under the deployed CSP.
5. Start textures at 1024²; use at most 2048² with recorded close-up justification. Use GL normals, sRGB color maps, and non-color normal/roughness data. Record real-world texture span and repeat orientation.
6. Add a prepared record to `assets.json` with output path, checksum, file bytes, bounds, triangle/material counts, image dimensions, decoded-memory estimate, and exact tool/recipe. Unknown fields stay null rather than being presented as verified.
7. Compare the prepared group in day/dusk overview and focus views before accepting it. Remove retired preload entries and reconcile the inventory with network requests.

## Reproducing the selected outputs

Only three scripts are maintained:

- `node scripts/prepare-room-assets.mjs all` downloads and prepares the selected CC0 maps, imported models and HDR. Use `surfaces`, `fabric`, or `imports` instead of `all` to rebuild one group. Requires Node, macOS sips and network access. Imported images are automatically extracted to colocated URLs to comply with the existing CSP.
- `node scripts/prepare-studio-furniture.mjs` rebuilds the original CC0 furniture using the locked Three.js version.
- `node scripts/review-room.mjs all` captures all four viewport/mood combinations, checks production loading/interactions/gameplay, and audits the asset inventory. Start `npm run dev` and, after `npm run build`, `node scripts/review-room.mjs serve` in separate terminals first. Requires the installed `playwright-cli`. Use `capture` for visual/CSP checks, `check` for acceptance without the full screenshot matrix, or `audit` for offline asset verification; an optional stage name defaults to `stage-5`.

The one-time pruning script was removed after retiring unused Kenney models. Original files remain recoverable from the baseline Git revision; the inventory retains their provenance. Preparation recipes and checksums are in assets.json. Review commands close their own browser session when finished.

The selected lounge is Modern Arm Chair 01 (8,916 source triangles); Potted Plant 02 has 69,806 triangles and shared textures across instances. The small desk plant skips shadow casting. Floor and fabric maps are shared by the original furniture. Real device performance remains a separate acceptance gate.
