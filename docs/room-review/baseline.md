# Stage 0 baseline — 2026-09-09

Source revision: `15c1fe76b5b8572397c6e7259a563b3414c06485`. Application code and runtime assets are unchanged. This checkpoint is **accepted for stage 1** following the user-approved startup/interactive budget clarification and the asset-direction decision in assets.md. Physical-phone acceptance remains a final-stage requirement.

## Recorded evidence

- 32 screenshots in [baseline/](baseline/): desktop 1280×720 and portrait 390×844; day/dusk; overview, PC, writing, CV, phone, arcade, and two clamped orbit extremes.
- [Portrait day measurements](baseline/mobile-day.json) and [portrait dusk measurements](baseline/mobile-dusk.json) include settled state, renderer counters, and interaction methods.
- [Production measurements](baseline/production.json) contain instrumented WebGL draw calls, response statuses, security policy, navigation timing, and reduced-motion behavior.
- [Asset inventory](assets.json) records the 21 existing GLBs and checksums. [Preparation guide](assets.md) records candidate sources, style criteria, preparation requirements, and the proposed byte allocation.

## Results

| Check | Result |
| --- | --- |
| `npm run build` | Pass; existing >500 KB chunk warning. Sandboxed prerender initially reported a port permission error; rerun outside sandbox completed cleanly. |
| `npm run lint` | Exit 0, 13 existing application warnings; no new script warnings. |
| Existing GLB files | 215,624 bytes total; 2,953 source triangles across unique files, 42 primitives. Source totals exclude repeated instances/custom geometry. |
| Production startup peak | **349 actual WebGL draw calls / 13,214 triangles** in one animation frame. Includes contact-shadow preparation and scene rendering. |
| Production settled overview | 173 actual WebGL draw calls / 6,604 triangles per sampled frame at 1280×720, DPR 1. |
| Portrait settled overview | 165 calls; focused views 72–100; sampled orbit extremes 170–173. These are existing renderer counters, not separate full-pass instrumentation. |
| Production asset requests | All 25 recorded resources returned 200, including all 21 GLBs; model response bytes match the inventory. |
| Production CSP | Actual `dist/_headers` policy attached by local server; zero captured policy violations; zero console errors. |
| Reduced-motion idle | Zero rendered frames during 1.5-second settled windows in production and portrait checks. |
| Hidden-tab handler | Zero rendered frames during a 1.5-second synthetic hidden-state/visibilitychange check. Actual OS background-tab scheduling is not validated by this check. |
| Browser | Chrome 152.0.7977.83 on this desktop; physical reference phone unavailable. Portrait viewport is emulation only, not mobile GPU acceptance. |
| Loading conditions | Local loopback, no network throttling, production responses `Cache-Control: no-store`. Navigation load event about 14 ms in the recorded reload; **not** time-to-interactive or a representative mobile cold load. Loader disappearance was separately awaited before steady sampling. |

Decoded image memory estimate: approximately 14.1 MiB for RGBA8 floor (1024² with mipmaps), wall (512² with mipmaps), logo (1200² with mipmaps), and arcade (176×136 without mipmaps). This excludes shadow/contact render targets, framebuffers, geometry, driver overhead, and transient CPU copies; it is not a measured GPU allocation. Existing GLBs contain no image payloads. Material/texture memory of future assets remains unmeasured.

The four portfolio labels were clicked and their focus states reached; Escape restored overview. The automated view matrix activates the arcade through the dev state hook. A separate real mesh click at portrait coordinates (173, 348) reached arcade screen mode, and Escape returned to overview successfully. PC screen UI alignment was visually inspected in its focused desktop capture. Full PC controls, game play/exit, physical touch behavior, and fallback/skip remain future acceptance checks.

Visual observations: the current dusk light strongly colors the architecture and furniture; the desktop focused PC UI aligns with its housing. Portrait overview crops some outer room edges, while the content labels remain visible in the inspected views. New assets must be checked against these fixed views rather than assuming all objects have spare framing space.

## Gate issue and proposed resolution

The design requires draw-call measurements including contact passes and resolution of baseline failures before proceeding. The existing `ContactShadows frames={1}` performs a one-time room capture; it is responsible for a large startup peak that the ordinary `__glInfo` snapshot does not expose. The same 349-call peak was reproduced in the production build, so this is not only a React development-mode effect.

Recommended artifact clarification for review: retain **fewer than 180 draw calls per interactive frame, including recurring shadow passes**, and record **one-time asset/environment/contact-shadow preparation separately** with startup cost evidence. This preserves the meaningful interaction budget while making the existing startup behavior explicit. The alternative is to keep the current all-frame limit and first implement a separate contact-shadow optimization (for example, a simplified shadow-only representation), with visual regression checks.

The user approved the recommended separation on 2026-09-09; the delta specification and design now reflect it. Stage 1 had not started when these measurements were captured. The desk/office-chair pairing is now specified as original oak/charcoal assets with matched proportions; the preparation guide records why this fits better than the worn industrial candidate.

## Reproduce

1. Check out the source revision being reviewed and run `npm run dev`.
2. Run `npm run build`, then `node scripts/review-room.mjs serve` in another terminal to serve the built security headers with caching disabled.
3. Run `node scripts/review-room.mjs capture baseline`. The consolidated runner captures fixed desktop/mobile views in both moods, waits for camera settlement, then records production draw calls and loading/idle results in a fresh browser session. It replaces the separate capture/measurement helpers originally used for this baseline.

Screenshots use reduced motion to stabilize comparisons; they are evidence, not pixel-perfect golden tests. Ambient dust positions are randomized on mount. The initial long capture session ended during portrait capture; both portrait batches were subsequently rerun successfully with bounded commands. Desktop screenshot evidence survived, but its aggregate JSON was not recovered.

Rollback for this stage: remove the added review documentation/scripts and the CREDITS link. No application behavior or model references have changed.
