# Stage 2 — environment and mood lighting

Accepted 2026-09-10. A self-hosted 1024×512 HDR (1,615,248 bytes) adds static reflection/fill; environment intensity interpolates with the existing day/dusk lights. The backdrop remains unchanged, with one directional shadow caster and shadowless brand accents. The shared Suspense boundary waits for the environment before the room/contact capture mounts.

Evidence: [four view batches and production report](stage-2/). All 32 views and label focus/return checks pass. Floor grain and wall texture remain readable in dusk; neon accents are visible without the previous broad saturated wash. Production startup is 370 calls (including environment preparation), settled overview 173; all assets load successfully under the existing CSP. Reduced-motion settled frames: 0. A separate synthetic hidden-state check also records 0 idle frames; physical background-tab/mobile acceptance remains pending.

Scene model/surface/environment files total 3,363,500 bytes. HDR RGBA half-float storage is approximately 4 MiB before PMREM targets/mips; the six PBR maps remain approximately 32 MiB. Build passes. Two new lint warnings from assigning a hook-returned scene field were resolved by updating the frame callback's scene instead; the animation behavior is the same and subsequent stage checks cover it.

Rollback: restore Lights.tsx to stage-1 lighting; keep prepared HDR/provenance for reproduction.
