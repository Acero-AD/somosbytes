# Stage 4 — full-room furniture

Accepted 2026-09-10. Reading seating, oak tables/shelf, woven rugs/cushion, coat rack, and natural plants now share the studio material direction. Retained books, laptop, keyboard, mouse, and lamps have subdued finishes. Supports preserve the reading interaction and printer placement. Unused Kenney preloads and files were removed; retired provenance remains in assets.json.

[32 fixed comparison views and browser reports](stage-4/) cover both moods and desktop/mobile layouts, all focus/return paths and orbit extremes. Production passes with 360 startup calls, 168 settled calls, zero CSP violations and zero reduced-motion idle frames. Build passes; lint has 11 inherited warnings. Physical-phone performance remains pending.

Imported embedded images initially failed the existing blob-restricting CSP. The preparation pipeline now extracts them to colocated same-origin JPEG/PNG files referenced from ordinary decoder-free GLBs; the repeated production check passes without policy changes. Asset records contain image sizes, dimensions, source and checksums.

Rollback: restore stage-3 furniture placements and Kenney preloads/files from the baseline revision; keep the desk/chair, surfaces and environment. Stage-4 evidence preserves the accepted visual reference.
