## Why

The portfolio's Kenney furniture, generated surface patterns, and simple lighting create a stylized room. Move toward a believable miniature studio through small, independently reviewable stages so visual consistency, loading cost, and interaction quality can be checked before expanding the asset replacement.

## What Changes

- Keep the corner diorama, navigation, portfolio content, day/dusk modes, and magenta/purple identity.
- Establish a shared material direction: warm wood, light plaster, dark metal, woven fabric, and natural foliage.
- Introduce self-hosted physically based floor/wall textures, followed by environment lighting balanced for both moods.
- Replace the desk and office chair first, then seating and plants, then remaining visible furniture and simplified custom props; preserve interactive screens and recalibrate their placement where needed.
- Add a repeatable asset preparation and provenance record, plus visual, interaction, loading, and performance checkpoints after each stage.
- Preserve CC0 assets, the current security policy, decoder-free GLB loading, and existing rendering budgets. Compression requiring runtime decoders is outside this change.

## Capabilities

### New Capabilities

- `scene-asset-pipeline`: Documented, self-hosted, decoder-free assets with provenance, size limits, and staged acceptance evidence.

### Modified Capabilities

- `visual-experience`: Replace the low-poly and generated-only finish requirements with coherent realistic materials and furniture; extend lighting to a local environment map while preserving the diorama and existing interaction/performance requirements.

## Impact

- Primarily `Room.tsx`, `Lights.tsx`, `Experience.tsx`, the Kenney model loader, object components, palette/material definitions, and local model/texture/environment assets.
- Model-dependent dimensions in `Pc.tsx`, desk heights, hotspot bounds, and camera focus targets need verification when geometry changes.
- Asset provenance in `CREDITS.md` and preparation/checkpoint documentation will grow. Existing Three.js/drei capabilities should suffice; offline asset preparation tooling may be needed.
- No backend, hosting policy, public navigation, or portfolio-content changes. No application implementation is included in this proposal.
