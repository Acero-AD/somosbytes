# Proposal: Add Techie Neon Vibe

## Why

The room reads as a generic cozy diorama — pleasant, but "anyone could have this portfolio". Diego's logo (neon-ringed avatar, magenta/purple/red) gives the site an identity; carrying its colors into the room as accent lighting, and filling the empty spots with developer-culture props, makes the space unmistakably his.

## What Changes

Decided with Diego: **cozy base + neon accents** (no dusk mode), with the full prop set:

- **Logo poster**: his provided avatar artwork (1200x1200 JPEG) as a glowing circular wall piece above the desk, cropped to its circle via geometry UVs.
- **Brand accent lighting**: neon magenta/purple added to the palette; two shadowless colored point lights washing the desk corner and lounge corner; the warm daylight base stays.
- **LED strips**: emissive magenta/purple bars under the desk edge and along the back-wall/floor seam.
- **Techie props**: a second angled monitor showing glowing code lines in brand colors (decor, not a hotspot), the Kenney laptop, a procedural 3D printer on a Kenney side table, and a procedural upright arcade machine with emissive screen and marquee.
- **Performance budget revision**: the prop set outgrows the current <120 draw-call ceiling; revised to <160 including the shadow pass, with the idle-zero-render rule unchanged (measured before/after).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `visual-experience`: new requirement for personal branding (logo artwork + brand accent colors in the scene); "Lighting without baking" modified to allow decorative accent lights; "Performance budgets" ceiling revised.

## Impact

- Code: `src/scene/palette.ts` (brand colors), `src/scene/Lights.tsx` (accent point lights), new `src/scene/objects/` components (LogoPoster, LedStrip, CodeMonitor, Printer3d, ArcadeMachine), `src/scene/Experience.tsx` placement, `KenneyModel.tsx` registry (laptop, sideTable).
- Assets: `public/branding/logo.jpg` (Diego's own artwork — credited as such), 2 more Kenney GLBs.
- No content-model, navigation, fallback, or hotspot changes; arcade and printer are decor only.
