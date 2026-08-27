# Tasks: Add Techie Neon Vibe

## 1. Branding

- [x] 1.1 Copy the logo JPEG to `public/branding/logo.jpg`, note it in `CREDITS.md` (Diego's own artwork); add `neonMagenta`/`neonPurple`/`neonRed` to `palette.ts`
- [x] 1.2 Create `scene/objects/LogoPoster.tsx` (circleGeometry UV-crop + emissive halo ring) and place it above the desk on the back wall; verify by screenshot from overview

## 2. Neon lighting

- [x] 2.1 Add two shadowless brand-colored point lights to `Lights.tsx` (desk + lounge corners), intensity tuned by screenshot against the warm base
- [x] 2.2 Create `scene/objects/LedStrip.tsx` (emissive bar) and place under the desk front edge and along the back-wall/floor seam; verify glow by screenshot

## 3. Techie props

- [x] 3.1 Copy `laptop` + `sideTable` GLBs from the kit, register in `KenneyModel.tsx`; place laptop on the coffee table area
- [x] 3.2 Create `scene/objects/CodeMonitor.tsx` (Kenney screen + emissive code lines) angled on the desk, clear of the pc hit box
- [x] 3.3 Create `scene/objects/Printer3d.tsx` on a side table (right wall area)
- [x] 3.4 Create `scene/objects/ArcadeMachine.tsx` (emissive screen + marquee) against the left wall near the lounge

## 4. Verify & ship

- [ ] 4.1 Playwright: all 4 hotspots focus on desktop and 390x844; labels unobstructed; overview + orbit-extreme screenshots show logo/neon/props without occluding hotspots
- [ ] 4.2 Budgets: draw calls <160 via `__glInfo`, idle renders zero frames, no console errors
- [ ] 4.3 `npm run build && npm run preview` click-through; commit per task group; push
