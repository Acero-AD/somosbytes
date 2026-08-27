# visual-experience

## ADDED Requirements

### Requirement: Personal branding
The room SHALL display Diego's logo artwork as a glowing circular wall piece, and the logo's brand colors (neon magenta/purple) SHALL appear in the scene as accent lighting and emissive props so the room is recognizably his. The logo asset SHALL be served from the site's own origin.

#### Scenario: Logo visible from overview
- **WHEN** the visitor looks at the room from the overview pose
- **THEN** the circular logo artwork is visible on a wall, unobstructed, with a visible glow treatment

#### Scenario: Brand colors in the scene
- **WHEN** the room renders in overview
- **THEN** neon magenta/purple accents (lighting wash and emissive props) are visible while the warm cozy base lighting is preserved

## MODIFIED Requirements

### Requirement: Lighting without baking
The scene SHALL be lit by an ambient light plus one shadow-casting directional light, grounded with pre-rendered contact shadows. Decorative accent lights (shadowless colored point lights) and emissive materials MAY supplement the base lighting. The build SHALL NOT fetch lighting assets (e.g., HDR environments) from external CDNs at runtime.

#### Scenario: Self-contained production build
- **WHEN** the production build runs with the network restricted to the site's own origin
- **THEN** the scene renders fully lit with no failed external requests

#### Scenario: Accent lights cast no shadows
- **WHEN** the neon accent lights are active
- **THEN** they add no shadow-map passes (the directional light remains the only shadow caster)

### Requirement: Performance budgets
The experience SHALL clamp device pixel ratio to at most 2, keep the scene under 160 draw calls including the shadow pass, and remain smooth (no perceptible stutter during camera transitions) on a mid-range phone. The idle, settled scene SHALL render zero frames (`frameloop="demand"`). The canvas container SHALL use dynamic-viewport sizing (`100dvh`) so mobile browser chrome does not clip the scene.

#### Scenario: Mobile performance
- **WHEN** the site runs on a mid-range phone (or DevTools 4x CPU throttle emulation)
- **THEN** camera fly-to transitions play smoothly and interaction remains responsive

#### Scenario: High-DPI displays
- **WHEN** the site runs on a 3x-DPI device
- **THEN** rendering resolution is clamped to 2x, keeping GPU load bounded

#### Scenario: Idle renders nothing
- **WHEN** the scene has settled and receives no input
- **THEN** no frames render until the next interaction or camera transition
