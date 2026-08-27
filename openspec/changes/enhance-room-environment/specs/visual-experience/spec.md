# visual-experience

## ADDED Requirements

### Requirement: World beyond the room
The diorama SHALL sit on a visible platform so the surrounding space reads as a designed backdrop rather than a void, and the window SHALL show an outside view (sky elements) consistent with the active mood.

#### Scenario: Room grounded on a platform
- **WHEN** the visitor views the room from the overview pose or its orbit extremes
- **THEN** a platform is visible beneath the floor edges — the room never reads as a slab floating in empty background

#### Scenario: Window shows an outside
- **WHEN** the visitor looks at the window
- **THEN** it shows sky elements matching the mood (sun/clouds in day, moon/stars at dusk), not a flat colored rectangle

### Requirement: Mood modes
The experience SHALL offer a visitor-facing day↔dusk toggle. Dusk SHALL dim the warm base lighting, shift the window light and backdrop, and increase the presence of the neon brand accents; day SHALL restore the cozy daylight look. The choice SHALL persist per visitor across reloads, defaulting to dusk, and the transition SHALL animate smoothly.

#### Scenario: Toggling to dusk
- **WHEN** the visitor activates the mood toggle from day
- **THEN** the scene transitions smoothly to a dusk look where neon accents dominate, and every hotspot and label remains clearly visible and interactive

#### Scenario: Choice remembered
- **WHEN** a visitor who chose dusk reloads the site
- **THEN** the scene loads in dusk without requiring the toggle again

### Requirement: Ambient life
The scene SHALL include subtle idle motion (at minimum: drifting dust motes, a blinking cursor on the code monitor, a gently shimmering arcade screen). Ambient life SHALL render only while the page is visible: a hidden tab SHALL render zero frames, and visitors with `prefers-reduced-motion` SHALL get a fully static scene with zero idle renders.

#### Scenario: Visible tab animates
- **WHEN** the page is visible and reduced motion is not requested
- **THEN** the ambient motion plays continuously without affecting hotspot interaction

#### Scenario: Hidden tab renders nothing
- **WHEN** the tab is hidden (visibilitychange)
- **THEN** rendering stops completely until the tab is visible again

#### Scenario: Reduced motion respected
- **WHEN** the visitor's system requests reduced motion
- **THEN** no ambient animation plays and the settled scene renders zero frames, as before this change

### Requirement: Architectural finish
The floor SHALL read as wood planks and the walls SHALL carry a subtle material finish, using textures generated at runtime (no fetched image assets); baseboards SHALL run along both walls. The finish SHALL keep the established palette.

#### Scenario: Finish visible, self-contained
- **WHEN** the production build runs with the network restricted to the site's own origin
- **THEN** plank lines, wall finish, and baseboards render with no failed or external texture requests

## MODIFIED Requirements

### Requirement: Corner-room diorama layout
The room SHALL be a corner diorama (floor plus two walls) laid out so that the overview camera and its clamped orbit range never reveal the open sides. The space beyond the room SHALL read as designed backdrop (platform and sky treatment), never as unfinished void. Props (desk, PC, magazine stack, frame, phone) SHALL be positioned so every hotspot is visible and clickable from the overview pose.

#### Scenario: No missing geometry visible
- **WHEN** the visitor orbits the overview camera to its configured limits
- **THEN** only floor, walls, props, and the designed backdrop (platform/sky) are visible — never the absent walls or an unfinished void

### Requirement: Performance budgets
The experience SHALL clamp device pixel ratio to at most 2, keep the scene under 180 draw calls including the shadow pass, and remain smooth (no perceptible stutter during camera transitions) on a mid-range phone. Rendering SHALL stop entirely (zero frames) when the tab is hidden, and for reduced-motion visitors the settled scene SHALL render zero frames; otherwise ambient life MAY render continuously while the page is visible. The canvas container SHALL use dynamic-viewport sizing (`100dvh`) so mobile browser chrome does not clip the scene.

#### Scenario: Mobile performance
- **WHEN** the site runs on a mid-range phone (or DevTools 4x CPU throttle emulation)
- **THEN** camera fly-to transitions play smoothly and interaction remains responsive

#### Scenario: High-DPI displays
- **WHEN** the site runs on a 3x-DPI device
- **THEN** rendering resolution is clamped to 2x, keeping GPU load bounded

#### Scenario: Hidden tab renders nothing
- **WHEN** the tab is hidden
- **THEN** no frames render until it becomes visible again
