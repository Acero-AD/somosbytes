# Stage 1 — architectural materials

Accepted 2026-09-10. Floor and both walls use six self-hosted 1024² PBR maps, 1,532,628 bytes total, with world-unit face UVs and subtle normal scales. The scene requests 1,748,252 bytes of model/surface files before interaction, excluding existing branding and JavaScript. Six RGBA8 maps with mipmaps are approximately 32 MiB of decoded texture storage (shared across walls, excluding render targets and branding).

Evidence: [four view batches and production report](stage-1/). All 32 overview/focus/orbit screenshots were captured; sampled view counts stay at or below 173. Production instrumentation reports 349 startup calls and 172 settled calls. No CSP violations, asset failures, or reduced-motion idle frames. Build passes; lint exits 0 with 11 inherited application warnings.

`check-room-loading.js` delayed all six texture requests: Skip 3D successfully unmounted the canvas; re-entry/reload loaded every map with status 200 before loader dismissal. RoomSurface suspends inside the shared scene boundary, so surface readiness is part of initial scene loading. The first loading-test attempt had a route-cleanup race; `unrouteAll({behavior:'wait'})` resolved it and the rerun passed.

Visual review: grain scale and plaster detail are consistent across faces; focused PC content still aligns. The dusk floor is dark under the existing lighting, which stage 2 will rebalance with local reflection/fill. All portfolio label focus/return checks pass. Physical-phone GPU performance remains pending final acceptance.

Rollback: restore Room.tsx to the baseline generated maps and remove RoomSurface.tsx references. Asset preparation and provenance records remain available for reproduction.
