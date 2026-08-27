# Design: Add Techie Neon Vibe

## Context

Base: cozy diorama at 108 draw calls, `frameloop="demand"` idle-zero-render, warm hemisphere+directional lighting. Diego's logo is a 1200x1200 JPEG (no alpha): a circular neon-ringed avatar over magenta/purple smoke. The Kenney kit remains in the session scratchpad for `laptop` and `sideTable`. Decided with Diego: cozy base + neon accents; props include his two additions (3D printer, arcade machine).

## Goals / Non-Goals

**Goals**: unmistakable personal identity (logo + brand colors), techie density, keep every existing budget and interaction guarantee.

**Non-Goals**: dusk mode; new hotspots (arcade/printer are inert decor); animated neon (would break idle-zero-render).

## Decisions

- **D1 — Logo crop via `circleGeometry` UVs**: three.js CircleGeometry maps UVs to the circle inscribed in the texture square — exactly the logo's circular footprint, so the JPEG's corners never render and no alpha channel is needed. `meshBasicMaterial` (unlit) makes it read as a lit sign; a slightly larger emissive ring plane behind it fakes the neon halo.
- **D2 — Brand palette additions**: `neonMagenta #e0218a`, `neonPurple #8b2fc9`, `neonRed #e8355a` in `palette.ts`; all accent props and lights derive from these.
- **D3 — Accent lighting**: two `pointLight`s (magenta over the desk corner, purple over the lounge corner), `castShadow` off — zero extra shadow passes (spec delta covers this). Intensities tuned visually against the warm base; hemisphere/directional untouched.
- **D4 — LED strips**: thin emissive `boxGeometry` bars (`meshBasicMaterial`), `castShadow` off: under the desk's front edge and along the back-wall/floor seam. Static — no animation, preserving idle-zero-render.
- **D5 — CodeMonitor**: second Kenney `computerScreen` angled beside the main one, with 4–6 thin emissive "code line" planes in brand colors + terminal green on its display. Decor only; placed clear of the pc hotspot hit box (air-gap rule from the decor spec).
- **D6 — Procedural Printer3d**: base slab + two uprights + gantry + bed + extruder block + tiny half-print cube, on a Kenney `sideTable`; only the body casts shadows.
- **D7 — Procedural ArcadeMachine**: upright cabinet (body, angled control deck with two button dots, screen inset with emissive brand-color "game" planes, emissive marquee). Placed against the left wall near the lounge corner; body casts shadows, emissive parts don't.
- **D8 — Budget**: estimate ~140–150 calls after additions (~+35–40 incl. selective shadow passes); ceiling re-specced to <160. Re-measure via `__glInfo`; drop-order if over: doormat-level filler first.

## Risks / Trade-offs

- [Neon overpowers the cozy base] → accent lights start low-intensity; tune via screenshots.
- [Logo JPEG looks dim as unlit texture against bright walls] → meshBasicMaterial + halo ring; if still flat, bump `toneMapped:false` on the logo material.
- [New props steal hotspot clicks] → same ≥0.25 air-gap rule and tap-test verification as the decor change.

## Migration Plan

Additive; rollback = revert commits.

## Open Questions

- Arcade marquee text/motif: plain brand-color bands vs tiny pixel-heart — decide visually.
