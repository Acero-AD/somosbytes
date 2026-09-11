## RENAMED Requirements

- FROM: `### Requirement: Coherent low-poly aesthetic`
- TO: `### Requirement: Coherent realistic diorama aesthetic`

## MODIFIED Requirements

### Requirement: Performance budgets
The experience SHALL clamp device pixel ratio to at most 2, keep interactive frames under 180 draw calls including recurring shadow passes, and remain smooth (no perceptible stutter during camera transitions) on a mid-range phone. Rendering SHALL stop entirely (zero frames) when the tab is hidden, and for reduced-motion visitors the settled scene SHALL render zero frames; otherwise ambient life MAY render continuously while the page is visible. The canvas container SHALL use dynamic-viewport sizing (`100dvh`) so mobile browser chrome does not clip the scene.

#### Scenario: Mobile performance
- **WHEN** the site runs on a mid-range phone (or DevTools 4x CPU throttle emulation)
- **THEN** camera fly-to transitions play smoothly and interaction remains responsive

#### Scenario: High-DPI displays
- **WHEN** the site runs on a 3x-DPI device
- **THEN** rendering resolution is clamped to 2x, keeping GPU load bounded

#### Scenario: Hidden tab renders nothing
- **WHEN** the tab is hidden
- **THEN** no frames render until it becomes visible again


One-time asset, environment, and contact-shadow preparation SHALL be measured separately from interactive frames. Checkpoint reports SHALL record startup peak draw calls and loading conditions; startup work SHALL NOT recur during ordinary interaction.

#### Scenario: Startup preparation is accounted separately
- **WHEN** assets and cached shadows are prepared on initial load
- **THEN** the report records their startup draw-call peak separately, and subsequent interactive frames remain below 180 calls including recurring shadow passes


### Requirement: Coherent realistic diorama aesthetic
The room SHALL present a coherent realistic miniature studio with plausible furniture proportions, warm wood, light plaster, dark hardware, fabric seating, and natural foliage. The shared palette SHALL govern architecture, accents, and custom props; imported materials SHALL retain authored surface maps when consistent with that direction instead of requiring blanket palette overrides. Imported 3D assets, surface textures, and lighting environments SHALL be CC0 licensed. The corner diorama and personal branding SHALL be preserved.

#### Scenario: Mixed assets look uniform
- **WHEN** props from different sources are viewed together in overview and focused views in day and dusk
- **THEN** their scale, material finish, and colors fit the shared studio direction, with no conspicuous mismatch between realistic furniture and retained simplified props

#### Scenario: Interactive props fit the final style
- **WHEN** the completed room's monitor, phone, arcade, printer, rugs, books, and window are inspected
- **THEN** their geometry and finishes fit the same material direction while their existing interactive content remains usable

### Requirement: Lighting without baking
The scene SHALL use ambient/fill lighting, one shadow-casting directional light, pre-rendered contact shadows, and a self-hosted static environment map for material reflections and fill. Shadowless colored point lights and emissive materials SHALL preserve the brand accents. Day/dusk environment intensity SHALL transition with the existing mood lighting while keeping screens, labels, and materials readable. The build SHALL NOT fetch lighting assets from external CDNs at runtime or require baked scene lighting.

#### Scenario: Self-contained production build
- **WHEN** the production build runs with the network restricted to the site's own origin
- **THEN** the scene and environment render fully lit with no failed external requests or CSP violations

#### Scenario: Accent lights cast no shadows
- **WHEN** the neon accent lights are active
- **THEN** they add no shadow-map passes and the directional light remains the only shadow caster

#### Scenario: Environment follows the mood
- **WHEN** the visitor changes day/dusk mode
- **THEN** reflection/fill intensity transitions smoothly with the lighting, the designed backdrop stays visible, and screens and labels remain readable

#### Scenario: Lighting settles for reduced motion
- **WHEN** a reduced-motion visitor completes a mood transition with no active minigame
- **THEN** the environment causes no continued invalidation and the settled scene renders zero frames

### Requirement: Architectural finish
The floor SHALL read as wood planks and the walls SHALL carry a subtle plaster finish using self-hosted physically based color, normal, and roughness textures. Texture scale and orientation SHALL be plausible across the room and visible close-ups. Baseboards SHALL run along both walls, with modest edge detail on exposed trim and platform geometry. The finish SHALL fit the shared warm studio palette.

#### Scenario: Finish visible, self-contained
- **WHEN** the production build runs with the network restricted to the site's own origin
- **THEN** plank lines, plaster surface detail, and baseboards render with no failed or external texture requests

#### Scenario: Detail responds to lighting
- **WHEN** the visitor views the floor and walls from overview and focused camera poses in both moods
- **THEN** surface detail and roughness respond to lighting without oversized grain, stretched patterns, excessive bumps, or distracting tiling seams

### Requirement: Room decoration
The room SHALL include non-interactive decoration (wall art, a decorative window, seating, lamps, and filler props) that follows the shared realistic material direction and CC0 asset rule. Decoration SHALL NOT intercept pointer events intended for hotspots, SHALL NOT occlude any hotspot from the overview pose or its clamped orbit range, and flat or minor decor SHALL skip the shadow pass. The window SHALL retain mood-appropriate sky elements and use a frame/finish consistent with the room.

#### Scenario: Decor never steals hotspot clicks
- **WHEN** the visitor clicks or taps each portfolio hotspot or the arcade from overview
- **THEN** the intended interaction activates exactly as before decoration was changed

#### Scenario: Hotspots stay visible
- **WHEN** the visitor orbits the overview camera to its configured limits
- **THEN** every hotspot and its associated label remains visible, unobstructed by decoration

## ADDED Requirements

### Requirement: Asset replacements preserve interaction alignment
Furniture and interactive housing replacements SHALL preserve supported-object placement, screen alignment, hotspot hit bounds, and camera focus. All portfolio content, PC controls, and arcade behavior SHALL remain available.

#### Scenario: Desk corner remains functional
- **WHEN** the visitor focuses the PC or phone after the desk corner replacement
- **THEN** props rest on the desk, the camera frames the intended object, the PC UI fits its display, and pointer interaction works

#### Scenario: Other focused objects remain functional
- **WHEN** the visitor focuses the reading area, CV frame, or arcade after room replacements
- **THEN** the intended content is framed and usable, arcade start/play/exit still work, and return navigation restores overview
