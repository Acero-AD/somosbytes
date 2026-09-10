# Stage 3 — desk corner

Accepted 2026-09-10. The continuous 2.9 m oak desk and rounded charcoal office chair are original CC0 GLBs from the committed generator. Desk support height remains 0.77 m; monitors, keyboard, mouse, and phone retain their functional placement. Accessories now use charcoal hardware colors. The generic registry uses explicit per-asset scale and normalizes source bounds to a floor/support origin. Shared textures/geometry are reused, with only owned material clones disposed on unmount.

Evidence: [32 comparison views and metrics](stage-3/). All label focus/return checks pass. A separate PC link click opens the expected `https://scribe.somosbytes.es/` popup (destination stubbed), preserves PC focus, and returns with Escape. The focused screen remains aligned and desk props rest on the worktop. No hit-bound/camera recalibration was needed because the functional support dimensions were retained.

Production reports 354 startup calls, 165 settled calls, zero CSP violations and zero reduced-motion idle frames. Retired desk/chair models are absent from the preload list. Build passes; lint has the 11 inherited warnings and no new warnings. Exact requested file sizes and source/triangle/material information are recorded in the production report and asset inventory; physical-phone acceptance remains pending.

Rollback: restore the two Kenney desk modules/chair and their preload entries, then remove the StudioModel use from Experience. Prepared originals remain reproducible from the generator.
